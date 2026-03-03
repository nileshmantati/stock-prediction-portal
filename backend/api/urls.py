from django.urls import path
from accounts.views import RegisterView
from accounts import views as UserViews

urlpatterns = [
    path('register/',UserViews.RegisterView.as_view(), name='register'),
]