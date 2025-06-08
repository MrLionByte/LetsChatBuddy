import logging
from .models import CustomUser
from django.contrib.auth import login, logout
from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework.exceptions import ValidationError

from .serializers import (
    UserSerializer,
    LoginSerializer
)
logger = logging.getLogger(__name__)

# Create your views here.


class SignupView(generics.CreateAPIView):
    """
    Create a new user account.
    
    Allows any user to sign up by providing the required user details.
    Returns a success message upon successful creation.

    * `POST` - Create a new user
    
    Request Body:
    - username: User's unique identifier (string, required)
    - password: User's password (string, required)
    - confirm_password: User's password to confirm (string, required)
    - email: User's email address (string, required)
    
    Responses:
    - 201: User created successfully, awaiting admin approval
    - 400: Bad request with error message
    """
    
    queryset = CustomUser.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            logger.error("Error in signup" ,extra={'data': str(e)})
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        response = Response({
            'user': UserSerializer(user).data,
            "access": access_token,
            "message": "User created successfully",
        }, status=status.HTTP_201_CREATED)
            
        response.set_cookie(
            key='refresh',
            value=str(refresh),
            httponly=True,
            secure=True, 
            samesite='None',
            max_age=86400,  # 1 day
        )
            
        response.set_cookie('ua', request.META.get('HTTP_USER_AGENT', ''))
        response.set_cookie('ip', request.META.get('REMOTE_ADDR', ''))
        
        return response
        

class LoginView(views.APIView):
    """
    Login for a user.
    
    Allows any user to login by providing the email and password.
    Returns a success message upon successful login.

    * `POST` - Login as user.
    
    Request Body:
    - email: User's email address (string, required)
    - password: User's password (string, required)
    
    Responses:
    - 200: User logged in successfully
    - 400: Bad request with error message
    - 403: If user is inactive (not approved)
    """
    
    permission_classes = (permissions.AllowAny,)
    
    def post(self, request):
        try:
            serializer = LoginSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']
            login(request, user)
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            response = Response({
                'user': UserSerializer(user).data,
                "access": access_token,
            }, status=status.HTTP_200_OK)
            
            response.set_cookie(
                key='refresh',
                value=str(refresh),
                httponly=True,
                secure=True, 
                samesite='None',
                max_age=86400,  # 1 day
            )
            
            response.set_cookie('ua', request.META.get('HTTP_USER_AGENT', ''))
            response.set_cookie('ip', request.META.get('REMOTE_ADDR', ''))
            
            return response

        except ValidationError as ve:
            logger.error("Validation error during login", extra={'data': str(ve)})
            raise ve

        except Exception as e:
            logger.error("Unexpected error during login", extra={'data': str(e)})
            return Response({
                "error": "internal-error",
                "message": "An unexpected error occurred. Please try again later."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        

class LogoutView(views.APIView):
    """
    Logout for a user.
    
    Allows authenticated user to properly logout by adding refresh
    to the blacklist.
    Returns a success message upon logout.

    * `POST` - Logout.
    
    Request Body:
    - refresh: refresh token to be blacklisted
    
    Responses:
    - 205: User logged out successfully
    - 400: Bad request with error message
    - 403: If user is inactive (not approved)
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception as e:
            logger.exception("Error occurred in Exception", extra={'data': {str(e)}})
            return Response(
                {"message": "Invalid token or already logged out."}
                , status=status.HTTP_400_BAD_REQUEST
            )
            return
        
        logout(request)
        return Response({"message": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)


class SecureTokenRefreshView(TokenRefreshView):
    """
    Logout for a user.
    
    Allows authenticated user to properly logout by adding refresh
    to the blacklist.
    Returns a success message upon logout.

    * `POST` - Logout.
    
    Request Body:
    - refresh: refresh token to be blacklisted
    
    Responses:
    - 205: User logged out successfully
    - 400: Bad request with error message
    - 403: If user is inactive (not approved)
    """
    
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        ip = request.META.get('REMOTE_ADDR', '')

        refresh_token = request.COOKIES.get('refresh')
        
        if not refresh_token:
            logger.error("Error - Refresh token missing")
            return Response({'detail': 'Refresh token missing.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data={'refresh': refresh_token})

        try:
            serializer.is_valid(raise_exception=True)
        except InvalidToken:
            logger.exception('Invalid Token', extra={'data': refresh_token})
            return Response({'detail': 'Invalid or expired token.'}, status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.validated_data, status=status.HTTP_200_OK)
        
