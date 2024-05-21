"""
Module for registering blog models with the Django admin site.
"""
from django.contrib import admin
from blog.models import Post, Comment, Category, Tag, Like
from simple_history.admin import SimpleHistoryAdmin

# Register your models here.

# class PostHistoryAdmin(SimpleHistoryAdmin):
#     list_display = ["title", "content"]
#     history_list_display = ["status"]

admin.site.register(Post, SimpleHistoryAdmin)
admin.site.register(Comment)
admin.site.register(Category)
admin.site.register(Tag)
admin.site.register(Like)
