import { useState, useEffect } from 'react'

function App() {
  const [daily, setDaily] = useState([])
  const [weekly, setWeekly] = useState([])
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('daily')

  useEffect(() => {
    // Fetch predictions
    fetch('https://you-dont-know.onrender.com/predictions')
      .then(res => res.json())
      .then(data => {
        setDaily(data.daily || [])
        setWeekly(data.weekly || [])
        
        // Also fetch dashboard analytics
        fetch('https://you-dont-know.onrender.com/dashboard')
          .then(res => res.json())
          .then(dashData => {
            setDashboard(dashData)
            setLoading(false)
          })
          .catch(err => {
            console.error('Dashboard error:', err)
            setLoading(false)
          })
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb'}}>
        <div style={{fontSize: '20px', color: '#059669'}}>Loading predictions...</div>
      </div>
    )
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return '#10b981'
    if (confidence >= 60) return '#3b82f6'
    return '#6b7280'
  }

  const MatchCard = ({ match }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      border: '2px solid #e5e7eb',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = '#10b981'
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.boxShadow = '0 12px 24px rgba(16, 185, 129, 0.15)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = '#e5e7eb'
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'
    }}>
      
      {/* Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <span style={{
          backgroundColor: '#f3f4f6',
          color: '#374151',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {match.league_id || 'League'}
        </span>
        <span style={{
          backgroundColor: getConfidenceColor(match.confidence),
          color: 'white',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '700'
        }}>
          {match.confidence}%
        </span>
      </div>

      {/* Teams */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <div style={{flex: 1, textAlign: 'left'}}>
          <h3 style={{margin: 0, fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '4px'}}>
            {match.home_team}
          </h3>
          <p style={{margin: 0, fontSize: '12px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase'}}>
            Home
          </p>
        </div>
        
        <div style={{
          backgroundColor: '#f3f4f6',
          padding: '12px 20px',
          borderRadius: '12px',
          margin: '0 16px'
        }}>
          <span style={{color: '#6b7280', fontWeight: '700', fontSize: '16px'}}>VS</span>
        </div>

        <div style={{flex: 1, textAlign: 'right'}}>
          <h3 style={{margin: 0, fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '4px'}}>
            {match.away_team}
          </h3>
          <p style={{margin: 0, fontSize: '12px', color: '#9ca3af', fontWeight: '600', textTransform: 'uppercase'}}>
            Away
          </p>
        </div>
      </div>

      {/* Confidence Bar */}
      <div style={{marginBottom: '20px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px'}}>
          <span style={{color: '#4b5563', fontWeight: '500'}}>Draw Confidence</span>
          <span style={{color: '#111827', fontWeight: '700'}}>{match.confidence}%</span>
        </div>
        <div style={{
          width: '100%',
          height: '10px',
          backgroundColor: '#e5e7eb',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${match.confidence}%`,
            height: '100%',
            backgroundColor: getConfidenceColor(match.confidence),
            borderRadius: '10px',
            transition: 'width 0.5s ease'
          }}></div>
        </div>
      </div>

      {/* Uncertainty Margin */}
      <div style={{
        marginBottom: '20px',
        padding: '12px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px'}}>
          <span style={{color: '#6b7280', fontWeight: '500'}}>Uncertainty Margin</span>
          <span style={{color: '#111827', fontWeight: '700'}}>
            ±{match.uncertainty_margin || 0}%
          </span>
        </div>
        <p style={{margin: '4px 0 0 0', fontSize: '11px', color: '#9ca3af'}}>
          Lower margin = More reliable prediction
        </p>
      </div>

      {/* Date */}
      <div style={{
        paddingTop: '16px',
        borderTop: '2px solid #f3f4f6',
        textAlign: 'center'
      }}>
        <span style={{color: '#6b7280', fontSize: '14px', fontWeight: '500'}}>
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
  )

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f9fafb'}}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '4px solid #10b981',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '24px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '32px',
                fontWeight: '800',
                color: '#111827'
              }}>
                Draw Predictor <span style={{color: '#10b981'}}>Pro</span>
              </h1>
              <p style={{margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280', fontWeight: '500'}}>
                AI-Powered Draw Analytics
              </p>
            </div>
            <div style={{
              backgroundColor: '#d1fae5',
              border: '2px solid #10b981',
              padding: '8px 16px',
              borderRadius: '8px'
            }}>
              <span style={{color: '#065f46', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px'}}>
                <span style={{width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite'}}></span>
                LIVE
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div style={{display: 'flex', gap: '12px'}}>
            <button
              onClick={() => setActiveTab('daily')}
              style={{
                flex: 1,
                padding: '14px 24px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                backgroundColor: activeTab === 'daily' ? '#10b981' : '#f3f4f6',
                color: activeTab === 'daily' ? 'white' : '#6b7280',
                transition: 'all 0.3s ease',
                boxShadow: activeTab === 'daily' ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
              }}
            >
              📅 Daily Picks
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              style={{
                flex: 1,
                padding: '14px 24px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                backgroundColor: activeTab === 'weekly' ? '#3b82f6' : '#f3f4f6',
                color: activeTab === 'weekly' ? 'white' : '#6b7280',
                transition: 'all 0.3s ease',
                boxShadow: activeTab === 'weekly' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
              }}
            >
              📊 7-Day Outlook
            </button>
          </div>
        </div>
      </div>

      {/* ✅ DASHBOARD ANALYTICS SECTION - NEW! */}
      {dashboard && (
        <div style={{
          backgroundColor: 'white',
          borderBottom: '2px solid #e5e7eb',
          padding: '24px'
        }}>
          <div style={{maxWidth: '1200px', margin: '0 auto'}}>
            <h2 style={{fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '16px'}}>
              📈 Analytics Dashboard
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              {/* Overall Accuracy */}
              <div style={{
                padding: '20px',
                backgroundColor: '#f0fdf4',
                borderRadius: '12px',
                border: '2px solid #10b981'
              }}>
                <p style={{margin: 0, fontSize: '12px', color: '#065f46', fontWeight: '600', textTransform: 'uppercase'}}>
                  Overall Accuracy
                </p>
                <p style={{margin: '8px 0 0 0', fontSize: '32px', fontWeight: '800', color: '#10b981'}}>
                  {dashboard.overall_stats.accuracy}%
                </p>
              </div>

              {/* Total Predictions */}
              <div style={{
                padding: '20px',
                backgroundColor: '#eff6ff',
                borderRadius: '12px',
                border: '2px solid #3b82f6'
              }}>
                <p style={{margin: 0, fontSize: '12px', color: '#1e40af', fontWeight: '600', textTransform: 'uppercase'}}>
                  Total Predictions
                </p>
                <p style={{margin: '8px 0 0 0', fontSize: '32px', fontWeight: '800', color: '#3b82f6'}}>
                  {dashboard.overall_stats.total_predictions}
                </p>
              </div>

              {/* Correct Predictions */}
              <div style={{
                padding: '20px',
                backgroundColor: '#fef3c7',
                borderRadius: '12px',
                border: '2px solid #f59e0b'
              }}>
                <p style={{margin: 0, fontSize: '12px', color: '#92400e', fontWeight: '600', textTransform: 'uppercase'}}>
                  Correct Predictions
                </p>
                <p style={{margin: '8px 0 0 0', fontSize: '32px', fontWeight: '800', color: '#f59e0b'}}>
                  {dashboard.overall_stats.correct_predictions}
                </p>
              </div>

              {/* Learner Adjustment */}
              <div style={{
                padding: '20px',
                backgroundColor: '#f3f4f6',
                borderRadius: '12px',
                border: '2px solid #6b7280'
              }}>
                <p style={{margin: 0, fontSize: '12px', color: '#374151', fontWeight: '600', textTransform: 'uppercase'}}>
                  AI Adjustment
                </p>
                <p style={{margin: '8px 0 0 0', fontSize: '32px', fontWeight: '800', color: '#6b7280'}}>
                  {dashboard.learner_status.adjustment >= 0 ? '+' : ''}{dashboard.learner_status.adjustment}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '32px'}}>
        {activeTab === 'daily' ? (
          <>
            <div style={{marginBottom: '32px'}}>
              <h2 style={{fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '8px'}}>
                Today's Picks
              </h2>
              <p style={{fontSize: '15px', color: '#6b7280'}}>
                AI-selected draws for today ({daily.length} pick{daily.length !== 1 ? 's' : ''})
              </p>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '24px'
            }}>
              {daily.length > 0 ? daily.map((match, i) => (
                <MatchCard key={i} match={match} />
              )) : (
                <div style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '64px',
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  border: '2px solid #e5e7eb'
                }}>
                  <p style={{color: '#6b7280', fontSize: '16px', fontWeight: '500', marginBottom: '8px'}}>
                    ⚠️ No predictions for today
                  </p>
                  <p style={{color: '#9ca3af', fontSize: '14px'}}>
                    AI didn't find any high-confidence draws (60%+).<br/>Check back tomorrow!
                  </p>
                </div>
              )}
            </div>
          </>
          ) : (
          <>
            <div style={{marginBottom: '32px'}}>
              <h2 style={{fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '8px'}}>
                7-Day Rolling Outlook
              </h2>
              <p style={{fontSize: '15px', color: '#6b7280'}}>
                {weekly.length} predictions for the week ahead
              </p>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '24px'
            }}>
              {weekly.length > 0 ? weekly.map((match, i) => (
                <MatchCard key={i} match={match} />
              )) : (
                <div style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '64px',
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  border: '2px solid #e5e7eb'
                }}>
                  <p style={{color: '#6b7280', fontSize: '16px', fontWeight: '500'}}>
                    No weekly predictions yet.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: '#111827',
        borderTop: '4px solid #10b981',
        padding: '24px',
        marginTop: '64px',
        textAlign: 'center'
      }}>
        <p style={{color: '#9ca3af', fontSize: '14px', margin: 0}}>
          AI updates daily at 11 PM UTC • Data from football-data.org
        </p>
        <p style={{color: '#6b7280', fontSize: '12px', marginTop: '8px', margin: 0}}>
          Powered by Machine Learning • Built for Precision
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

export default App
