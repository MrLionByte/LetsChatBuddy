import logging
from django.contrib.auth import login, logout
from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework.exceptions import ValidationError
from django.db.models import Q

from accounts.models import CustomUser
from .models import (
    Interest,
    ChatRoom,
    Message
)

from .serializers import (
    UserSuggestionSerializer
)

logger = logging.getLogger(__name__)

# Create your views here.


class NonSuperuserQuerysetMixin:
    def get_queryset(self):
        return super().get_queryset().filter(is_superuser=False)


class SuggestedFriendsAPIView(NonSuperuserQuerysetMixin,generics.ListAPIView):
    
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
                    
                    
class SendInterestRequestAPIView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSuggestionSerializer

    def post(self, request, *args, **kwargs):
        user = request.user
        receiver_id = request.data.get('receiver_id')
        print(f"Receiver ID: {receiver_id}")
        if not receiver_id:
            raise ValidationError("Receiver ID is required.")
        
        try:
            receiver = CustomUser.objects.get(id=receiver_id, is_superuser=False)
        except CustomUser.DoesNotExist:
            raise ValidationError("Receiver does not exist or is a superuser.")
        
        Interest.objects.get_or_create(sender=user, receiver=receiver)
        
        return Response({"message": "Interest request sent successfully."}, status=status.HTTP_201_CREATED)
    
    
