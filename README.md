<div align="center">

# 📈 StockVision — AI Predictions Portal
**An Enterprise-Grade, Full-Stack Machine Learning Stock Price Forecasting Platform**

![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite 8](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Django 6](https://img.shields.io/badge/Django-6.0-092E20?style=for-the-badge&logo=django&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.13-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Python 3.12](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)

</div>

---

## 🌟 Overview

**StockVision** is a powerful, dynamic full-stack web application designed to empower investors and traders with high-precision artificial intelligence stock forecasts. Powered by a **Long Short-Term Memory (LSTM)** deep neural network implemented in TensorFlow/Keras and deployed over a high-performance Django REST framework backend, StockVision synthesizes over a decade of historical trading data in seconds to visualize future market trends.

The user interface is built with state-of-the-art **React 19** and **Vite 8**, featuring sleek glassmorphic UI components, dynamic interactive dashboards, JWT-secured authentication, and personal prediction archiving.

---

## ✨ Key Features

- 🧠 **Deep Learning LSTM Forecasting**: Utilizes custom-trained sequence models designed specifically for time-series forecasting, overcoming traditional linear prediction limits.
- 🌍 **Global Exchange Compatibility**: Supports live ticker symbol lookup across major world exchanges including **NYSE**, **NASDAQ**, and **NSE** (e.g., `AAPL`, `TSLA`, `GOOGL`, `INFY.NS`, `RELIANCE.NS`).
- 📊 **Advanced Visual Analytics**: Generates and serves four dedicated technical charts per prediction:
  1. *Complete Historical Close Price Curve* (10-year span)
  2. *100-Day Simple Moving Average (100 DMA)*
  3. *200-Day Simple Moving Average (200 DMA)*
  4. *AI Predicted vs. Original Closing Trendline*
- 🎯 **Rigorous Model Precision Metrics**: Real-time computation and display of scientific model accuracy statistics:
  - **MSE** (*Mean Squared Error*)
  - **RMSE** (*Root Mean Squared Error*)
  - **$R^2$ Score** (*Coefficient of Determination*) with automated quality grading badges.
- 🔐 **Secure JWT User Vault & History**: Personalized workspaces powered by JSON Web Tokens. Retains full prediction logs with timestamps, accuracy scores, and 1-click execution re-run tools.
- 🐳 **Dual-Stage Docker Architecture**: Built-in containerization support for both frictionless production deployments (*Nginx + Gunicorn*) and live developer HMR workflows.

---

## 🛠️ Technology Stack

| Layer | Technologies & Frameworks |
| :--- | :--- |
| **Frontend UI** | React 19, Vite 8, FontAwesome 7, Vanilla CSS 3 (Dark Glassmorphic Design System) |
| **Backend API** | Django 6.0, Django REST Framework 3.14, SimpleJWT Authentication, Gunicorn |
| **AI & ML Engine**| TensorFlow CPU 2.13, Keras, Scikit-Learn (MinMaxScaler), YFinance, NumPy, Pandas |
| **Visualization** | Matplotlib (Agg backend for headless server multi-threading) |
| **DevOps & Infra**| Docker, Docker Compose, Nginx Reverse Proxy (Alpine), SQLite / Postgres |

---

## 📂 Project Structure

```bash
React-Preditions-Portal/
├── backend/                       # Django REST backend & ML pipeline
│   ├── accounts/                  # User management & authentication modules
│   ├── api/                       # ML endpoints, yfinance ingestion, & charting
│   │   ├── models.py              # Prediction history schema
│   │   └── views.py               # Keras inference & statistical evaluations
│   ├── predictions_portal/        # Django project core routing & settings
│   ├── media/                     # Generated Matplotlib stock visualization vault
│   ├── stock_prediction_model.keras # Trained LSTM Neural Network weights
│   ├── Dockerfile                 # Multi-stage Gunicorn build (Python 3.12 Slim)
│   └── requirements.txt           # Backend core dependencies
├── frontend-react/                # React 19 + Vite 8 SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/              # Login & user onboarding interfaces
│   │   │   └── dashboard/         # Real-time analytics charts & history dashboard
│   │   ├── axiosinstance.js       # Interceptor-enabled JWT HTTP client
│   │   └── App.jsx                # Protected application router
│   ├── nginx.conf                 # Production reverse proxy configuration
│   └── Dockerfile                 # Multi-stage Node builder + Nginx hosting
├── docker-compose.yml             # Production multi-container composition
├── docker-compose.dev.yml         # Development hot-reload container composition
└── package.json                   # Root command delegator (dev, build, lint)
```

---

## 🚀 Getting Started

You can deploy and run **StockVision** seamlessly using Docker Compose (Recommended) or set up a native development environment.

### Option A: Docker Compose (Zero Configuration)

#### 1. Production Deployment (Nginx Reverse Proxy + Gunicorn)
Spawns a self-contained production environment on port `80`:
```bash
docker compose up --build -d
```
- Access the web interface at: `http://localhost`
- Backend API proxy at: `http://localhost/api/v1/`

#### 2. Development Mode (Live HMR & Backend Reload)
Spawns live-reloading servers with source volume mounts:
```bash
docker compose -f docker-compose.dev.yml up --build
```
- Access the Vite Dev UI at: `http://localhost:5173`
- Direct Django Dev API at: `http://localhost:8000`

---

### Option B: Manual Native Setup

#### 1. Backend Environment Setup
```bash
# Enter workspace root and activate Python environment
./env/Scripts/activate          # Windows PowerShell
# OR: source env/bin/activate    # Linux / Mac

cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

#### 2. Frontend Environment Setup
Open a terminal in the project root:
```bash
# Install frontend dependencies and start Vite dev server
npm run dev --prefix frontend-react
# Or directly from workspace root using delegator scripts:
npm run dev
```

---

## 🔑 REST API Highlights

All prediction and history endpoints require an authorization header: `Authorization: Bearer <access_token>`.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register/` | Register a new investor user account. |
| `POST` | `/api/v1/auth/login/` | Request JWT access and refresh tokens. |
| `POST` | `/api/v1/predict/` | Ingest ticker symbol, invoke LSTM network, return metrics & chart paths. |
| `GET`  | `/api/v1/history/` | Fetch authenticated user's complete prediction history log. |
| `DELETE`| `/api/v1/history/` | Purge user prediction records. |

### Example Payload (`POST /api/v1/predict/`)
```json
{
  "ticker": "AAPL"
}
```

### Response Snapshot
```json
{
  "status": "success",
  "plot_img": "/media/AAPL_stock_plot.png",
  "plot_img_100dma": "/media/AAPL_100_dma.png",
  "plot_img_200dma": "/media/AAPL_200_dma.png",
  "plot_prediction": "/media/AAPL_final_prediction.png",
  "mse": 0.001423,
  "rmse": 0.037722,
  "r2": 0.9412
}
```

---

## 🧪 Verified Quality Assurance

The codebase is engineered for stability and performance, verified with standard industry tooling:
- **Frontend Code Quality**: Validated via ESLint 9 (`npm run lint`) — zero unused variables or hook regressions.
- **Production Bundling**: Optimized Rollup build via Vite (`npm run build`) with modular gzip chunk separation.
- **Backend Safety**: Django diagnostics verified via `python manage.py check` with automated minimum dataset threshold protections (preventing crashes on thinly-traded stocks).

---

## 📜 License & Usage
This software is provided under standard MIT / Proprietary licensing for analytical, research, and predictive algorithmic demonstrations. Stock price projections generated by neural network models are meant for quantitative insight and do not constitute direct financial or investment advice.
