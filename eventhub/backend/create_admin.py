import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eventhub.settings')
django.setup()

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from events.models import Category

EMAIL = 'admin@eventhub.com'
USERNAME = 'admin'
PASSWORD = 'admin123'

if User.objects.filter(email=EMAIL).exists():
    print(f'Admin sudah ada: {EMAIL}')
else:
    user = User.objects.create_superuser(username=USERNAME, email=EMAIL, password=PASSWORD)
    Token.objects.get_or_create(user=user)
    print(f'Admin berhasil dibuat:')
    print(f'  Email    : {EMAIL}')
    print(f'  Password : {PASSWORD}')

# Buat sample categories jika belum ada
sample_categories = [
    {'name': 'Seminar', 'color': '#6366f1'},
    {'name': 'Workshop', 'color': '#10b981'},
    {'name': 'Lomba', 'color': '#f59e0b'},
    {'name': 'Sosial', 'color': '#ec4899'},
    {'name': 'Olahraga', 'color': '#3b82f6'},
]

for cat in sample_categories:
    obj, created = Category.objects.get_or_create(name=cat['name'], defaults={'color': cat['color']})
    if created:
        print(f'Kategori dibuat: {cat["name"]}')
