from urllib import request
from notifications.models import *
from rest_framework import serializers
from django.contrib.auth import authenticate
import logging


# Get a logger for books
logger = logging.getLogger('notifications')


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id","user","message","message_type"]

class UserSerializer(serializers.ModelSerializer):
   
    class Meta:

        model = User
        fields = ["id","user_id","name","email","role"
                  ]
        
       
