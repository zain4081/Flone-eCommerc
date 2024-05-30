"""
Utility class for sending emails using Django's EmailMessage.
"""
import os
from django.core.mail import EmailMessage
from twilio.rest import Client

class Util:
    """
    Utility class for sending emails and Sending Otp.
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
        print(data['to_email'])
        try:
            for recipient in data['to_email']:
                email = EmailMessage(
                    subject=data['subject'],
                    body=data['body'],
                    from_email=os.environ.get('EMAIL_FROM'),
                    to=[recipient]
                )
                email.content_subtype = "html"
                email.send()
                print('Email sent successfully to', recipient)
        except Exception as e:
            print('Failed to send email:', str(e))
    
    @staticmethod
    def send_otp(data):
        """
            Sends an OTP message using Twilio.
        """
        print(data)
        otp = data["OTP"]
        client = Client(os.environ['ACCOUNT_SID'], os.environ['AUTH_TOKEN'])
        message = client.messages \
                .create(
                     body=f"Here is Your OTP for Flone Website.  {otp}",
                     from_=os.environ['PHONE_NUMBER'],
                     to=data['PHONE_NUMBER']
                 )
        print(message.sid)