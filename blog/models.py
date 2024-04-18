
from django.db import models
from ckeditor.fields import RichTextField
from django.contrib.auth import get_user_model
from django.utils import timezone
User = get_user_model()


# Create your models here.  
class Tag(models.Model):
    name = models.TextField(max_length=50)
    
    def __str__(self):
        return self.name
    
class Category(models.Model):
    name = models.CharField(max_length=100)
    
    
    def __str__(self):
        return self.name
    
class Post(models.Model):
    title = models.CharField(max_length=100)
    content = RichTextField(config_name='default')
    date = models.DateTimeField(auto_now_add=True)
    scheduled_date = models.DateTimeField(null=True, blank=True)
    tag = models.ManyToManyField(Tag, blank=True)
    featured = models.BooleanField(default=False)
    top = models.BooleanField(default=False)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['id'], name='unique_id')
        ]
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if self.scheduled_date is not None and self.scheduled_date > timezone.now():
            # Post is scheduled for the future, do not update the date field
            super().save(*args, **kwargs)
        else:
            # Post is not scheduled or scheduled for the past, update the date field
            self.date = timezone.now()
            super().save(*args, **kwargs)
    
class Comment(models.Model):
    username = models.CharField(max_length=50, null=True)
    useremail = models.EmailField(null=True, blank=True)
    date = models.DateField(auto_now_add=True)
    content = models.TextField(max_length=700)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=True, blank=True,  related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    def __str__(self):
        return self.content
    


    
class Like(models.Model):
    LIKE_STATUS_CHOICES = [
        ('not_hit', 'not_hit'),
        ('like', 'like'),
        ('dislike', 'dislike'),
    ]
    status = models.CharField(max_length=20, choices=LIKE_STATUS_CHOICES, default='not_hit')
    post = models.ForeignKey('Post', on_delete=models.SET_NULL, blank=True, null=True, related_name='post_likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.ForeignKey('Comment', on_delete=models.SET_NULL, blank=True, null=True, related_name='comment_likes')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'comment'], name='unique_user_comment'),
            models.UniqueConstraint(fields=['user', 'post'], name='unique_user_post')
        ]

    def __str__(self):
        return f"{self.status} by {self.user.username}"