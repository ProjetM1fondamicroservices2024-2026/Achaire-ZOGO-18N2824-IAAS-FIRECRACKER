from django.contrib import admin
from .models import *
# Register your models here.


class NotificationAdmin(admin.ModelAdmin):
    model = Notification


admin.site.register(Notification, NotificationAdmin)