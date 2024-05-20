"""
Utility class for sending emails using Django's EmailMessage.
"""
import os
from django.core.mail import EmailMessage

class Util:
    """
    Utility class for sending emails.
    """

    @staticmethod
    def send_email(data):
        """
        Sends an email using Django's EmailMessage.

        Args:
        - data (dict): A dictionary containing email data including subject, body, and recipient.

        Example data:
        {
            'subject': 'Email subject',
            'body': 'Email body',
            'to_email': 'recipient@example.com'
        }
        """
        email = EmailMessage(
            subject=data['subject'],
            body=data['body'],
            from_email=os.environ.get('EMAIL_FROM'),
            to=[data['to_email']]
        )
        email.send()
