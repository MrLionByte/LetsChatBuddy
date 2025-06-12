from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def send_notification_to_user(user_id, notification_data):
    channel_layer = get_channel_layer()
    group_name = f"notification_{user_id}"
    
    try:
        group_channels = async_to_sync(
            channel_layer.group_channels)(
                group_name)
    except Exception:
        group_channels = []
        
    if group_channels:
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                "type": "send_notification",
                "notification": notification_data
            }
        )
    else:
        Notification.objects.create(
            user__id = user_id,
            event=notification_data.get('event'),
            data=notification_data
        )