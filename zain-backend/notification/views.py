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
    API view to retrieve unread notifications for the authenticated user.

    This view handles HTTP GET requests to retrieve unread notifications
    for the authenticated user. Additionally, an update is sent via WebSocket
    to notify the client of the unread notification count.
    """
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Handles HTTP GET requests to retrieve unread notifications.

        This method retrieves all unread notifications for the authenticated user.
        If there are unread notifications, it sends a WebSocket message to update
        the unread notification count for the user.
        """
        try:
            notifications = Notification.objects.filter(read=False, recipient=request.user)
            serializer = NotificationSerializer(notifications, many=True)
            data = {
                "notifications": serializer.data,
                "unread_count": notifications.count(),
            }
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
                return Response({'msg':'Notify Successfully', 'notifications': data['notifications']}, status=status.HTTP_200_OK)
            return Response({'error': 'No unread notifications to send update'}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AddNotification(APIView):
    """
    API view to add a new notification.

    This view handles HTTP POST requests to create a new notification.
    Additionally, it sends a WebSocket message to notify the client
    of the new notification and update the unread notification count.
    """
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Handles HTTP POST requests to add a new notification.

        This method validates the request data, creates a new notification,
        and sends a WebSocket message to notify the recipient of the new
        notification and update the unread notification count.
        """
        try:
            serializer = AddNotifcation(data=request.data)
            serializer.is_valid(raise_exception=True)
            notification = serializer.save()
            unread_count = Notification.objects.filter(read=False, recipient=notification.recipient.id).count()
            
            if notification:
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
                return Response({'msg': 'Notify Successfully'}, status=status.HTTP_201_CREATED)
            return Response({'error': 'Failed to create notification'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class EditNotificationReadStatus(APIView):
    """
    API view to mark notifications as read for the authenticated user.

    This view handles HTTP PUT requests to update the read status of notifications
    for the authenticated user. All unread notifications are marked as read.
    Additionally, an update is sent via WebSocket to notify the client of the change
    in unread notification count.

    Methods:
        put(request):
            Marks all unread notifications as read of requesting user and sends a WebSocket update.
    """
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def put(self, request):
        """
        Handles HTTP PUT requests to mark notifications as read.

        This method updates all unread notifications for the authenticated user
        to be marked as read. If the operation is successful, it sends a WebSocket
        message to update the unread notification count for the user.
        """
        try:
            # Ensure that all transactions are Atomic to avoid Race condition issues
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
