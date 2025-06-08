import logging
from django.contrib.auth import login, logout
from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework.exceptions import ValidationError
from django.db.models import Q, F, Value, Case, When

from accounts.models import CustomUser
from .models import (
    Interest,
    Message
)

from .serializers import (
    UserSuggestionSerializer,
    InterestSendSerializer,
    InterestReceiveSerializer,
    ChatRoomSerializer
)

logger = logging.getLogger(__name__)

# Create your views here.


class NonSuperuserQuerysetMixin:
    def get_queryset(self):
        return super().get_queryset().filter(is_superuser=False)


class SuggestedFriendsAPIView(generics.ListAPIView):
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSuggestionSerializer

    def get_queryset(self):
        user = self.request.user
        search_term = self.request.query_params.get('search', '').strip()
        exclude_ids = self.request.query_params.get('exclude_ids', '')

        exclude_ids = [int(id) for id in exclude_ids.split(',') if id.isdigit()] if exclude_ids else []
        exclude_ids.append(user.id)
        
        interests_queryset = Interest.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).values_list('receiver_id', 'sender_id')
        
        connected_ids = set()
        for sender_id, receiver_id in interests_queryset:
            connected_ids.update([sender_id, receiver_id])
        
        exclude_ids += list(connected_ids)
        
        queryset = CustomUser.objects.filter(
            is_superuser=False).exclude(
                id__in=exclude_ids)
            
        if search_term:
            queryset = queryset.filter(
                Q(username__icontains=search_term) | 
                Q(email__icontains=search_term)
            )
        
        return queryset.order_by('?')[:30]
                    
                    
class InterestCreateAPIView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSuggestionSerializer

    def post(self, request, *args, **kwargs):
        user = request.user
        receiver_id = request.data.get('receiver_id')
        if not receiver_id:
            raise ValidationError("Receiver ID is required.")
        
        try:
            receiver = CustomUser.objects.get(id=receiver_id, is_superuser=False)
        except CustomUser.DoesNotExist:
            raise ValidationError("Receiver does not exist or is a superuser.")
        
        Interest.objects.get_or_create(sender=user, receiver=receiver)
        
        return Response({"message": "Interest request sent successfully."}, status=status.HTTP_201_CREATED)
    
    
class InterestSentListAPIView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = InterestSendSerializer

    def get_queryset(self):
        user = self.request.user
        return Interest.objects.filter(
            sender=user,
            status='pending').order_by(
                '-timestamp')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    
class InterestReceivedListAPIView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = InterestReceiveSerializer

    def get_queryset(self):
        user = self.request.user
        return Interest.objects.filter(
            receiver=user,
            status='pending').order_by(
                '-timestamp')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    
class InterestActionAPIView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        interest_id = request.data.get('interest_id')
        action = request.data.get('action')

        if not interest_id or not action:
            raise ValidationError("Interest ID and action are required.")

        try:
            interest = Interest.objects.get(id=interest_id, receiver=user)
        except Interest.DoesNotExist:
            raise ValidationError("Interest does not exist or you are not the receiver.")

        if action == 'accept':
            interest.status = 'accepted'
        elif action == 'reject':
            interest.status = 'rejected'
        else:
            raise ValidationError("Invalid action. Use 'accept' or 'reject'.")

        interest.save()
        return Response({"message": "Interest updated successfully."}, status=status.HTTP_200_OK)
    

class ChatRoomListAPIView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSuggestionSerializer

    def get_queryset(self):
        user = self.request.user
        
        sender_ids = Interest.objects.filter(
            receiver=user,
            status='accepted'
        ).values_list('sender_id', flat=True)
        
        receiver_ids = Interest.objects.filter(
            sender=user,
            status='accepted'
        ).values_list('receiver_id', flat=True)
                
        connected_user_ids = set(sender_ids).union(set(receiver_ids))
        
        return CustomUser.objects.filter(id__in=connected_user_ids)


