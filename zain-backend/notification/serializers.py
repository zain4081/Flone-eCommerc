# notifications/serializers.py
from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"

class AddNotifcation(serializers.ModelSerializer):
    """
    Serializer for add New Notification
    """
    class Meta:
        """
        without id
        """
        model = Notification
        fields = ['recipient', 'message']

class EditNotificationReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['read']