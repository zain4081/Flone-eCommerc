"""
permissions.py

This module defines custom permissions for managing posts in a Django REST Framework application.
These permissions restrict access to certain actions based on the user's role.
"""

from rest_framework import permissions

class CustomPostPermissions(permissions.BasePermission):
    """
    Custom permission to allow different roles to perform specific actions on a post.
    
    - Creators and superadmins can create posts.
    - Editors and superadmins can update posts.
    - Only superadmins can delete posts.
    - Any user can list or retrieve posts.
    """
    
    def has_permission(self, request, view):
        # Allow any user to list or retrieve posts
        if view.action in ['list', 'retrieve']:
            return True

        # Check permissions for other actions
        if view.action in ['create']:
            return request.user.role in ['creator', 'superadmin']
        if view.action in ['update', 'partial_update']:
            return request.user.role in ['editor', 'superadmin']
        if view.action in ['destroy']:
            return request.user.role == 'superadmin'

        return False
