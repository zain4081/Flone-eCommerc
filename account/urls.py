"""
URL configuration for the account app.
"""
from django.urls import path
from account.views import UserChangePasswordView, UserLoginView
from account.views import UserProfileView, UserRegistrationView
from account.views import AdminLoginView, UserEmailVerification
urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('verify-email/', UserEmailVerification.as_view(), name='verify-email'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path(
        'changepassword/',
        UserChangePasswordView.as_view(),
        name='changepassword'),
    # path(
    #     'send-reset-password-email/',
    #     SendPasswordResetEmailView.as_view(),
    #     name='send-reset-password-email'),
    # path('reset-password/<uid>/<token>/', UserPasswordResetView.as_view(), name='reset-password'),
    path('admin-login/', AdminLoginView.as_view(), name='login'),
]
