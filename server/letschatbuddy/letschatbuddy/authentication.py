import logging
from django.core.exceptions import PermissionDenied
from jwt import ExpiredSignatureError, InvalidTokenError
from .jwt_utils import decode_jwt_token

logger = logging.getLogger(__name__)


class JWTAuthentication:
    async def authenticate(self, token):
        try:
            payload =  decode_jwt_token(token)
            user_id = payload.get("user_id")
            if not user_id:
                raise PermissionDenied("Invalid token: user_id not found")
            return payload
        
        except ExpiredSignatureError:
            logger.warning("JWT token has expired.")
            raise PermissionDenied("Token has expired")
        except InvalidTokenError:
            logger.warning("Invalid JWT token.")
            raise PermissionDenied("Invalid token")
        except Exception as e:
            logger.error(f"JWT decoding failed: {str(e)}")
            raise PermissionDenied("Token decoding failed")