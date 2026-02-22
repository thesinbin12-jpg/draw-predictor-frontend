import { useState, useEffect } from 'react'

function App() {
  const [daily, setDaily] = useState([])
  const [weekly, setWeekly] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('daily')

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      </div>
    )
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'bg-green-500'
    if (confidence >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const MatchCard = ({ match, index }) => (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-green-500 transition-all duration-300 shadow-lg">
      <div className="flex justify-between items-start mb-3">
        <span className="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-full uppercase tracking-wider">
          {match.league_id || 'League'}
        </span>
        <span className={`text-white font-bold px-3 py-1 rounded-full text-sm ${getConfidenceColor(match.confidence)}`}>
          {match.confidence}%
        </span>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="text-left">
          <h3 className="text-white font-bold text-lg">{match.home_team}</h3>
          <p className="text-gray-500 text-sm">Home</p>
        </div>
        <div className="text-gray-600 font-bold text-xl">VS</div>
        <div className="text-right">
          <h3 className="text-white font-bold text-lg">{match.away_team}</h3>
          <p className="text-gray-500 text-sm">Away</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Confidence</span>
          <span>{match.confidence}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${getConfidenceColor(match.confidence)}`} 
            style={{ width: `${match.confidence}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800 text-center">
        <p className="text-gray-500 text-xs">
          {new Date(match.match_date).toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Draw Predictor Pro
              </h1>
              <p className="text-gray-500 text-xs mt-1">AI-Powered Draw Analytics</p>
            </div>
            <div className="bg-gray-800 px-3 py-1 rounded-lg">
              <span className="text-green-400 text-xs font-bold">● LIVE</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 mt-4">
            <button
              onClick={() => setActiveTab('daily')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'daily' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Daily Top 5
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'weekly' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              7-Day Outlook
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'daily' ? (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white mb-2">📅 Today's Best Draws</h2>
              <p className="text-gray-500 text-sm">Highest confidence predictions for today</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {daily.length > 0 ? daily.map((match, i) => (
                <MatchCard key={i} match={match} index={i} />
              )) : (
                <div className="col-span-2 text-center py-10 text-gray-500">
                  No predictions for today yet.
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-white mb-2">📊 7-Day Rolling Outlook</h2>
              <p className="text-gray-500 text-sm">35 predictions for the week ahead</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {weekly.length > 0 ? weekly.map((match, i) => (
                <MatchCard key={i} match={match} index={i} />
              )) : (
                <div className="col-span-3 text-center py-10 text-gray-500">
                  No weekly predictions yet.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 py-3">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-xs">
            AI updates daily at 11 PM UTC • Data from football-data.org
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
