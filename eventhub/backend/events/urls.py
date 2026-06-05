from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('auth/login/', views.LoginView.as_view()),
    path('auth/logout/', views.LogoutView.as_view()),

    # Public
    path('events/', views.PublicEventListView.as_view()),
    path('events/featured/', views.FeaturedEventsView.as_view()),
    path('events/<int:pk>/', views.PublicEventDetailView.as_view()),
    path('categories/', views.PublicCategoryListView.as_view()),

    # Admin
    path('admin/stats/', views.AdminStatsView.as_view()),
    path('admin/events/', views.AdminEventListView.as_view()),
    path('admin/events/<int:pk>/', views.AdminEventDetailView.as_view()),
    path('admin/categories/', views.AdminCategoryListView.as_view()),
    path('admin/categories/<int:pk>/', views.AdminCategoryDetailView.as_view()),
]
