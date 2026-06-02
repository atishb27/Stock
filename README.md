# Macro-Stock Predictor

An interactive web application that predicts stock performance based on macroeconomic indicators.

## Features

- Historical stock performance tracking for global companies
- Real-time correlation analysis with macroeconomic indices
- Interactive predictions: adjust macro indicators to see stock price changes
- Support for multiple indicators: CPI, Inflation, Unemployment, Interest Rates
- Machine learning-powered predictions using historical trends
- Responsive UI with interactive charts

## Tech Stack

### Frontend
- React + TypeScript
- Vite
- Recharts
- Tailwind CSS
- Axios

### Backend
- Python FastAPI
- Pandas + NumPy
- Scikit-learn
- PostgreSQL
- Redis

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- Docker & Docker Compose

### Installation

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your API keys
3. Run `docker-compose up`
4. Frontend will be available at `http://localhost:3000`
5. Backend API at `http://localhost:8000`

## API Keys Required

- FRED API: https://fred.stlouisfed.org/
- Alpha Vantage: https://www.alphavantage.co/
- Finnhub: https://finnhub.io/

## License

MIT
