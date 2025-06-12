from rest_framework import serializers
from accounts.models import CustomUser
from django.db.models import Q
from .models import (
    Interest,
    Message
    )


class UserSuggestionSerializer(serializers.ModelSerializer):
    """
    Serializer for user suggestions.
    """
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'avatar', 'last_seen']
        

class InterestSendSerializer(serializers.ModelSerializer):
    receiver = UserSuggestionSerializer()

    class Meta:
        model = Interest
        fields = ['id','receiver', 'status','timestamp']
    

class InterestReceiveSerializer(serializers.ModelSerializer):
    sender = UserSuggestionSerializer()

    class Meta:
        model = Interest
        fields = ['id','sender', 'status', 'timestamp']

        
class ChatRoomSerializer(serializers.ModelSerializer):
    sender = UserSuggestionSerializer()
    receiver = UserSuggestionSerializer()

    class Meta:
        model = Interest
        fields = ['id','sender', 'receiver', 'status', 'timestamp']
    
