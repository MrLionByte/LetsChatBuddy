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
    read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('sender', 'receiver')
        
    def __str__(self):
        return f"{self.sender.username} {self.sender.id} -> {self.receiver.username} ({self.status})"

class Message(models.Model):
    user_pair_id = models.CharField(max_length=255, default="anonymous")
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['user_pair_id', 'timestamp']),
        ]

    def __str__(self):
        return f"{self.sender.username}: {self.content[:20]}"

