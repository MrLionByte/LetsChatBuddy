from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

# Create your views here.


class KeepWebSiteLive(APIView):
    """
    Keep the website live by responding to a simple GET request.
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        return Response(
            {"status": "Website is live"}, 
            status=status.HTTP_200_OK
            )