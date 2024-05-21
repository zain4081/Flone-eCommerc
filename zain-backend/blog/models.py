# blog/models.py
"""
Module for defining blog models.
"""
from django.db import models
from django.db.models import Q
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from simple_history.models import HistoricalRecords

from ckeditor.fields import RichTextField
User = get_user_model()
def upload_to(filename, file): # pylint: disable=unused-argument
    """set image filename"""
    return f'blog/{filename}'
class Tag(models.Model):
    """Model for representing tags."""
    name = models.CharField(max_length=50)
    def __str__(self):
        return f"{self.name}"
class Category(models.Model):
    """Model for representing Categories."""
    name = models.CharField(max_length=100)
    def __str__(self):
        return f"{self.name}"
class PostQuerySet(models.QuerySet):
    def available(self):
        now = timezone.now()
        return self.filter(Q(scheduled_date__lte=now) | Q(scheduled_date__isnull=True))
class PostManager(models.Manager):
    def get_queryset(self):
        return PostQuerySet(self.model, using=self._db).available()
class Post(models.Model):
    """Model for representing Posts."""
    title = models.CharField(max_length=100)
    content = RichTextField(config_name='default')
    image = models.ImageField(_('Image'), upload_to=upload_to, default='blog/default.jpg')
    date = models.DateTimeField(auto_now_add=True)
    scheduled_date = models.DateTimeField(null=True, blank=True)
    tag = models.ManyToManyField(Tag, blank=True)
    featured = models.BooleanField(default=False)
    top = models.BooleanField(default=False)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    history = HistoricalRecords()
    objects = PostManager()
    def __str__(self):
        return f"{self.title}"
class Comment(models.Model):
    """Model for representing Comments."""
    date = models.DateField(auto_now_add=True)
    content = models.TextField(max_length=700)
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name='comments'
        )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    parent_comment = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name='replies'
        )
class Like(models.Model):
    """Model for representing Likes."""
    LIKE_STATUS_CHOICES = [
        ('not_hit', 'not_hit'),
        ('like', 'like'),
        ('dislike', 'dislike'),
    ]
    status = models.CharField(max_length=20, choices=LIKE_STATUS_CHOICES, default='not_hit')
    post = models.ForeignKey('Post',
                             on_delete=models.SET_NULL,
                             blank=True, null=True,
                             related_name='post_likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.ForeignKey('Comment',
                                on_delete=models.SET_NULL,
                                blank=True, null=True,
                                related_name='comment_likes')
    class Meta:
        """Make user with post and user with comment Unique 
        to get only one like from one user for one post/comment."""
        constraints = [
            models.UniqueConstraint(fields=['user', 'comment'], name='unique_user_comment'),
            models.UniqueConstraint(fields=['user', 'post'], name='unique_user_post')
        ]
