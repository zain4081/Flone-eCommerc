"""
Serializers for user authentication and management.
"""
import datetime
import os
import random
from django.utils import timezone
from rest_framework import serializers
# from django.contrib.auth.tokens import PasswordResetTokenGenerator
# from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
# from django.utils.encoding import smart_str, force_bytes
# from django.utils.encoding import DjangoUnicodeDecodeError
from account.models import User
from account.utils import Util

from django.conf import settings

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.

    This serializer includes a 'password2' field for confirming the password.
    It validates the password and confirm password fields and creates a new user.
    It also sends an email for email verification.
    """
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    class Meta:
        """
        only selected fields are allowed for registertion
        """
        model = User
        fields = ['email', 'name', 'phone_number', 'password', 'password2', 'tc', 'role']
        extra_kwargs = {
            'password': {'write_only': True}
            }
    def create(self, validated_data):
        """
        Creates a new user and sends an email for email verification.
        """
        password = validated_data.pop('password')
        password2 = validated_data.pop('password2')
        max_otp_out = timezone.now()
        if password != password2:
            raise serializers.ValidationError("Password and Confirm Password don't match")
        user = User.objects.create_user(
            **validated_data, 
            password=password,
            max_otp_out=max_otp_out,
            )
        print("user", user)
        user.generate_verification_token()
        user.save()
        email_list = [user.email]

        verification_link = f"{os.environ.get('WEBSITE')}/verify-email/{user.verification_token}"
        print(verification_link)
        data = {
            'subject': 'Email verification',
            'body': f"Please click the following link to verify your email.<br><a href='{verification_link}'>Activation Link</a>",
            'to_email': email_list
        }
        Util.send_email(data)
        return user

class UserLoginSerializer(serializers.ModelSerializer):
    """
    Serializer for user login.
    """

    email = serializers.EmailField(max_length=255)
    class Meta:
        """
        only Email and Password are allowed
        """
        model = User
        fields = ['email', 'password']

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile.
    """
    class Meta:
        """sending email name id with role of user on successful login
        """
        model = User
        fields = ['id', 'email', 'name', 'role', 'is_phone_verified']

class UserChangePasswordSerializer(serializers.Serializer): # pylint: disable=abstract-method
    """
    Serializer for changing user password.
    """
    password = serializers.CharField(
        max_length=255,
        style={'input_type': 'password'},
        write_only=True)
    password2 = serializers.CharField(
        max_length=255,
        style={'input_type': 'password'},
        write_only=True)
    class Meta:
        """
        password and password2 for validation
        """
        fields = ['password', 'password2']
    def validate(self, attrs):
        """
        Validates the password and confirm password fields.
        """
        password = attrs.get('password')
        password2 = attrs.get('password2')
        user = self.context.get('user')
        if password != password2:
            raise serializers.ValidationError("Password and Confirm Password doesn't match")
        user.set_password(password)
        user.save()
        return attrs

# class SendPasswordResetEmailSerializer(serializers.Serializer):
#     """
#     Serializer for sending a password reset email.
#     """
#     email = serializers.EmailField(max_length=255)
#     class Meta:
#         """
#         sending password reset email on email
#         """
#         fields = ['email']
#     def validate(self, attrs):
#         """
#         Validates the email and sends a password reset email.
#         """
#         email = attrs.get('email')
#         if User.objects.filter(email=email).exists():
#             user = User.objects.get(email=email)
#             uid = urlsafe_base64_encode(force_bytes(user.id))
#             print('Encoded UID', uid)
#             token = PasswordResetTokenGenerator().make_token(user)
#             print('Password Reset Token', token)
#             link = 'http://localhost:3000/api/user/reset/'+uid+'/'+token
#             print('Password Reset Link', link)
#             # Send EMail
#             body = 'Click Following Link to Reset Your Password '+link
#             data = {
#                 'subject': 'Reset Your Password',
#                 'body': body,
#                 'to_email': user.email
#             }
#             Util.send_email(data)
#             return attrs
#         else:
#             raise serializers.ValidationError('You are not a Registered User')

# class UserPasswordResetSerializer(serializers.Serializer):
#     """
#     Serializer for resetting user password.
#     """
#     password = serializers.CharField(
#         max_length=255,
#         style={'input_type': 'password'},
#         write_only=True)
#     password2 = serializers.CharField(
#         max_length=255,
#         style={'input_type': 'password'},
#         write_only=True)
#     class Meta:
#         """
#         password and password2 for validation
#         """
#         fields = ['password', 'password2']
#     def validate(self, attrs):
#         """
#         Validates the password and confirm password fields and resets the password.
#         """
#         try:
#             password = attrs.get('password')
#             password2 = attrs.get('password2')
#             uid = self.context.get('uid')
#             token = self.context.get('token')
#             if password != password2:
#                 raise serializers.ValidationError("Password and Confirm Password doesn't match")
#             id = smart_str(urlsafe_base64_decode(uid))
#             user = User.objects.get(id=id)
#             if not PasswordResetTokenGenerator().check_token(user, token):
#                 raise serializers.ValidationError('Token is not Valid or Expired')
#             user.set_password(password)
#             user.save()
#             return attrs
#         except DjangoUnicodeDecodeError as identifier:
#             PasswordResetTokenGenerator().check_token(user, token)
#             raise serializers.ValidationError('Token is not Valid or Expired')
