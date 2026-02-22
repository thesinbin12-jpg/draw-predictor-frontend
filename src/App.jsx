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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
      </div>
    )
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'bg-green-500'
    if (confidence >= 60) return 'bg-blue-500'
    return 'bg-gray-500'
  }

  const getConfidenceText = (confidence) => {
    if (confidence >= 80) return 'High'
    if (confidence >= 60) return 'Medium'
    return 'Low'
  }

  const MatchCard = ({ match, index }) => (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-green-500 transition-all duration-300 shadow-sm hover:shadow-xl">
      {/* Header with League & Confidence */}
      <div className="flex justify-between items-center mb-4">
        <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
          {match.league_id || 'League'}
        </span>
        <div className={`px-4 py-1 rounded-full text-white font-bold text-sm ${getConfidenceColor(match.confidence)}`}>
          {match.confidence}% - {getConfidenceText(match.confidence)}
        </div>
      </div>
      
      {/* Teams */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-left flex-1">
          <h3 className="text-gray-900 font-bold text-xl mb-1">{match.home_team}</h3>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Home</p>
        </div>
        <div className="bg-gray-100 px-4 py-2 rounded-lg mx-4">
          <span className="text-gray-600 font-bold text-lg">VS</span>
        </div>
        <div className="text-right flex-1">
          <h3 className="text-gray-900 font-bold text-xl mb-1">{match.away_team}</h3>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Away</p>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600 font-medium">Draw Confidence</span>
          <span className="text-gray-900 font-bold">{match.confidence}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${getConfidenceColor(match.confidence)}`} 
            style={{ width: `${match.confidence}%` }}
          ></div>
        </div>
      </div>

      {/* Date & Time */}
      <div className="pt-4 border-t-2 border-gray-100">
        <div className="flex items-center justify-center text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium">
            {new Date(match.match_date).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - White with Green/Blue accents */}
      <div className="bg-white border-b-4 border-green-500 sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                Draw Predictor <span className="text-green-600">Pro</span>
              </h1>
              <p className="text-gray-600 text-sm mt-1 font-medium">AI-Powered Draw Analytics</p>
            </div>
            <div className="bg-green-100 px-4 py-2 rounded-lg border-2 border-green-500">
              <span className="text-green-700 text-sm font-bold flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                LIVE
              </span>
            </div>
          </div>

          {/* Tabs - Green & Blue */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => setActiveTab('daily')}
              className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === 'daily' 
                  ? 'bg-green-600 text-white shadow-lg transform scale-105' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📅 Daily Top 5
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === 'weekly' 
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📊 7-Day Outlook
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'daily' ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Today's Best Draws</h2>
              <p className="text-gray-600">Highest confidence predictions for today</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {daily.length > 0 ? daily.map((match, i) => (
                <MatchCard key={i} match={match} index={i} />
              )) : (
                <div className="col-span-3 text-center py-16 bg-white rounded-2xl border-2 border-gray-200">
                  <p className="text-gray-500 text-lg font-medium">No predictions for today yet.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">7-Day Rolling Outlook</h2>
              <p className="text-gray-600">35 predictions for the week ahead</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {weekly.length > 0 ? weekly.map((match, i) => (
                <MatchCard key={i} match={match} index={i} />
              )) : (
                <div className="col-span-3 text-center py-16 bg-white rounded-2xl border-2 border-gray-200">
                  <p className="text-gray-500 text-lg font-medium">No weekly predictions yet.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer - Grey with Green accent */}
      <div className="bg-gray-900 border-t-4 border-green-500 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm font-medium">
            AI updates daily at 11 PM UTC • Data from football-data.org
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Powered by Machine Learning • Built for Precision
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
