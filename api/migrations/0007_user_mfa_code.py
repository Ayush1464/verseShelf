# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_order_is_physical_order_shipping_address'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='mfa_code',
            field=models.CharField(blank=True, default='', max_length=6),
        ),
    ]
