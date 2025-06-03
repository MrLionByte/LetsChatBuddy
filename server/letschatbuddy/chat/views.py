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
        exclude_ids.append(user.id)
        
        interests_queryset = Interest.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).values_list('receiver_id', 'sender_id')
        
        connected_users_ids = set()
        for sender_id, receiver_id in interests_queryset:
            connected_users_ids.add(sender_id)
            connected_users_ids.add(receiver_id)
        
        exclude_ids += list(connected_users_ids)
        
        queryset = CustomUser.objects.filter(
            is_superuser=False).exclude(
                id__in=exclude_ids)
            
        if search_term:
            queryset = queryset.filter(
                Q(username__icontains=search_term) | 
                Q(email__icontains=search_term)
            )
        
        return queryset.order_by('?')[:30]
                    