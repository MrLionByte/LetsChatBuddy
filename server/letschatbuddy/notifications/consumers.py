import json
import logging
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer

logger = logging.getLogger(__name__)


class NotificationConsumer(AsyncWebsocketConsumer):
    
    async def connect(self) -> None:
        """
        Connects the consumer to the WebSocket.
        """
        try:
            self.user = self.scope['user']        
            self.group_name = f"notifications_{self.user.id}"        
        
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            await self.accept()
        except Exception as e:
            logger.error(f"Error in Notification connect: {str(e)}")
            await self.close() 


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
        try:
            data = json.loads(text_data)
            if data.get("type") == "ping":
                await self.send(
                    text_data=json.dumps(
                        {"type": "pong"})
                    )
        except Exception as e:
            logger.error(f"Error handling receive: {str(e)}")
        
        
    async def send_notification(self, event):
        notification = event.get("notification")
        if notification:
            await self.send(text_data=json.dumps({
                "type": "notification",
                "notification": notification
            }))
