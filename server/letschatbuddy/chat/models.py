from django.db import models
from django.conf import settings
 
# Create your models here.

class Interest(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="interests_sent",
        on_delete=models.CASCADE)
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='interests_received'
    )
    message = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=(
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ), default='pending')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('sender', 'receiver')
        
    def __str__(self):
        return f"{self.sender.username} {self.sender.id} -> {self.receiver.username} ({self.status})"
    

class ChatRoom(models.Model):
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return " & ".join([user.username for user in self.participants.all()])
    

class Message(models.Model):
    chat_room = models.ForeignKey(ChatRoom, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender.username}: {self.content[:20]}"

