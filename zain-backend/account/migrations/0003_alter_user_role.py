# Generated by Django 5.0.4 on 2024-07-09 10:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0002_user_is_peremium'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.CharField(choices=[('superadmin', 'superadmin'), ('creator', 'creator'), ('editor', 'editor'), ('client', 'client')], default='editor', max_length=50),
        ),
    ]
