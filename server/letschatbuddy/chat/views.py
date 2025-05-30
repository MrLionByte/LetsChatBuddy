import logging
from django.contrib.auth import login, logout
from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework.exceptions import ValidationError

from .models import (
    Interest,
    ChatRoom,
    Message
)

logger = logging.getLogger(__name__)
# Create your views here.


class DiscoverUserView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        friends = Interest.objects.filter()
