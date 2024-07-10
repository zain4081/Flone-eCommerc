from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from notification.models import Notification
from django.utils import timezone

class NotificationServiceTests(TestCase):
    """
    Unit tests for notification services:
    - UserNotifications: Retrieve unread notifications.
    - AddNotification: Add a new notification.
    - EditNotificationReadStatus: Mark notifications as read.
    """

    def setUp(self):
        """
        Set up test data:
        - Create a test user.
        - Create sample notifications for the user.
        """
        self.time = timezone.now()
        self.user = get_user_model().objects.create_user(
            email='test@example.com',
            name='Test User',
            role='editor',
            phone_number='+921234567890',
            max_otp_out=self.time,
            password='password123',
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
        # Create some notifications for testing
        Notification.objects.create(recipient=self.user, message='Test Notification 1')
        Notification.objects.create(recipient=self.user, message='Test Notification 2')

    def test_user_notifications(self):
        """
        Test case for UserNotifications API view.
        Checks if unread notifications are retrieved correctly.
        """
        response = self.client.get('/notification/list/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('notifications', response.data)
        self.assertEqual(len(response.data['notifications']), 2)  # Assuming 2 notifications created in setUp()

    def test_add_notification(self):
        """
        Test case for AddNotification API view.
        Verifies that a new notification can be added successfully.
        """
        data = {'recipient': self.user.id, 'message': 'New Test Notification'}
        response = self.client.post('/notification/add/', data)
        self.assertEqual(response.status_code, 201)

        # Check if notification count increased
        notifications_count = Notification.objects.filter(recipient=self.user).count()
        self.assertEqual(notifications_count, 3)

    def test_edit_notification_read_status(self):
        """
        Test case for EditNotificationReadStatus API view.
        Ensures that all unread notifications can be marked as read correctly.
        """
        # Initially, all notifications are unread
        unread_count_before = Notification.objects.filter(recipient=self.user, read=False).count()
        
        response = self.client.put('/notification/mark-as-read/')
        self.assertEqual(response.status_code, 200)

        # After marking as read, count of unread notifications should be zero
        unread_count_after = Notification.objects.filter(recipient=self.user, read=False).count()
        self.assertEqual(unread_count_after, 0)
