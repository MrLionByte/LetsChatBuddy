import logging
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.db import close_old_connections
from rest_framework.exceptions import AuthenticationFailed
from django.core.exceptions import PermissionDenied
from django.utils.functional import SimpleLazyObject
from .authentication import JWTAuthentication
from .user_utils import get_user

logger = logging.getLogger(__name__)


class ChatWebsocketMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive=None, send=None):
        
        close_old_connections()
        
        query_string = scope.get("query_string", b"").decode("utf-8")
        query_params = dict(q.split('=') for q in query_string.split("&") if "=" in q)
        
        token = query_params.get("token")
        
        if not token:
            await self.close_connection(send, 4000, "Token missing")
            return
        
        try:
            user_data = await JWTAuthentication().authenticate(token)
            if not user_data:
                logger.error("Token validation failed.")
                await self.close_connection(send, 4001, "Invalid token")
                return
            
            print(f"AT THIS POINT: {user_data}")
            
            user = await self.get_user(user_data["user_id"])
            
            if not user:
                logger.error("User not found for the provided token.")
                await self.close_connection(send, 4002, "User not found")
                return
            
            scope["user"] = user
            return await super().__call__(scope, receive, send)
        
        except AuthenticationFailed as e:
            logger.error(f"Authentication failed: {str(e)}")
            await self.close_connection(send, 4003, str(e))
        except PermissionDenied as e:
            logger.error(f"Permission denied: {str(e)}")
            await self.close_connection(send, 4004, str(e))
        except Exception as e:
            logger.error(f"An unexpected error occurred: {str(e)}")
            await self.close_connection(send, 5000, "Internal server error")
        
        
    async def close_connection(self, send, code, reason):
        await send({
            "type": "websocket.close",
            "code": code,
            "reason": reason
        })