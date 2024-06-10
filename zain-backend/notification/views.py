# notifications/views.py
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from account.renderers import UserRenderer
from .serializers import (NotificationSerializer,
                          AddNotifcation)
from rest_framework.response import Response
from rest_framework import status
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.db import transaction
    
class UserNotifications(APIView):
    """
    API view for user profile management.
    """
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        """
        Handles GET request for user profile.

        Args:
        - request: Request object containing the user profile data.
        - format: Optional format suffix.

        Returns:
        - Response: Response object with user profile data.
        """
        
        notifications = Notification.objects.filter(read=False, recipient=request.user)
        serializer = NotificationSerializer(notifications, many=True)
        
        if notifications:
              # Send update count via WebSocket
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f'notifications_{request.user.id}',
                {
                    'type': 'send_notification',
                    'message': 'update',
                    'unread_count': notifications.count(),
                }
                )
        data = {
            "notifications": serializer.data,
            "unread_count": notifications.count(),
        }
        return Response(data, status=status.HTTP_200_OK)
    

class AddNotification(APIView):
    renderer_classes= [UserRenderer]
    permission_classes= [IsAuthenticated]
    
    def post(self, request):
        serializer = AddNotifcation(data=request.data)
        serializer.is_valid(raise_exception=True)
        notification = serializer.save()
        unread_count = Notification.objects.filter(read=False, recipient=notification.recipient.id).count()
        if(notification):
            # Send notification via WebSocket
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f'notifications_{notification.recipient.id}',
                {
                    'type': 'send_notification',
                    'message': notification.message,
                    'unread_count': unread_count,
                }
                )
            return Response({'msg':'Notify Successfully'},
                        status=status.HTTP_201_CREATED)
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)
        
class EditNotificationReadStatus(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def put(self, request):
        try:
            # Ensure atomic database operations
            with transaction.atomic():
                notification_query = Notification.objects.filter(recipient=request.user, read=False).update(read=True)
                updated_notifications = Notification.objects.filter(read=False, recipient=request.user)

                if notification_query:
                    # Send update count via WebSocket
                    channel_layer = get_channel_layer()
                    async_to_sync(channel_layer.group_send)(
                        f'notifications_{request.user.id}',
                        {
                            'type': 'send_notification',
                            'message': 'update',
                            'unread_count': updated_notifications.count(),
                        }
                    )
                    return Response({'msg': 'Successfully Marked as Read'}, status=status.HTTP_200_OK)

            return Response({'error': 'Error in updating count'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
