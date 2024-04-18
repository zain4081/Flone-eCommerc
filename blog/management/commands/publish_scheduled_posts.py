from django.core.management.base import BaseCommand
from blog.models import Post
from django.utils import timezone

class Command(BaseCommand):
    help = 'Publish scheduled posts'

    def handle(self, *args, **kwargs):
        scheduled_posts = Post.objects.filter(scheduled_date__lte=timezone.now())
        for post in scheduled_posts:
            post.publish()
            self.stdout.write(self.style.SUCCESS(f'Published post "{post.title}"'))