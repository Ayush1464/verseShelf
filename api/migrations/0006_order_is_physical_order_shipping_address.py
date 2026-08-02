# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_user_whatsapp_number'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='is_physical',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='order',
            name='shipping_address',
            field=models.TextField(blank=True, default=''),
        ),
    ]
