from django.urls import path
from .views import SuggestedFriendsAPIView, SendInterestRequestAPIView


urlpatterns = [
    path('suggested-friends/', SuggestedFriendsAPIView.as_view(), name='logout'),
    path('interests/', SendInterestRequestAPIView.as_view(), name='interest')
]