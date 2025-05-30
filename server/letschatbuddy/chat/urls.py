from django.urls import path
from .views import DiscoverUserView


urlpatterns = [
    path('discover-user/', DiscoverUserView.as_view(), name='logout'),
    
]