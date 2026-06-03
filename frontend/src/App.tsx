import { useEffect, useState } from 'react'
import { fetchStocks, fetchMacroIndicators, predictStockPrice } from './api/client'
import StockSelector from './components/StockSelector'
import MacroIndicatorPanel from './components/MacroIndicatorPanel'
import PredictionChart from './components/PredictionChart'

interface Stock {
  symbol: string
  name: string
  country: string
}

interface MacroIndicator {
  id: string
  name: string
  value: number
  unit: string
  historical_value: number
}

interface Prediction {
  predicted_price: number
  confidence: number
  sentiment: 'bullish' | 'neutral' | 'bearish'
  correlation_score: number
}

function App() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [macroIndicators, setMacroIndicators] = useState<MacroIndicator[]>([])
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true)
        const [stocksData, indicatorsData] = await Promise.all([
          fetchStocks(),
          fetchMacroIndicators()
        ])
        setStocks(stocksData)
        
        // Initialize macro indicators with sample data
        const initialized = indicatorsData.map(ind => ({
          ...ind,
          value: ind.value || 100,
          historical_value: ind.historical_value || 100
        }))
        setMacroIndicators(initialized)
        
        if (stocksData.length > 0) {
          setSelectedStock(stocksData[0])
        }
      } catch (err) {
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    initializeApp()
  }, [])

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock)
    setPrediction(null)
  }

  const handleIndicatorChange = async (indicatorId: string, newValue: number) => {
    const updatedIndicators = macroIndicators.map(ind =>
      ind.id === indicatorId ? { ...ind, value: newValue } : ind
    )
    setMacroIndicators(updatedIndicators)

    if (selectedStock) {
      try {
        setLoading(true)
        const pred = await predictStockPrice(
          selectedStock.symbol,
          updatedIndicators.map(ind => ({ id: ind.id, value: ind.value }))
        )
        setPrediction(pred)
      } catch (err) {
        setError('Failed to predict')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-900 border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-white">📈 Macro-Stock Predictor</h1>
          <p className="text-slate-400 mt-2">Predict stock performance based on macroeconomic indicators</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <StockSelector
              stocks={stocks}
              selectedStock={selectedStock}
              onSelect={handleStockSelect}
              loading={loading}
            />
            <MacroIndicatorPanel
              indicators={macroIndicators}
              onChange={handleIndicatorChange}
              loading={loading}
            />
          </div>

          <div className="lg:col-span-3">
            {prediction && selectedStock && (
              <PredictionChart
                prediction={prediction}
                symbol={selectedStock.symbol}
                loading={loading}
              />
            )}
            {!prediction && !loading && selectedStock && (
              <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
                <p className="text-slate-400">Adjust macro indicators to see predictions</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
