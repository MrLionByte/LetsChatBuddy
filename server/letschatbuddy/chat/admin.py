from django.contrib import admin
from .models import (
    Interest,
    ChatRoom,
    Message
    )
# Register your models here.

admin.site.register(Interest)
admin.site.register(ChatRoom)
admin.site.register(Message)
