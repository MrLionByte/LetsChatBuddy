import logging
from django.contrib.auth import login, logout
from rest_framework import generics, permissions, status, views
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework.exceptions import ValidationError
from django.db.models import Q, F, Value, Case, When

from accounts.models import CustomUser

from notifications.services import send_notification_to_user

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


class SuggestedFriendsPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 50


class SuggestedFriendsAPIView(generics.ListAPIView):
    
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSuggestionSerializer
    pagination_class = SuggestedFriendsPagination

    def get_queryset(self):
        user = self.request.user
        sent_interests = Interest.objects.filter(sender=user).values_list('receiver_id', flat=True)
        received_interests = Interest.objects.filter(receiver=user).values_list('sender_id', flat=True)
        superuser_ids = list(CustomUser.objects.filter(is_superuser=True).values_list('id', flat=True))

        exclude_ids = set(sent_interests)
        exclude_ids.update(received_interests, superuser_ids)
        exclude_ids.add(user.id)    

        queryset = CustomUser.objects.exclude(id__in=exclude_ids)

        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(username__icontains=search)

        return queryset.order_by('?')
                        
                    
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
            sender=user, read=False).order_by(
                '-timestamp')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        for i in queryset:
            print(f"{i.id}, sender {i.sender.username} -> receiver {i.receiver.username} {i.status}, {i.read}")

        serializer = self.get_serializer(queryset, many=True)

        qu11eryset.filter(read=False).exclude(status='pending').update(read=True)
        for i in queryset:
            print(f"{i.id}, sender {i.sender.username} -> receiver {i.receiver.username} {i.status}, {i.read}")
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


    # def list(self, request, *args, **kwargs):
    #     queryset = self.get_queryset()
    #     serializer = self.get_serializer(queryset, many=True)
    #     return Response(serializer.data)
    