from django.core.management.base import BaseCommand
from notifications.rabbitmq_consumer import main
import asyncio

class Command(BaseCommand):
    help = 'Rabbitmq consumer'
 
    def handle(self, *args, **options):
        asyncio.run(main())