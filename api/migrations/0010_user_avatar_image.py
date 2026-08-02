# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_book_writer_name_alter_user_role'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='avatar_image',
            field=models.ImageField(blank=True, null=True, upload_to='avatars/'),
        ),
    ]
