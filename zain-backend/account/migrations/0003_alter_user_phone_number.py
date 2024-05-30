# Generated by Django 5.0.4 on 2024-05-27 09:54

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0002_rename_is_verified_user_is_phone_verified_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='phone_number',
            field=models.CharField(default='00000000000', max_length=11, validators=[django.core.validators.RegexValidator(message='Phone number must be 11 digits only', regex='^\\d{11}')]),
        ),
    ]