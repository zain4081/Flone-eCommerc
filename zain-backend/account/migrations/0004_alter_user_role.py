# Generated by Django 5.0.4 on 2024-07-09 10:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0003_alter_user_role'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.CharField(choices=[('superadmin', 'superadmin'), ('creator', 'creator'), ('editor', 'editor'), ('client', 'client')], default='client', max_length=50),
        ),
    ]