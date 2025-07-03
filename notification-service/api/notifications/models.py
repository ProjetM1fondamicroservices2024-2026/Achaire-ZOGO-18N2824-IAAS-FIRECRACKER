from django.db import models

# Create your models here.

MESSAGE_TYPE = (
    ("SIGNUP","SIGNUP"),
    ("VM_CREATION","VM CREATION"),
    ("OFFER_SUBCRIPTION","OFFER SUBSCRIPTION"),
)

ROLE = (
    ("USER","user"),
    ("ADMIN", "admin"),
)

class User(models.Model):
    user_id = models.IntegerField()
    name = models.CharField(max_length=128)
    email = models.EmailField(max_length=255)
    role = models.CharField(max_length=32, choices=ROLE,default="user")
    token = models.CharField(max_length=255, null=True, blank=True)

class Notification(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    message_type = models.CharField(max_length=255, choices=MESSAGE_TYPE)