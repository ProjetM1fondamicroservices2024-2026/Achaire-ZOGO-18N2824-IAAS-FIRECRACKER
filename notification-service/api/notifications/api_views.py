import os
from rest_framework import viewsets
from rest_framework.decorators import action
from notifications.models import *
from django.template.loader import TemplateDoesNotExist, render_to_string
from django.utils.html import strip_tags
from django.core.mail import EmailMultiAlternatives
from notifications.serializers import *
from rest_framework import filters
from email.mime.image import MIMEImage
from threading import Thread
from django.conf import settings




class TemplateEmail(Thread):
    
    def __init__(
        self,
        to,
        subject,
        template,
        context={},
        from_email=None,
        reply_to=None,
        app_name='notifications',
        *args,
        **email_kwargs,
    ):
        super().__init__(*args,**email_kwargs)
        
        self.to = to
        self.subject = subject
        self.template = template
        self.context = context
        self.from_email = from_email
        self.reply_to = reply_to
        self.app_name = app_name

        self.context["template"] = template

        self.html_content, self.plain_content = self.render_content()

        self.to = self.to if not isinstance(self.to, str) else [self.to]

        if self.reply_to:
            self.reply_to = (
                self.reply_to if not isinstance(self.reply_to, str) else [self.reply_to]
            )

        self.django_email = EmailMultiAlternatives(
            subject=self.subject,
            body=self.plain_content,
            from_email=self.from_email,
            to=self.to,
            reply_to=self.reply_to,
            **email_kwargs,
        )
        self.django_email.attach_alternative(self.html_content, "text/html")
        self.django_email.mixed_subtype = "related"

    def render_content(self):
        html_content = self.render_html()

        try:
            plain_content = self.render_plain()
        except TemplateDoesNotExist:
            plain_content = strip_tags(html_content)

        return html_content, plain_content

    def render_plain(self):
        return render_to_string(self.get_plain_template_name(), self.context)

    def render_html(self):
        template_name = self.get_html_template_name()
        logger.info(f"Rendering template: {template_name}")
        return render_to_string(self.get_html_template_name(), self.context)

    def get_plain_template_name(self):
        return f"{self.app_name}/email/{self.template}.txt"

    def get_html_template_name(self):
        return f"{self.app_name}/email/{self.template}.html"
    
    
    def send(self, **send_kwargs):
        return self.django_email.send(**send_kwargs)
    
    
    def run(self, **run_kwargs):
        
        image_path = os.path.join(settings.BASE_DIR, 'images/logo.png') #finders.find('images/logo.png')
        with open(image_path, 'rb') as img:
            logo = MIMEImage(img.read())
            logo.add_header('Content-ID', '<logo>')
            self.django_email.attach(logo)
            
        self.send(**run_kwargs)



class NotificationViewSet(viewsets.ModelViewSet):
    model = Notification
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = []
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "user",
        "message_type"
       
    ]
    ordering_fields = [
        "user",
        "message_type"
       
    ]



 

class UserViewSet(viewsets.ModelViewSet):
    model = User
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = []
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "name",
        "email",
        "user_id"

       
    ]
    ordering_fields = [
        "name",
        "email",
        "user_id"
    ]



 

