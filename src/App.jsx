import { useEffect, useState } from 'react'

function App() {
  const [predictions, setPredictions] = useState([])
  const [stats, setStats] = useState({ total_predictions: 0, correct_predictions: 0, accuracy: 0 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const API_URL = "https://you-dont-know.onrender.com"

  useEffect(() => {
    // Fetch Predictions
    fetch(`${API_URL}/api/predictions`)
      .then((res) => res.json())
      .then((data) => setPredictions(data))
      .catch((err) => console.error(err))

    // Fetch Stats
    fetch(`${API_URL}/api/stats`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
    
    setLoading(false)
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 70) return '#2ecc71'
    if (confidence >= 50) return '#f39c12'
    return '#e74c3c'
  }

  const filteredPredictions = predictions.filter(pred => {
    if (filter === 'all') return true
    if (filter === 'high') return pred.confidence >= 70
    if (filter === 'medium') return pred.confidence >= 50 && pred.confidence < 70
    if (filter === 'low') return pred.confidence < 50
    return true
  })

  const sortedPredictions = [...filteredPredictions].sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
  const goldenPick = sortedPredictions.length > 0 ? sortedPredictions[0] : null

  if (loading) return <div style={styles.loading}>Loading dashboard...</div>

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logo}>🎯</div>
        <h1 style={styles.title}>Draw Predictor</h1>
      </div>

      {/* Stats Card */}
      <div style={styles.statsCard}>
        <div style={styles.statBox}>
          <div style={styles.statValue}>{stats.accuracy}%</div>
          <div style={styles.statLabel}>Accuracy</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statValue}>{stats.total_predictions}</div>
          <div style={styles.statLabel}>Total</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statValue}>{stats.correct_predictions}</div>
          <div style={styles.statLabel}>Won</div>
        </div>
      </div>

      {/* Golden Pick */}
      {goldenPick && (
        <div style={styles.goldenPick}>
          <div style={styles.goldenBadge}>👑 GOLDEN PICK</div>
          <h2 style={styles.goldenMatch}>{goldenPick.home_team} vs {goldenPick.away_team}</h2>
          <div style={styles.goldenConfidence}>Confidence: {goldenPick.confidence}%</div>
          <div style={styles.goldenDate}>{formatDate(goldenPick.match_date)}</div>
        </div>
      )}

      {/* Filters */}
      <div style={styles.filterContainer}>
        {['all', 'high', 'medium', 'low'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{...styles.filterBtn, backgroundColor: filter === f ? '#2ecc71' : '#34495e', color: 'white'}}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={styles.list}>
        {sortedPredictions.map((pred, index) => (
          <div key={pred.id} style={styles.card}>
            <div style={styles.rank}>#{index + 1}</div>
            <div style={styles.matchInfo}>
              <h3 style={styles.teams}>{pred.home_team} vs {pred.away_team}</h3>
              <div style={styles.date}>📅 {formatDate(pred.match_date)}</div>
              <div style={styles.confidenceBar}>
                <div style={{...styles.confidenceFill, width: `${pred.confidence || 50}%`, backgroundColor: getConfidenceColor(pred.confidence)}}></div>
                <span style={styles.confidenceText}>{pred.confidence || 50}%</span>
              </div>
              <div style={styles.status}>{pred.outcome === 'finished' ? (pred.is_correct ? '✅ Won' : '❌ Lost') : '⏳ Pending'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#1a1a2e', color: '#eee', fontFamily: 'Arial, sans-serif', padding: '20px' },
  header: { textAlign: 'center', marginBottom: '20px' },
  logo: { fontSize: '50px', marginBottom: '5px' },
  title: { margin: 0, fontSize: '28px', background: 'linear-gradient(45deg, #2ecc71, #3498db)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  statsCard: { display: 'flex', justifyContent: 'space-around', backgroundColor: '#16213e', padding: '20px', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' },
  statBox: { textAlign: 'center' },
  statValue: { fontSize: '24px', fontWeight: 'bold', color: '#2ecc71' },
  statLabel: { fontSize: '12px', color: '#95a5a6', marginTop: '5px' },
  goldenPick: { background: 'linear-gradient(135deg, #f1c40f, #f39c12)', borderRadius: '20px', padding: '25px', marginBottom: '20px', textAlign: 'center', boxShadow: '0 10px 30px rgba(241, 196, 15, 0.3)', border: '3px solid #fff' },
  goldenBadge: { backgroundColor: '#fff', color: '#f39c12', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', display: 'inline-block', marginBottom: '10px', fontSize: '12px' },
  goldenMatch: { margin: '10px 0', fontSize: '20px', color: '#fff' },
  goldenConfidence: { fontSize: '24px', fontWeight: 'bold', color: '#fff', margin: '5px 0' },
  goldenDate: { color: '#fff', opacity: 0.9, fontSize: '14px' },
  filterContainer: { display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center', flexWrap: 'wrap' },
  filterBtn: { padding: '8px 16px', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' },
  list: { display: 'grid', gap: '15px' },
  card: { backgroundColor: '#16213e', borderRadius: '15px', padding: '15px', display: 'flex', gap: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', border: '1px solid #0f3460' },
  rank: { fontSize: '20px', fontWeight: 'bold', color: '#2ecc71', minWidth: '30px' },
  matchInfo: { flex: 1 },
  teams: { margin: '0 0 5px 0', fontSize: '16px', color: '#fff' },
  date: { color: '#95a5a6', fontSize: '12px', marginBottom: '8px' },
  confidenceBar: { backgroundColor: '#0f3460', borderRadius: '10px', height: '20px', position: 'relative', overflow: 'hidden', marginBottom: '5px' },
  confidenceFill: { height: '100%', borderRadius: '10px', transition: 'width 0.3s' },
  confidenceText: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '10px', fontWeight: 'bold', color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.5)' },
  status: { fontSize: '12px', fontWeight: 'bold', color: '#95a5a6' },
  loading: { textAlign: 'center', padding: '50px', fontSize: '20px' }
}

export default App