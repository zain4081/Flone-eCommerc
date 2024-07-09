"""
URL configuration for the account app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from account.views import (
    UserChangePasswordView,
    UserLoginView,
    AdminLoginView,
    UserEmailVerification,
    UserProfileView,
    UserRegistrationView,
    UserOtpVerify,
    google_login,
    facebook_login,
    )

router = DefaultRouter()
router.register('otp', UserOtpVerify, basename='phone-otp')
urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('verify-email/', UserEmailVerification.as_view(), name='verify-email'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path(
        'changepassword/',
        UserChangePasswordView.as_view(),
        name='changepassword'),
    path('admin-login/', AdminLoginView.as_view(), name='login'),
    path('google-login/', google_login, name='google-login'),
    path('facebook-login/', facebook_login, name='facebook-login'),
]
