from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('color', models.CharField(default='#6366f1', max_length=7)),
            ],
            options={
                'verbose_name_plural': 'categories',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('date', models.DateTimeField()),
                ('location', models.CharField(max_length=255)),
                ('organizer', models.CharField(max_length=255)),
                ('banner', models.ImageField(blank=True, null=True, upload_to='banners/')),
                ('status', models.CharField(
                    choices=[('upcoming', 'Upcoming'), ('ongoing', 'Ongoing'), ('done', 'Done')],
                    default='upcoming',
                    max_length=10,
                )),
                ('is_featured', models.BooleanField(default=False)),
                ('max_participants', models.IntegerField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('category', models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='events',
                    to='events.category',
                )),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
