import os
from django.db import models
from django.contrib.auth import get_user_model
from blog.models import Category, Tag
from django.utils.translation import gettext_lazy as _
# Create your models here.
User = get_user_model()
def upload_to(instance, file):
    """Set image filename and construct upload path."""
    # Example implementation: Assuming 'file' is the actual file object.
    print("file:", file)
    print("instance.name:", instance.name)
    name, extension = os.path.splitext(file)
    print("name:", name)
    print("extension:", extension)
    return f'commerce/{instance.name}{extension}'
class Product(models.Model):
    """
    Modal for Products items
    """
    Category =  models.ManyToManyField(Category)
    discount = models.FloatField()
    description = models.TextField(max_length=500)
    image = models.ImageField(_('Image'), upload_to=upload_to, default='default.jpg')
    name = models.CharField(max_length=100)
    price = models.FloatField()
    salesCount = models.IntegerField()
    short_description = models.TextField(max_length=500)
    tag = models.ManyToManyField(Tag)
    stock = models.IntegerField(default=1)
    price_id = models.CharField(max_length=250, default='')
    price_id_eur = models.CharField(max_length=250, default='')
    price_id_gbp = models.CharField(max_length=250, default='')
    def __str__(self):
        return f"{self.name}"
    class Meta:
        db_table = 'commerce_product'
        