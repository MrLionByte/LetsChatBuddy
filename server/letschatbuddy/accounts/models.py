from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser, Group, Permission


class CustomUser(AbstractUser):
    avatar = models.CharField(max_length=255, blank=True, null=True)
    bio = models.TextField(blank=True)
    tags = models.TextField(blank=True)
    friend_count = models.PositiveIntegerField(default=0)
    last_seen = models.DateTimeField(null=True, blank=True)

    groups = models.ManyToManyField(
        Group,
        related_name='customuser_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='customuser_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def __str__(self):
        return f"{self.username} = {self.email}"
