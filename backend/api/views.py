import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

from rest_framework.views import APIView
from .serializers import StockPredictionSerializer, PredictionHistorySerializer
from .models import PredictionHistory
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import yfinance as yf
from datetime import datetime, timedelta
import threading
import pandas as pd
import numpy as np
import os
import re
from django.conf import settings
from .utils import save_plot
from sklearn.preprocessing import MinMaxScaler
from keras.models import load_model
from sklearn.metrics import mean_squared_error, r2_score

# Load model once at startup using absolute path
_MODEL_PATH = os.path.join(settings.BASE_DIR, 'stock_prediction_model.keras')
_model = None
_model_lock = threading.Lock()

def get_model():
    global _model
    if _model is None:
        with _model_lock:
            if _model is None:
                _model = load_model(_MODEL_PATH)
    return _model


class StockPredictionAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = StockPredictionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        ticker = serializer.validated_data['ticker'].upper().strip()
        if not re.match(r'^[A-Z0-9.\-^]{1,20}$', ticker):
            return Response({"error": "Invalid ticker symbol."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch stock data
        now = datetime.now()
        # Fix #4: Use timedelta to avoid leap year crash (Feb 29 → non-leap year)
        start = now - timedelta(days=365 * 10)
        end = now
        df = yf.download(ticker, start=start, end=end)
        # Fix #6: Flatten MultiIndex columns from newer yfinance versions
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)
        if df.empty:
            return Response({"error": "No data found for the given ticker."}, status=status.HTTP_404_NOT_FOUND)
        df.dropna(inplace=True)
        if len(df) < 250:
            return Response(
                {"error": f"Not enough historical trading days ({len(df)}) for ticker {ticker}. At least 250 trading days are required for accurate LSTM prediction and Moving Averages."},
                status=status.HTTP_400_BAD_REQUEST
            )
        df = df.reset_index()

        # Fix #17: Wrap all matplotlib operations in try/finally to prevent figure leaks
        try:
            # Basic Close Price plot
            plt.figure(figsize=(12, 5))
            plt.plot(df.Close, label='Close Price')
            plt.title(f'Closing price of {ticker}')
            plt.xlabel('Days')
            plt.ylabel('Price')
            plt.legend()
            plot_img = save_plot(f'{ticker}_stock_plot.png')

            # 100-Day Moving Average plot
            ma100 = df.Close.rolling(100).mean()
            plt.figure(figsize=(12, 5))
            plt.plot(df.Close, label='Close Price')
            plt.plot(ma100, 'r', label='100-Day Moving Average')
            plt.title(f'100-Day Moving Average of {ticker}')
            plt.xlabel('Days')
            plt.ylabel('Price')
            plt.legend()
            plot_100_dma = save_plot(f'{ticker}_100_dma.png')

            # 200-Day Moving Average plot
            ma200 = df.Close.rolling(200).mean()
            plt.figure(figsize=(12, 5))
            plt.plot(df.Close, label='Close Price')
            plt.plot(ma100, 'r', label='100-Day Moving Average')
            plt.plot(ma200, 'g', label='200-Day Moving Average')
            plt.title(f'200-Day Moving Average of {ticker}')
            plt.xlabel('Days')
            plt.ylabel('Price')
            plt.legend()
            plot_200_dma = save_plot(f'{ticker}_200_dma.png')

            # Split into training & testing
            data_training = pd.DataFrame(df.Close[0:int(len(df) * 0.7)])
            data_testing = pd.DataFrame(df.Close[int(len(df) * 0.7):int(len(df))])

            # Scale and prepare test data
            scaler = MinMaxScaler(feature_range=(0, 1))
            model = get_model()

            # Fix #3: Fit scaler ONLY on training data to prevent data leakage
            scaler.fit(data_training)
            past_100_days = data_training.tail(100)
            final_df = pd.concat([past_100_days, data_testing], ignore_index=True)
            input_data = scaler.transform(final_df)
            x_test = []
            y_test = []

            for i in range(100, input_data.shape[0]):
                x_test.append(input_data[i - 100:i])
                y_test.append(input_data[i, 0])
            x_test, y_test = np.array(x_test), np.array(y_test)

            # Predict and inverse transform
            y_predicted = model.predict(x_test)
            y_predicted = scaler.inverse_transform(y_predicted.reshape(-1, 1)).flatten()
            y_test = scaler.inverse_transform(y_test.reshape(-1, 1)).flatten()

            # Final prediction plot
            plt.figure(figsize=(12, 5))
            plt.plot(y_test, 'b', label='Original Price')
            plt.plot(y_predicted, 'r', label='Predicted Price')
            plt.title(f'Final Prediction for {ticker}')
            plt.xlabel('Days')
            plt.ylabel('Price')
            plt.legend()
            plot_prediction = save_plot(f'{ticker}_final_prediction.png')
        finally:
            plt.close('all')

        # Evaluation metrics
        mse = float(mean_squared_error(y_test, y_predicted))
        rmse = float(np.sqrt(mse))
        r2 = float(r2_score(y_test, y_predicted))

        # Save prediction to user history
        PredictionHistory.objects.create(
            user=request.user,
            ticker=ticker,
            mse=mse,
            rmse=rmse,
            r2=r2,
        )

        return Response({
            'status': 'success',
            'plot_img': plot_img,
            'plot_img_100dma': plot_100_dma,
            'plot_img_200dma': plot_200_dma,
            'plot_prediction': plot_prediction,
            'mse': mse,
            'rmse': rmse,
            'r2': r2,
        })


class PredictionHistoryView(APIView):
    """Returns the authenticated user's full prediction history, newest first."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        history = PredictionHistory.objects.filter(user=request.user)
        serializer = PredictionHistorySerializer(history, many=True)
        return Response(serializer.data)

    def delete(self, request):
        """Clear the entire history for the authenticated user."""
        deleted_count, _ = PredictionHistory.objects.filter(user=request.user).delete()
        return Response({'deleted': deleted_count}, status=status.HTTP_200_OK)