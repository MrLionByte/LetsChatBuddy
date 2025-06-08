import redis
import json
from django.conf import settings
from urllib.parse import urlparse
from channels.db import database_sync_to_async

redis_url = urlparse(settings.REDIS_URL)

redis_client = redis.StrictRedis(
    host=redis_url.hostname, 
    port=redis_url.port,   
    username=redis_url.username,
    password=redis_url.password,
    db=2,
    ssl=redis_url.scheme == 'rediss', 
    decode_responses=True  
)

CACHE_TIMEOUT = settings.REDIS_CACHE_TIMEOUT  # 1 hour


@database_sync_to_async
def cache_message(room_id: str, message: dict) -> None:
    """
    Cache a chat message with a key based on chat_id and message ID.
    """
    key = room_id
    redis_client.rpush(key, json.dumps(message))
    redis_client.expire(key, CACHE_TIMEOUT)


@database_sync_to_async
def get_cached_messages(room_id: str) -> list:
    """
    Retrieve cached messages for a given chat_id.
    """
    key = f"chat:{room_id}"
    raw_messages = redis_client.lrange(key, 0, -1)
    return [json.loads(msg) for msg in raw_messages]
