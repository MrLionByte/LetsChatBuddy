from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async


user = get_user_model()


@sync_to_async
def get_user(user_id):
    try:
        return user.objects.get(id=user_id)
    except user.DoesNotExist:
        return None
    
    