from rest_framework import serializers
from .models import Interest, ChatRoom, Message
from accounts.models import CustomUser


class UserSuggestionSerializer(serializers.ModelSerializer):
    """
    Serializer for user suggestions.
    """
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'avatar']
    
    