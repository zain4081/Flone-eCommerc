"""
Module: Contains views for user authentication and profile management.
"""
# Third party imports
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

# Local application/library specific imports
from account.models import User
from account.serializers import (
    UserChangePasswordSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    UserRegistrationSerializer
)
from account.renderers import UserRenderer

def get_tokens_for_user(user):
    """
    Generates JWT tokens for the given user.

    Args:
    - user: User instance for which tokens are to be generated.

    Returns:
    - dict: A dictionary containing 'refresh' and 'access' tokens as strings.
    """
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserRegistrationView(APIView):
    """
    API view for user registration.
    """
    renderer_classes = [UserRenderer]
    def post(self, request):
        """
        Handles POST request for user registration.

        Args:
        - request: Request object containing user registration data.
        - format: Optional format suffix.

        Returns:
        - Response: Response object with registration status and token.
        """
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = get_tokens_for_user(user)
        return Response({'token':token, 'msg':'Registration Successful'},
                        status=status.HTTP_201_CREATED)
class UserEmailVerification(APIView):
    """
    API view for verifying user email.
    """
    renderer_classes = [UserRenderer]
    def get(self, request):
        """
        Handles GET request for email verification.

        Args:
        - request: Request object containing the verification token in the Authorization header.

        Returns:
        - Response: Response object with verification status.
        """
        token = request.headers.get('Authorization')
        if not token:
            return Response({'error': 'Token is missing'},
                            status=status.HTTP_400_BAD_REQUEST)
        parts = token.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return Response({'error': 'Invalid token format'},
                            status=status.HTTP_400_BAD_REQUEST)
        token = parts[1]
        user = User.objects.filter(verification_token=token).first()
        if not user:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        if user.tc:
            return Response({'msg': 'Email already verified'}, status=status.HTTP_200_OK)
        if user.verify_email(token):
            return Response({'msg': 'Email verified successfully'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    """
    API view for user login.
    """
    renderer_classes = [UserRenderer]
    def post(self, request):
        """
        Handles POST request for user login.

        Args:
        - request: Request object containing user login data.
        - format: Optional format suffix.

        Returns:
        - Response: Response object with login status and token.
        """
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data.get('email')
        password = serializer.data.get('password')
        user = authenticate(email=email, password=password)
        if user is not None:
            if user.tc:
                token = get_tokens_for_user(user)
                return Response({'token':token, 'msg':'Login Success'},
                    status=status.HTTP_200_OK)
            return Response(
                {'errors':{'non_field_errors':['Email Not Verified']}},
                    status=status.HTTP_400_BAD_REQUEST)
        return Response(
            {'errors':{'non_field_errors':['Email or Password is not Valid']}},
                status=status.HTTP_404_NOT_FOUND)

class AdminLoginView(APIView):
    """
    API view for admin login.
    """
    renderer_classes = [UserRenderer]
    def post(self, request):
        """
        Handles POST request for admin login.

        Args:
        - request: Request object containing admin login data.
        - format: Optional format suffix.

        Returns:
        - Response: Response object with login status and token.
        """
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data.get('email')
        password = serializer.data.get('password')
        user = authenticate(email=email, password=password)
        if user is not None:
            if user.is_admin or user.role == 'superuser':
                token = get_tokens_for_user(user)
                return Response(
                  {'token':token, 'msg':'Login Success'},
                  status=status.HTTP_200_OK)
            return Response(
                {'errors':{'non_field_errors':['Only Admin can Logged In']}},
                status=status.HTTP_400_BAD_REQUEST)
        return Response(
            {'errors':{'non_field_errors':['Email or Password is not Valid']}},
            status=status.HTTP_404_NOT_FOUND)

class UserProfileView(APIView):
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
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserChangePasswordView(APIView):
    """
    API view for changing user password.
    """
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        """
        Handles POST request for changing user password.

        Args:
        - request: Request object containing the new password data.
        - format: Optional format suffix.

        Returns:
        - Response: Response object with password change status.
        """
        serializer = UserChangePasswordSerializer(data=request.data, context={'user':request.user})
        serializer.is_valid(raise_exception=True)
        return Response({'msg':'Password Changed Successfully'}, status=status.HTTP_200_OK)

# class SendPasswordResetEmailView(APIView):
#     """
#     API view for sending password reset email.
#     """
#     renderer_classes = [UserRenderer]
#     def post(self, request):
#         """
#         Handles POST request for sending password reset email.

#         Args:
#         - request: Request object containing the email address for password reset.
#         - format: Optional format suffix.

#         Returns:
#         - Response: Response object with password reset status.
#         """
#         serializer = SendPasswordResetEmailSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         return Response(
#           {'msg':'Password Reset link send. Please check your Email'},
#           status=status.HTTP_200_OK)

# class UserPasswordResetView(APIView):
#     """
#     API view for resetting user password.
#     """
#     renderer_classes = [UserRenderer]
#     def post(self, request, uid, token):
#         """
#         Handles POST request for resetting user password.

#         Args:
#         - request: Request object containing the new password data.
#         - uid: User ID for whom the password is to be reset.
#         - token: Token for password reset verification.
#         - format: Optional format suffix.

#         Returns:
#         - Response: Response object with password reset status.
#         """
#         serializer = UserPasswordResetSerializer(
#           data=request.data,
#           context={'uid':uid, 'token':token}
#           )
#         serializer.is_valid(raise_exception=True)
#         return Response({'msg':'Password Reset Successfully'}, status=status.HTTP_200_OK)
