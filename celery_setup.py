# celery_setup.py

from celery import Celery
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'your_project_name.settings')

app = Celery('your_project_name')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()



# celery.py

from celery.schedules import crontab

app.conf.beat_schedule = {
    'publish-scheduled-posts': {
        'task': 'your_app_name.tasks.publish_scheduled_posts',
        'schedule': crontab(minute='*/1'),  # Run every minute, adjust as needed
    },
}
