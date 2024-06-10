import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Notification
from channels.db import database_sync_to_async

class NotificationConsumer(AsyncWebsocketConsumer):
    """
    Consumer class for handling WebSocket connections for notifications.
    """

    async def connect(self):
        """
        Called when a WebSocket connection is initiated.
        Validates the user and adds the WebSocket connection to the appropriate group.
        """
        self.user_id = self.scope['url_route']['kwargs']['user_id']

        # Validate user_id
        if not await self.user_exists(self.user_id):
            await self.close()
            return

        self.room_group_name = f'notifications_{self.user_id}'

        # Add to the notifications group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # Accept the WebSocket connection
        await self.accept()
        await self.send_initial_notification()

    async def disconnect(self, close_code):
        """
        Called when the WebSocket connection is closed.
        Removes the WebSocket connection from the notifications group.
        """
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """
        Called when a message is received over the WebSocket.
        Placeholder for handling incoming messages. i have set is to pass.
        """
        pass

    async def send_notification(self, event):
        """
        Sends a notification message to the client.
        """
        message = event['message']
        unread_count = event['unread_count']

        await self.send(text_data=json.dumps({
            'message': message,
            'unread_count': unread_count
        }))

    async def update_count(self, event):
        """
        Sends an update message to the client with the current unread count.
        """
        unread_count = event['unread_count']

        await self.send(text_data=json.dumps({
            'message': "update",
            'unread_count': unread_count
        }))

    async def send_initial_notification(self):
        """
        Sends the initial unread notification count to the client upon connection.
        """
        unread_count = await self.get_unread_count()
        await self.send(text_data=json.dumps({
            'message': "update",
            'unread_count': unread_count
        }))

    @database_sync_to_async
    def get_unread_count(self):
        """
        Retrieves the count of unread notifications for the user.
        
        Returns:
            int: The count of unread notifications.
        """
        return Notification.objects.filter(recipient=self.user_id, read=False).count()

    @database_sync_to_async
    def user_exists(self, user_id):
        """
        Checks if a user with the given ID exists.
        
        Args:
            user_id (int): The ID of the user to check.
        
        Returns:
            bool: True if the user exists, False otherwise.
        """
        from django.contrib.auth import get_user_model
        User = get_user_model()
        return User.objects.filter(id=user_id).exists()
