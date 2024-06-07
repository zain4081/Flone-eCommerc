import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Notification
from asgiref.sync import sync_to_async


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
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
        # Function to send a message to the client upon connection
        message = "update"
        unread_count = await sync_to_async(Notification.objects.filter(recipient=self.user_id, read=False).count)()
        await self.send(text_data=json.dumps({
            'message': message,
            'unread_count': unread_count
        }))

