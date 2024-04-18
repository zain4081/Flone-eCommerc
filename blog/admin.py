from django.contrib import admin
from blog.models import *

# Register your models here.
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Category)
admin.site.register(Tag)
admin.site.register(Like)