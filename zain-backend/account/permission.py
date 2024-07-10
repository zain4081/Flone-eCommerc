from rest_framework import permissions

class PremiumUserPermission(permissions.BasePermission):
    """
    Custom permission to only allow premium users.
    """

    def has_permission(self, request, view):
        # Check if the user is authenticated and is a premium user
        return request.user.is_authenticated and request.user.is_peremium