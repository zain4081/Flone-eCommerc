# notifications/urls.py
from django.urls import path
from .views import UserNotifications, AddNotification, EditNotificationReadStatus

urlpatterns = [
    path('list/', UserNotifications.as_view(), name='notification-list'),
    path('add/', AddNotification.as_view(), name='add-notification'),
    # path('mark-as-read/<int:pk>', EditNotificationReadStatus.as_view(), name='mark-as-read'),
    path('mark-as-read/', EditNotificationReadStatus.as_view(), name='mark-as-read'),
]
