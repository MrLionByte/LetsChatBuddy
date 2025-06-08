from django.utils.timezone import localtime
from django.core.exceptions import ObjectDoesNotExist
from chat.models import Message
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from django.db.models import F, Func, Value, CharField
from django.db.models.functions import Cast

User = get_user_model()


@database_sync_to_async
def save_message(room_id, user, message: str):
    """
    Save a message to the database.
    
    Args:
        room_id (str): The chat room where the message is sent.
        user (User): The user sending the message.
        message (str): The content of the message.
    
    Returns:
        Message: The saved message object.
    """
    
    message_obj = Message.objects.create(
        user_pair_id=room_id,
        sender=user,
        content=message
    )
    return message_obj


@database_sync_to_async
def get_last_messages(room_id):
    """
    Get last 20 messages between two users in a group.
    
    Args:
        user_pair_id (str): The chat room where the message is sent.
        
    Returns:
        Message: The saved message object of last 20 messages.
    """
    messages = (
        Message.objects
        .filter(user_pair_id=room_id)
        .annotate(
            sender_user_id=F('sender__id'),  # renamed from sender_id to sender_user_id
            sender_username=F('sender__username'),
            chat_id_value=Value(room_id, output_field=CharField()),
            timestamp_iso=Cast('timestamp', output_field=CharField())
        )
        .order_by('-timestamp')[:20]
        .values(
            'id',
            'chat_id_value',
            'sender_user_id',
            'sender_username',
            'content',
            'timestamp_iso',
            'read',
        )
    )

    return list(messages)[::-1]