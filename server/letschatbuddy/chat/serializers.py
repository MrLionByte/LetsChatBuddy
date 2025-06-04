from rest_framework import serializers
from .models import Interest, ChatRoom, Message
from accounts.models import CustomUser
from django.db.models import Q


class UserSuggestionSerializer(serializers.ModelSerializer):
    """
    Serializer for user suggestions.
    """
    
    isInterestSent = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'avatar', 'isInterestSent']
    
    
    def get_isInterestSent(self, obj):
        """
        Check if an interest has been sent to the user.
        """
        
        request_user = self.context.get('request').user
        
        print("request_user.id", request_user.id, "obj.id", obj.id)
        print(Interest.objects.filter(
            Q(sender=request_user, receiver=obj) |
            Q(sender=obj, receiver=request_user)
        ).exists())
        return Interest.objects.filter(
            Q(sender=request_user, receiver=obj) |
            Q(sender=obj, receiver=request_user)
        ).exists()

