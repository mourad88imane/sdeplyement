from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        # This migration is for when the table already exists but needs additional fields
        # It's essentially a no-op since the table is managed by Django
        migrations.AlterModelTable(
            name='user',
            table='auth_user',
        ),
    ]