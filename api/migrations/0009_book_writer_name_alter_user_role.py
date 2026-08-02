# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_book_physical_price_platformsetting_physical_surcharge'),
    ]

    operations = [
        migrations.AddField(
            model_name='book',
            name='writer_name',
            field=models.CharField(blank=True, default='', max_length=255),
        ),
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.CharField(choices=[('reader', 'Reader'), ('author', 'Author'), ('publisher', 'Publisher'), ('admin', 'Admin')], default='reader', max_length=10),
        ),
    ]
