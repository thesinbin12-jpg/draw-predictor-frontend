import { useState, useEffect } from 'react'

function App() {
  const [daily, setDaily] = useState([])
  const [weekly, setWeekly] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://you-dont-know.onrender.com/predictions')
      .then(res => res.json())
      .then(data => {
        setDaily(data.daily || [])
        setWeekly(data.weekly || [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="p-8 text-center">Loading predictions...</div>

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold text-center mb-8">🎯 Draw Predictor Pro</h1>

      {/* Daily Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-green-400">📅 Today's Top 5 Draws</h2>
        <div className="grid gap-4">
          {daily.length > 0 ? daily.map((pred, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded-lg border border-green-500">
              <div className="flex justify-between items-center">
                <span className="font-bold">{pred.home_team} vs {pred.away_team}</span>
                <span className="bg-green-600 px-3 py-1 rounded">{pred.confidence}% Confidence</span>
              </div>
              <div className="text-sm text-gray-400 mt-2">
                {new Date(pred.match_date).toLocaleDateString()}
              </div>
            </div>
          )) : <p>No predictions today yet.</p>}
        </div>
      </div>

      {/* Weekly Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-blue-400">📊 7-Day Outlook (35 Picks)</h2>
        <div className="grid gap-4">
          {weekly.length > 0 ? weekly.map((pred, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded-lg border border-blue-500">
              <div className="flex justify-between items-center">
                <span className="font-bold">{pred.home_team} vs {pred.away_team}</span>
                <span className="bg-blue-600 px-3 py-1 rounded">{pred.confidence}% Confidence</span>
              </div>
              <div className="text-sm text-gray-400 mt-2">
                {new Date(pred.match_date).toLocaleDateString()}
              </div>
            </div>
          )) : <p>No weekly predictions yet.</p>}
        </div>
      </div>
    </div>
  )
}

export default App
