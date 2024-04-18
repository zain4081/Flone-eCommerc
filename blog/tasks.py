# tasks.py

from t2.celery_setup import shared_task
from django.core.management import call_command

@shared_task
def publish_scheduled_posts():
    call_command('publish_scheduled_posts')
