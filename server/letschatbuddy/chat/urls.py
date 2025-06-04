from django.urls import path
from .views import (
    SuggestedFriendsAPIView,
    InterestCreateAPIView,
    InterestSentListAPIView,
    InterestReceivedListAPIView,
    InterestActionAPIView,
    ChatRoomListAPIView
    )


urlpatterns = [
    path('suggested-friends/', SuggestedFriendsAPIView.as_view(), name='suggested_friends'),
    path('interests/', InterestCreateAPIView.as_view(), name='create_interest'),
    path('interests-send/', InterestSentListAPIView.as_view(), name='interest_send'),
    path('interests-receive/', InterestReceivedListAPIView.as_view(), name='interest_receive'),
    path('interests-action/', InterestActionAPIView.as_view(), name='interest_action'),
    path('active-chats/', ChatRoomListAPIView.as_view(), name='chatroom'),
]
