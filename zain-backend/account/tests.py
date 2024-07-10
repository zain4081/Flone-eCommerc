from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone

class UserModelTests(TestCase):
    """
    Test cases for user model functionality.
    """

    time = timezone.now()

    def setUp(self):
        """
        Setup method to initialize the User model for testing.
        """
        self.User = get_user_model()

    def test_create_user(self):
        """
        Test case to create a regular user and verify its attributes.
        """
        user = self.User.objects.create_user(
            email='test@example.com',
            name='Test User',
            role='editor',
            phone_number='+921234567890',
            max_otp_out=self.time,
            password='password123'
        )

        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.name, 'Test User')
        self.assertEqual(user.role, 'editor')
        self.assertEqual(user.phone_number, '+921234567890')
        self.assertEqual(user.max_otp_out, self.time)
        self.assertTrue(user.check_password('password123'))
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_admin)

    def test_create_user_without_email(self):
        """
        Test case to ensure ValueError is raised when creating a user without an email.
        """
        with self.assertRaises(ValueError):
            self.User.objects.create_user(
                email='',
                name='Test User',
                role='editor',
                phone_number='+921234567890',
                max_otp_out=self.time,
                password='password123'
            )

    def test_create_user_without_password(self):
        """
        Test case to ensure ValueError is raised when creating a user without a password.
        """
        with self.assertRaises(ValueError):
            self.User.objects.create_user(
                email='test@example.com',
                name='Test User',
                role='editor',
                phone_number='+921234567890',
                max_otp_out=self.time,
                password=''
            )

    def test_create_superuser(self):
        """
        Test case to create a superuser and verify its attributes.
        """
        superuser = self.User.objects.create_superuser(
            email='admin@example.com',
            name='Admin User',
            password='admin123',
        )

        self.assertTrue(superuser.is_admin)
        self.assertTrue(superuser.is_staff)