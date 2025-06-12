from django.urls import path
from .views import KeepWebSiteLive


urlpatterns = [

    path("keep-website-live", KeepWebSiteLive.as_view())

]
