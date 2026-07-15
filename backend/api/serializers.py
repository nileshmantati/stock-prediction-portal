from rest_framework import serializers
from .models import PredictionHistory


class StockPredictionSerializer(serializers.Serializer):
    ticker = serializers.CharField(max_length=20)


class PredictionHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PredictionHistory
        fields = ['id', 'ticker', 'created_at', 'mse', 'rmse', 'r2']