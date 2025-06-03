from django.urls import path
from .views import SuggestedFriendsAPIView


urlpatterns = [
    path('suggested-friends/', SuggestedFriendsAPIView.as_view(), name='logout'),
    
]