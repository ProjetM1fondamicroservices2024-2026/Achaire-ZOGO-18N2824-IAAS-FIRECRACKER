from rest_framework import routers
from notifications.api_views import *
from django.conf.urls.static import static
from django.urls import path ,include

app_name = "notifications"

router = routers.DefaultRouter()

router.register(r'notifications', NotificationViewSet, basename='notifications')
router.register(r'users', UserViewSet, basename='users')


urlpatterns = router.urls
