"""
ASGI config for letschatbuddy project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from channels.security.websocket import AllowedHostsOriginValidator
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'letschatbuddy.settings')
django.setup()

from chat.routing import websocket_urlpatterns as chat_urls
from notifications.routing import websocket_urlpatterns as notify_urls
from .middleware  import ChatWebsocketMiddleware

django_asgi_app = get_asgi_application()
websocket_urlpatterns = chat_urls + notify_urls

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    'websocket' : ChatWebsocketMiddleware(
        AuthMiddlewareStack(
          URLRouter( websocket_urlpatterns )
        )
    )
})

