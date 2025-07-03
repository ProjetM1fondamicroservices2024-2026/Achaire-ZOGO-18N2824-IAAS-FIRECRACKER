import asyncio
import json
from notifications.models import *
from notifications.api_views import *
from django.conf import settings
from django.db import IntegrityError
from channels.db import database_sync_to_async
from aio_pika import ExchangeType, connect_robust #ignore
from aio_pika.abc import AbstractIncomingMessage


import logging

logger = logging.getLogger('notifications')


# Use database_sync_to_async for ORM calls to avoid blocking the event loop
@database_sync_to_async
def create_user(account_data, user_id):
    return User.objects.create(user_id=int(user_id),**account_data)

@database_sync_to_async
def update_or_create_user(account_data, user_id):
    return User.objects.update_or_create(user_id=user_id, defaults={**account_data})

@database_sync_to_async
def delete_user(user_id):
    try:
        user = User.objects.get(user_id=user_id)
        user.delete()
    except User.DoesNotExist:
        logger.error(f'Unable to delete user {user_id}, user does not exist !!!')

# The async function that processes the message
async def on_account_message(message: AbstractIncomingMessage) -> None:
    async with message.process():  # Process the message asynchronously
        logger.info("User message")
        data = json.loads(message.body)  # Parse the message body
        logger.info(msg=message.body)
        
        message_type = data['type']
        
        if message_type == 'CREATE':
            account_data = data['user']
            user_id = account_data.pop('id')
            template = TemplateEmail(
               to= account_data.get("email"),
               template="signup",
               subject="Welcome to IAAS-Firecracker",
               context={"user": account_data.get("name"), "email": settings.EMAIL_HOST_USER 
                        },
               from_email=settings.EMAIL_HOST_USER,
               app_name="notifications",
            )
            
            
            template.start()
            template.join() 
            await create_user(account_data, user_id)  # Call the async wrapper for create

        elif message_type == 'UPDATE':
            account_data = data['user']
            user_id = account_data.pop('id')
            await update_or_create_user(account_data, user_id)  # Call the async wrapper for update_or_create
            
        elif message_type == 'DELETE':
            user_id = int(data['user'])
            await delete_user(user_id)  # Call the async wrapper for delete

# The async function that processes the message
async def on_subscription_message(message: AbstractIncomingMessage) -> None:
    async with message.process():  # Process the message asynchronously
        logger.info("Subscription message")
        data = json.loads(message.body)  # Parse the message body
        logger.info(msg=message.body)
        
        message_type = data['type']
        
        if message_type == 'CREATE':
            subscription_data = data['subscription']
            subscription_id = subscription_data.pop('id')
            template = TemplateEmail(
               to= subscription_data.get("email"),
               template="subscription",
               subject="Subscription Created Successfully",
               context={"subscription_type": subscription_data["subscription_type"] ,
                  "start_date": subscription_data["start_date"],
                  "end_date":subscription_data["end_date"]
                  ,"status": subscription_data["status"],
                "type": "Created",
                "message": "Subscription Created Successfully"
},
               from_email=settings.EMAIL_HOST_USER,
               app_name="notifications",
            )
            
            
            template.start()
            template.join() 

        elif message_type == 'UPDATE':
            subscription_data = data['subscription']
            subscription_id = subscription_data.pop('id')
            template = TemplateEmail(
               to= subscription_data.get("email"),
               template="subscription",
               subject="Subscription Renewed Successfully",
               context={"subscription_type": subscription_data["subscription_type"] ,
                  "start_date": subscription_data["start_date"],
                  "end_date":subscription_data["end_date"]
                  ,"status": subscription_data["status"],
                  "type": "Renewed",
                 "message": "Subscription Renewed Successfully"

                  },

               from_email=settings.EMAIL_HOST_USER,
               app_name="notifications",
            )
            template.start()
            template.join() 
        
async def main() -> None:
    # Perform connection
    username = settings.RABBITMQ.get("username")
    password = settings.RABBITMQ.get("password")
    host = settings.RABBITMQ.get("host")

    connection = await connect_robust(f"amqp://{username}:{password}@{host}/")

    async with connection:
        channel = await connection.channel()
        await channel.set_qos(prefetch_count=1)

        account_exchange = await channel.declare_exchange(
            "UserNotificationExchange", ExchangeType.FANOUT,durable=True
        )

        # subscription_exchange = await channel.declare_exchange(
        #     "subscriptionExchange", ExchangeType.FANOUT,durable=True
        # )
        
        account_notification_queue = await channel.declare_queue(name="notificationQueue",durable=True)
        #subscription_notification_queue = await channel.declare_queue(name="subscriptionNotificationQueue",durable=True)

        await account_notification_queue.bind(account_exchange)
       # await subscription_notification_queue.bind(subscription_exchange)

        await account_notification_queue.consume(on_account_message)
        #logger.info("[*] Waiting for subscription events. To exit press CTRL+C")

        #await subscription_notification_queue.consume(on_subscription_message)

        #await notifications_account_queue.consume(on_account_message)

        logger.info("[*] Waiting for user events. To exit press CTRL+C")
        await asyncio.Future()



