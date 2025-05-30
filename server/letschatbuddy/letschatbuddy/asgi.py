"""
ASGI config for letschatbuddy project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from chat.routing import websocket_urlpatterns
from channels.security.websocket import AllowedHostsOriginValidator
from .middleware  import ChatWebsocketMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'letschatbuddy.settings')
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
            (AuthMiddlewareStack(
                URLRouter(
                    websocket_urlpatterns
                    )
                )
            )
        )
})