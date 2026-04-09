from django.urls import path
from accounts.views import RegisterView
from accounts import views as UserViews
from .views import StockPredictionAPIView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

urlpatterns = [
    path('register/',UserViews.RegisterView.as_view(), name='register'),
    
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected_view/',UserViews.ProtectedView.as_view(), name='protected_view'),
    
    # Prediction API endpoint
    path('predict/',StockPredictionAPIView.as_view(), name='stock_prediction'),
]