import json
import logging
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.exceptions import ValidationError
from django.db import transaction, IntegrityError
from channels.db import database_sync_to_async
from django.utils.timezone import now
from asgiref.sync import sync_to_async
from django.core.cache import cache

from .models import Notification

logger = logging.getLogger(__name__)


class NotificationConsumer(AsyncWebsocketConsumer):
    
    async def connect(self) -> None:
        """
        Connects the consumer to the WebSocket.
        """
        
        self.user = self.scope['user']
        
        if not self.user.is_authenticated:
            logger.warning("User is not authenticated.")
            await self.close()
            return
        
        self.group_name = f"notifications_{self.user.id}"        
        
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()
    
        notifications = await self.get_pending_notifications(limit=50)
        
        for notif in notifications:
            await self.send(text_data=json.dumps({
                "type": "notification",
                "notification": notif
            }))
        
        await self.delete_sent_notifications()


    async def disconnect(self, close_code):
        """
        Disconnects the consumer from the WebSocket.
        """
        logger.info("NotificationConsumer disconnected.")
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )


    async def receive(self, text_data):
        pass

    
    async def send_notification(self, event):
        await self.send(text_data=json.dumps({
            "type": "notification",
            "notification": event["notification"]
        }))
    
    @database_sync_to_async
    def get_pending_notifications(self, limit):
        notifications = Notification.objects.filter(
            user=self.user).order_by('-timestamp')[:limit]
        return [n.data for n in notifications]
    
    @database_sync_to_async
    def delete_sent_notifications(self):
        Notification.objects.filter(user=self.user).delete()
        
        