import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Notification
from channels.db import database_sync_to_async

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']

        # Validate user_id (assuming User model is imported)
        if not await self.user_exists(self.user_id):
            await self.close()
            return

        self.room_group_name = f'notifications_{self.user_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        await self.send_initial_notification()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        # Optional: handle incoming messages
        pass

    async def send_notification(self, event):
        message = event['message']
        unread_count = event['unread_count']

        await self.send(text_data=json.dumps({
            'message': message,
            'unread_count': unread_count
        }))

    async def update_count(self, event):
        unread_count = event['unread_count']

        await self.send(text_data=json.dumps({
            'message': "update",
            'unread_count': unread_count
        }))

    async def send_initial_notification(self):
        unread_count = await self.get_unread_count()
        await self.send(text_data=json.dumps({
            'message': "update",
            'unread_count': unread_count
        }))

    @database_sync_to_async
    def get_unread_count(self):
        return Notification.objects.filter(recipient=self.user_id, read=False).count()

    @database_sync_to_async
    def user_exists(self, user_id):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        return User.objects.filter(id=user_id).exists()
