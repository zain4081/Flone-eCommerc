"""
App configuration for the 'account' app.

This file defines the configuration for the 'account' app, including the default
auto field for models and the name of the app.
"""

from django.apps import AppConfig

class AccountConfig(AppConfig):
    """
    Configuration class for the 'account' app.

    Attributes:
    - default_auto_field (str): The default primary key field type for models in the app.
    - name (str): The name of the app.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'account'
