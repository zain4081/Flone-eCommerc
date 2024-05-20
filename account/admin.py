"""
Django admin configuration for the 'account' app.
"""
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from django.contrib import admin
from account.models import User


class UserModelAdmin(BaseUserAdmin):
    """
    Custom User model admin configuration.

    This class extends the base UserAdmin class to customize the admin interface
    for the User model.

    Attributes:
    - list_display (tuple): Fields to display in the list view.
    - list_filter (tuple): Fields to use for filtering.
    - fieldsets (tuple): Field sets to group related fields.
    - add_fieldsets (tuple): Field sets for adding a new user.
    - search_fields (tuple): Fields to use for searching.
    - ordering (tuple): Ordering of users in the list view.
    - filter_horizontal (tuple): Fields to display with a horizontal filter interface.
    """
    list_display = ('id', 'email', 'name', 'tc', 'is_admin')
    list_filter = ('is_admin',)
    fieldsets = (
        ('User Credentials', {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('name', 'tc')}),
        ('Permissions', {'fields': ('is_admin',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2'),
        }),
    )
    search_fields = ('email',)
    ordering = ('email', 'id')
    filter_horizontal = ()


# Register the User model with the custom UserModelAdmin...
admin.site.register(User, UserModelAdmin)
