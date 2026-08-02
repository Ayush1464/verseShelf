# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_user_mfa_code'),
    ]

    operations = [
        migrations.AddField(
            model_name='book',
            name='physical_price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=8, null=True),
        ),
        migrations.AddField(
            model_name='platformsetting',
            name='physical_surcharge',
            field=models.DecimalField(decimal_places=2, default=150.00, max_digits=8),
        ),
    ]
