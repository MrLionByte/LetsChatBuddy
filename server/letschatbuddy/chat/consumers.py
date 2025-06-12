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

from .services.database_management import save_message, get_last_messages

logger = logging.getLogger(__name__)


class ChatConsumer(AsyncWebsocketConsumer):
    global_status_group = "global_user_status"
    
    async def connect(self) -> None:
        try:
            self.user = self.scope['user']
            self.other_user_id = self.scope['url_route']['kwargs'].get('user_id')

            if not self.other_user_id:
                logger.warning("No user_id provided in URL.")
                await self.close()
                return
            
            sorted_user_ids = sorted([self.user.id, int(self.other_user_id)])
            self.room_name = f"{sorted_user_ids[0]}_{sorted_user_ids[1]}"
            self.room_group_name = f"chat_{self.room_name}"
            
            # subscribe to chat room group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
                )
            
            # subscribe to status group
            await self.channel_layer.group_add(
                self.global_status_group,
                self.channel_name
                )
            await self.channel_layer.group_add(
                'online_users_group',
                self.channel_name
                )

            await self.accept()
            
            await self.set_user_online_status(True)
            await self.broadcast_user_status()

            await self.channel_layer.group_send('online_users_group', {
                'type': 'user_status_broadcast',
                'user_id': self.user.id,
                'is_online': True,
                'last_seen': None
            })
            
            try:
                last_messages = await get_last_messages(self.room_name)
            except Exception as e:
                logger.error(f"Error fetching last messages: {str(e)}")
                last_messages = []
                        
            await self.send(text_data=json.dumps({
                "type": "chat_history",
                "messages": last_messages
            }))
        
        except Exception as e:
            logger.exception(f"Error in connect method: {str(e)}")
            await self.close()
            
            
    async def disconnect(self, close_code: int) -> None:
        try:
            
            await self.set_user_online_status(False)
            await self.broadcast_user_status()
            
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
                )
            await self.channel_layer.group_discard(
                self.global_status_group, 
                self.channel_name
                )
            await self.channel_layer.group_send('online_users_group', {
                'type': 'user_status_broadcast',
                'user_id': self.user.id,
                'is_online': False,
                'last_seen': str(timezone.now())
            })

        except Exception as e:
            logger.error(f"Disconnect error: {str(e)}")
            await self.close(close_code)
        

    @database_sync_to_async
    def set_user_online_status(self, is_online):
        """Set user's online status in cache and database"""
        cache_key = f"user_online_{self.user.id}"
            
        if is_online:
            cache.set(cache_key, True, timeout=300) # for 5 minutes timeout
        else:
            cache.delete(cache_key)
            self.user.last_seen = now()
            self.user.save(update_fields=['last_seen'])
    
    
    @database_sync_to_async
    def get_user_online_status(self, user_id):
        """Get user's online status from cache"""
        
        cache_key = f"user_online_{user_id}"
        status = cache.get(cache_key, False)
        return status
    
    
    async def broadcast_user_status(self):
        """Broadcast user's online status to relevant users"""
        
        try:
            is_online = await self.get_user_online_status(self.user.id)
            last_seen = None
            
            if not is_online:
                await database_sync_to_async(
                    self.user.refresh_from_db)()
                last_seen = self.user.last_seen.isoformat() if self.user.last_seen else None

            await self.channel_layer.group_send(
                self.global_status_group,
                {
                    'type': 'user_status_update',
                    'user_id': self.user.id,
                    'is_online': is_online,
                    'last_seen': last_seen
                }
            )
            
        except Exception as e:
            logger.error(f"Error broadcasting user status: {str(e)}")
            
            
    async def receive(self, text_data: str) -> None:
        try:
            data = json.loads(text_data)
            message_type = data.get('type', '')
            
            if message_type == 'message':
                await self.handle_chat_message(data)
            elif message_type == 'typing':
                await self.handle_typing_status(data)
            elif message_type == 'ping':            
                await self.set_user_online_status(True)
                await self.send(text_data=json.dumps({"type": "pong"}))
            
        except json.JSONDecodeError:
            logger.error("Received invalid JSON data")
        except Exception as e:
            logger.error(f"Error receiving message: {str(e)}")


    async def handle_chat_message(self, data):
        """Handle incoming chat messages"""
        try:
            message = data.get('chat_message', '')
            if not message:
                return
            
            message_content = message.get('text', '')
            if not message_content.strip():
                return
            
            saved_message = await save_message(self.room_name, self.user, message_content)
        
            new_message = {
                "type": "message",
                "message": {
                    "id": saved_message.id,
                    "chat_id": self.room_name,
                    "text": message_content,
                    "sender": self.user.username,
                    "sender_user_id": self.user.id,
                    "timestamp": saved_message.timestamp.isoformat(),
                }
            }
            
            # message to user-to-user chat room
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message_data': new_message,
                }
            )
            
        except Exception as e:
            logger.error(f"Error handling chat message: {str(e)}")
    
    
    async def handle_typing_status(self, data):
        """Handle typing status updates"""
        try:
            is_typing = data.get('is_typing', False)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'typing_status',
                    'user_id': self.user.id,
                    'username': self.user.username,
                    'is_typing': is_typing
                }
            )
        except Exception as e:
            logger.error(f"Error handling typing status: {str(e)}")
            

    async def chat_message(self, event):
        try:
            message_data = event['message_data']
            await self.send(
                text_data=json.dumps({
                    "type": "message",
                    "message": message_data
                }))
        except Exception as e:
            logger.error(f"Error sending message: {str(e)}")
            await self.close()
            

    async def user_status_update(self, event):
        """Send user status update to WebSocket"""
        try:
            await self.send(text_data=json.dumps({
                    "type": "user_status",
                    "user_id": event['user_id'],
                    "is_online": event['is_online'],
                    "last_seen": event['last_seen']
                }))
        except Exception as e:
            logger.error(f"Error sending user status update: {str(e)}")
    
    
    async def typing_status(self, event):
        """Send typing status to WebSocket"""
        try:
            if event['user_id'] != self.user.id:
                await self.send(text_data=json.dumps({
                    "type": "typing_status",
                    "user_id": event['user_id'],
                    "username": event['username'],
                    "is_typing": event['is_typing']
                }))
        except Exception as e:
            logger.error(f"Error sending typing status: {str(e)}")
    
    
    async def user_status_broadcast(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_status',
            'user_id': event['user_id'],
            'is_online': event['is_online'],
            'last_seen': event['last_seen'],
        }))
