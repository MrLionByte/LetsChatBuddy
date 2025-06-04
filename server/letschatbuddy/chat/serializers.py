from rest_framework import serializers
from .models import Interest, ChatRoom, Message
from accounts.models import CustomUser
from django.db.models import Q


class UserSuggestionSerializer(serializers.ModelSerializer):
    """
    Serializer for user suggestions.
    """
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'avatar']
        

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
    
