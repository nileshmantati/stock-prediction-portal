from django.urls import path
from accounts import views as UserViews
from .views import StockPredictionAPIView, PredictionHistoryView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

urlpatterns = [
    path('register/', UserViews.RegisterView.as_view(), name='register'),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('protected_view/', UserViews.ProtectedView.as_view(), name='protected_view'),

    # Prediction
    path('predict/', StockPredictionAPIView.as_view(), name='stock_prediction'),

    # History
    path('history/', PredictionHistoryView.as_view(), name='prediction_history'),
]