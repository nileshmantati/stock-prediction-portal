from django.db import models
from django.contrib.auth.models import User


class PredictionHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prediction_history')
    ticker = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    mse = models.FloatField()
    rmse = models.FloatField()
    r2 = models.FloatField()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} — {self.ticker} @ {self.created_at:%Y-%m-%d %H:%M}"
