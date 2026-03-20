import { useState, useEffect } from 'react'

const API = 'https://you-dont-know.onrender.com'

// ── League ID → Human name ────────────────────────────────────
const LEAGUE_NAMES = {
  // football-data.org codes
  'PL':   'Premier League',    '2021': 'Premier League',
  'PD':   'La Liga',           '2014': 'La Liga',
  'BL1':  'Bundesliga',        '2002': 'Bundesliga',
  'SA':   'Serie A',           '2019': 'Serie A',
  'FL1':  'Ligue 1',           '2015': 'Ligue 1',
  'CL':   'Champions League',  '2001': 'Champions League',
  'ELC':  'Championship',      '2016': 'Championship',
  'DED':  'Eredivisie',        '2003': 'Eredivisie',
  'PPL':  'Primeira Liga',     '2017': 'Primeira Liga',
  'BSA':  'Brasileirao',       '2013': 'Brasileirao',
                               '2152': 'Copa Libertadores',
  // API-Football expanded leagues
  'af_94':  'Primeira Liga',
  'af_144': 'Belgian Pro League',
  'af_88':  'Eredivisie',
  'af_203': 'Süper Lig',
  'af_113': 'Allsvenskan',
  'af_119': 'Superliga',
  'af_307': 'Saudi Pro League',
  'af_98':  'J1 League',
  'af_292': 'K League 1',
  'af_169': 'Chinese Super League',
}
const leagueName = (id) => LEAGUE_NAMES[id] || id || '—'

// ── Date + time formatter ─────────────────────────────────────
const formatMatchDate = (raw) => {
  if (!raw) return '—'
  try {
    const d = new Date(raw)
    if (isNaN(d.getTime())) return '—'
    const day  = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
    const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    return `${day}, ${time}`
  } catch { return '—' }
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green: #00e87a;
    --green-dim: #00c463;
    --green-glow: rgba(0, 232, 122, 0.18);
    --green-subtle: rgba(0, 232, 122, 0.07);
    --red: #ff4b4b;
    --blue: #3b8bff;
    --bg: #080d0f;
    --bg2: #0d1517;
    --bg3: #131e21;
    --border: rgba(255,255,255,0.07);
    --border-green: rgba(0, 232, 122, 0.25);
    --text: #f0f4f5;
    --text-muted: #5a7278;
    --text-mid: #8aa4ab;
    --font-display: 'Bebas Neue', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border-green); border-radius: 4px; }

  /* ── Grid noise background ── */
  .noise-bg {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 40px 40px;
    opacity: 0.4;
  }

  .glow-orb {
    position: fixed; z-index: 0; pointer-events: none;
    border-radius: 50%; filter: blur(120px); opacity: 0.12;
  }
  .glow-orb-1 {
    width: 600px; height: 600px;
    background: var(--green);
    top: -200px; left: -200px;
  }
  .glow-orb-2 {
    width: 400px; height: 400px;
    background: var(--blue);
    bottom: 100px; right: -100px;
  }

  /* ── Layout ── */
  .wrapper { position: relative; z-index: 1; }

  /* ── Header ── */
  .header {
    position: sticky; top: 0; z-index: 100;
    background: rgba(8, 13, 15, 0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    padding: 0 24px;
  }
  .header-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    height: 72px; gap: 24px;
  }
  .logo-block { display: flex; align-items: center; gap: 14px; }
  .logo-icon {
    width: 42px; height: 42px; border-radius: 10px;
    background: linear-gradient(135deg, var(--green), var(--green-dim));
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; box-shadow: 0 0 20px var(--green-glow);
  }
  .logo-title {
    font-family: var(--font-display);
    font-size: 26px; letter-spacing: 2px;
    color: var(--text); line-height: 1;
  }
  .logo-title span { color: var(--green); }
  .logo-sub {
    font-size: 11px; color: var(--text-muted);
    font-family: var(--font-mono); letter-spacing: 1px;
    text-transform: uppercase; margin-top: 2px;
  }
  .live-badge {
    display: flex; align-items: center; gap: 7px;
    background: var(--green-subtle);
    border: 1px solid var(--border-green);
    padding: 6px 14px; border-radius: 6px;
    font-family: var(--font-mono); font-size: 11px;
    color: var(--green); letter-spacing: 1.5px; text-transform: uppercase;
  }
  .live-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--green);
    animation: blink 1.8s ease-in-out infinite;
  }
  @keyframes blink {
    0%, 100% { opacity: 1; box-shadow: 0 0 6px var(--green); }
    50% { opacity: 0.3; box-shadow: none; }
  }

  /* ── Tabs ── */
  .tabs {
    max-width: 1200px; margin: 0 auto;
    padding: 28px 24px 0;
    display: flex; gap: 6px;
  }
  .tab {
    padding: 10px 22px; border-radius: 8px; border: 1px solid var(--border);
    font-family: var(--font-body); font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
    background: transparent; color: var(--text-muted);
    letter-spacing: 0.3px;
  }
  .tab:hover { border-color: var(--border-green); color: var(--text); }
  .tab.active-green {
    background: var(--green-subtle); border-color: var(--green);
    color: var(--green); box-shadow: 0 0 16px var(--green-glow);
  }
  .tab.active-blue {
    background: rgba(59,139,255,0.08); border-color: var(--blue);
    color: var(--blue); box-shadow: 0 0 16px rgba(59,139,255,0.15);
  }
  .tab.active-purple {
    background: rgba(139,92,246,0.08); border-color: #8b5cf6;
    color: #8b5cf6; box-shadow: 0 0 16px rgba(139,92,246,0.15);
  }

  /* ── Stats Bar ── */
  .stats-bar {
    max-width: 1200px; margin: 0 auto;
    padding: 20px 24px;
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
  }
  .stat-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 12px; padding: 18px 20px;
    transition: border-color 0.2s;
  }
  .stat-card:hover { border-color: var(--border-green); }
  .stat-label {
    font-family: var(--font-mono); font-size: 10px;
    color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.2px;
    margin-bottom: 8px;
  }
  .stat-value {
    font-family: var(--font-display); font-size: 36px;
    letter-spacing: 1px; line-height: 1;
  }
  .stat-value.green { color: var(--green); }
  .stat-value.blue  { color: var(--blue); }
  .stat-value.amber { color: #f59e0b; }
  .stat-value.muted { color: var(--text-mid); }

  /* ── Content Area ── */
  .content {
    max-width: 1200px; margin: 0 auto;
    padding: 8px 24px 60px;
  }
  .section-header { margin-bottom: 24px; }
  .section-title {
    font-family: var(--font-display);
    font-size: 32px; letter-spacing: 2px; color: var(--text);
    line-height: 1;
  }
  .section-title span { color: var(--green); }
  .section-sub {
    font-size: 13px; color: var(--text-muted);
    margin-top: 6px; font-family: var(--font-mono);
  }

  /* ── Match Grid ── */
  .match-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 16px;
  }

  /* ── Match Card ── */
  .match-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 16px; padding: 22px;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative; overflow: hidden;
    animation: fadeUp 0.4s ease both;
  }
  .match-card::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--green), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .match-card:hover {
    border-color: var(--border-green);
    transform: translateY(-3px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px var(--border-green);
  }
  .match-card:hover::before { opacity: 1; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .card-top {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 18px;
  }
  .league-tag {
    font-family: var(--font-mono); font-size: 10px;
    color: var(--text-muted); letter-spacing: 1.5px;
    text-transform: uppercase;
    background: var(--bg3); border: 1px solid var(--border);
    padding: 4px 10px; border-radius: 4px;
  }
  .conf-badge {
    font-family: var(--font-mono); font-size: 13px; font-weight: 600;
    padding: 5px 12px; border-radius: 6px;
  }
  .conf-high { background: var(--green-subtle); color: var(--green); border: 1px solid var(--border-green); }
  .conf-mid  { background: rgba(59,139,255,0.08); color: var(--blue); border: 1px solid rgba(59,139,255,0.25); }
  .conf-low  { background: rgba(90,114,120,0.15); color: var(--text-muted); border: 1px solid var(--border); }

  .teams-row {
    display: flex; align-items: center;
    gap: 12px; margin-bottom: 20px;
  }
  .team { flex: 1; }
  .team-name {
    font-family: var(--font-body); font-size: 15px;
    font-weight: 700; color: var(--text);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    line-height: 1.2; margin-bottom: 3px;
  }
  .team-side {
    font-family: var(--font-mono); font-size: 9px;
    color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;
  }
  .team.away { text-align: right; }
  .vs-block {
    background: var(--bg3); border: 1px solid var(--border);
    padding: 8px 12px; border-radius: 8px; flex-shrink: 0;
    font-family: var(--font-mono); font-size: 11px;
    color: var(--text-muted); font-weight: 600;
  }

  /* Confidence bar */
  .conf-row {
    display: flex; justify-content: space-between;
    align-items: center; margin-bottom: 6px;
    font-size: 12px;
  }
  .conf-label { color: var(--text-muted); font-family: var(--font-mono); }
  .conf-val { color: var(--green); font-family: var(--font-mono); font-weight: 600; }
  .bar-track {
    height: 4px; background: var(--bg3); border-radius: 4px;
    overflow: hidden; margin-bottom: 14px;
  }
  .bar-fill {
    height: 100%; border-radius: 4px;
    background: linear-gradient(90deg, var(--green-dim), var(--green));
    box-shadow: 0 0 8px var(--green-glow);
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Uncertainty + date */
  .card-bottom {
    display: flex; justify-content: space-between; align-items: center;
    padding-top: 14px; border-top: 1px solid var(--border);
  }
  .uncertainty {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--text-muted);
  }
  .uncertainty span { color: var(--text-mid); font-weight: 600; }
  .match-date {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--text-muted);
  }

  /* ── Empty State ── */
  .empty {
    grid-column: 1 / -1;
    background: var(--bg2); border: 1px dashed var(--border);
    border-radius: 16px; padding: 64px 32px; text-align: center;
  }
  .empty-icon { font-size: 40px; margin-bottom: 16px; }
  .empty-title { font-size: 16px; font-weight: 600; color: var(--text-mid); margin-bottom: 8px; }
  .empty-sub { font-size: 13px; color: var(--text-muted); font-family: var(--font-mono); }

  /* ── Analytics Tab ── */
  .analytics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .analytics-card {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 16px; padding: 24px;
  }
  .analytics-card-title {
    font-family: var(--font-mono); font-size: 11px;
    text-transform: uppercase; letter-spacing: 1.5px;
    color: var(--text-muted); margin-bottom: 18px;
  }
  .league-row {
    display: flex; align-items: center;
    justify-content: space-between; margin-bottom: 12px;
  }
  .league-name { font-size: 13px; font-weight: 600; color: var(--text); }
  .league-rate {
    font-family: var(--font-mono); font-size: 12px; color: var(--green);
  }
  .league-bar-track { flex: 1; height: 3px; background: var(--bg3); border-radius: 3px; margin: 0 12px; }
  .league-bar-fill { height: 100%; background: var(--green); border-radius: 3px; }

  .trend-row {
    display: flex; align-items: center;
    justify-content: space-between; padding: 10px 0;
    border-bottom: 1px solid var(--border);
    font-size: 12px;
  }
  .trend-row:last-child { border-bottom: none; }
  .trend-date { font-family: var(--font-mono); color: var(--text-muted); }
  .trend-stats { color: var(--text-mid); }
  .trend-rate { font-family: var(--font-mono); font-weight: 600; }
  .trend-rate.good { color: var(--green); }
  .trend-rate.bad  { color: var(--red); }
  .trend-rate.mid  { color: #f59e0b; }

  /* ── Loading ── */
  .loading-screen {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 20px;
    background: var(--bg);
  }
  .loading-logo {
    font-family: var(--font-display); font-size: 48px;
    letter-spacing: 4px; color: var(--text);
  }
  .loading-logo span { color: var(--green); }
  .loading-bar {
    width: 200px; height: 2px; background: var(--bg3);
    border-radius: 2px; overflow: hidden;
  }
  .loading-bar-fill {
    height: 100%; width: 40%;
    background: var(--green);
    animation: slide 1.2s ease-in-out infinite;
  }
  @keyframes slide {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(400%); }
  }
  .loading-text {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase;
  }

  /* ── Footer ── */
  .footer {
    border-top: 1px solid var(--border);
    padding: 24px;
    text-align: center;
  }
  .footer-text {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--text-muted); letter-spacing: 0.5px;
  }
  .footer-text a { color: var(--green); text-decoration: none; }
  .footer-text a:hover { text-decoration: underline; }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .stats-bar { grid-template-columns: repeat(2, 1fr); gap: 8px; padding: 12px 16px; }
    .match-grid { grid-template-columns: 1fr; }
    .analytics-grid { grid-template-columns: 1fr; }
    .logo-sub { display: none; }
    .header { padding: 0 16px; }
    .header-inner { height: 56px; gap: 12px; }
    .logo-icon { width: 34px; height: 34px; font-size: 16px; }
    .logo-title { font-size: 20px; }
    .live-badge { padding: 4px 10px; font-size: 9px; }
    .tabs { padding: 12px 16px 0; gap: 6px; }
    .tab { flex: 1; font-size: 11px; padding: 9px 6px; text-align: center; }
    .content { padding: 12px 16px 60px; }
    .stats-bar { padding: 12px 16px; }
    .stat-value { font-size: 28px; }
    .stat-label { font-size: 8px; }
    .section-title { font-size: 26px; }
    .match-card { padding: 16px; }
    .team-name { font-size: 13px; }
    .league-tag { font-size: 9px; max-width: 52%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .card-bottom { flex-direction: column; align-items: flex-start; gap: 6px; }
    .match-date { font-size: 10px; }
    .analytics-card { padding: 16px; }
  }
  @media (max-width: 360px) {
    .logo-title { font-size: 18px; }
    .stat-value { font-size: 24px; }
    .tab { font-size: 10px; padding: 8px 4px; }
  }
`

function getConfClass(conf) {
  if (conf >= 70) return 'conf-high'
  if (conf >= 50) return 'conf-mid'
  return 'conf-low'
}

function MatchCard({ match, index }) {
  return (
    <div className="match-card" style={{ animationDelay: `${index * 0.06}s` }}>
      <div className="card-top">
        <span className="league-tag">{leagueName(match.league_id)}</span>
        <span className={`conf-badge ${getConfClass(match.confidence)}`}>
          pb {match.confidence}
        </span>
      </div>

      <div className="teams-row">
        <div className="team">
          <div className="team-name">{match.home_team}</div>
          <div className="team-side">Home</div>
        </div>
        <div className="vs-block">VS</div>
        <div className="team away">
          <div className="team-name">{match.away_team}</div>
          <div className="team-side">Away</div>
        </div>
      </div>

      <div className="conf-row">
        <span className="conf-label">Draw probability</span>
        <span className="conf-val">pb {match.confidence}</span>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${match.confidence}%` }} />
      </div>

      <div className="card-bottom">
        <span className="uncertainty">
          Margin <span>±{match.uncertainty_margin || 0}</span>
        </span>
        <span className="match-date">
          {formatMatchDate(match.match_date)}
        </span>
      </div>

      {/* ── Swarm Signal Panel ── */}
      {match.swarm_signal != null && (
        <div style={{
          marginTop: '10px', paddingTop: '10px',
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '6px', flexWrap: 'wrap',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            🐠 10-Agent Swarm
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600,
            color: match.swarm_signal >= 60 ? 'var(--green)' : match.swarm_signal >= 40 ? '#f59e0b' : '#ff4b4b'
          }}>
            {match.swarm_signal}%
          </span>
          {match.swarm_agreement && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '2px 6px', borderRadius: '4px',
              background: match.swarm_agreement === 'HIGH' ? 'rgba(0,232,122,0.1)' : match.swarm_agreement === 'MEDIUM' ? 'rgba(245,158,11,0.1)' : 'rgba(255,75,75,0.1)',
              color: match.swarm_agreement === 'HIGH' ? 'var(--green)' : match.swarm_agreement === 'MEDIUM' ? '#f59e0b' : '#ff4b4b',
              border: `1px solid ${match.swarm_agreement === 'HIGH' ? 'rgba(0,232,122,0.3)' : match.swarm_agreement === 'MEDIUM' ? 'rgba(245,158,11,0.3)' : 'rgba(255,75,75,0.3)'}`,
            }}>
              {match.swarm_agreement} AGREE
            </span>
          )}
          {match.swarm_override && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px', padding: '2px 6px', borderRadius: '4px',
              background: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)',
            }}>
              ⚡ OVERRIDE
            </span>
          )}
        </div>
      )}
    </div>
  )
}

function EmptyState({ message }) {
  return (
    <div className="empty">
      <div className="empty-icon">⚡</div>
      <div className="empty-title">{message}</div>
      <div className="empty-sub">My model updates daily at 23:00 UTC</div>
    </div>
  )
}

export default function App() {
  const [daily, setDaily]       = useState([])
  const [weekly, setWeekly]     = useState([])
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [activeTab, setActiveTab] = useState('daily')

  useEffect(() => {
    Promise.all([
      fetch(`${API}/predictions`).then(r => r.json()),
      fetch(`${API}/dashboard`).then(r => r.json()),
    ])
      .then(([pred, dash]) => {
        setDaily(pred.daily || [])
        setWeekly(pred.weekly || [])
        setDashboard(dash)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="loading-screen">
        <div className="loading-logo">DRAW <span>SIGNAL</span></div>
        <div className="loading-bar"><div className="loading-bar-fill" /></div>
        <div className="loading-text">Loading predictions...</div>
      </div>
    </>
  )

  const stats = dashboard?.overall_stats
  const learner = dashboard?.learner_status
  const topLeagues = dashboard?.top_leagues || []
  const trend = dashboard?.weekly_trend || []

  return (
    <>
      <style>{styles}</style>
      <div className="noise-bg" />
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />

      <div className="wrapper">
        {/* ── Header ── */}
        <header className="header">
          <div className="header-inner">
            <div className="logo-block">
              <div className="logo-icon">⚽</div>
              <div>
                <div className="logo-title">DRAW <span>SIGNAL</span></div>
                <div className="logo-sub">Probabilistic · Transparent · Self-learning</div>
              </div>
            </div>
            <div className="live-badge">
              <span className="live-dot" />
              Live
            </div>
          </div>
        </header>

        {/* ── Stats Bar ── */}
        {stats && (
          <div className="stats-bar">
            <div className="stat-card">
              <div className="stat-label">Draw Hit-Rate</div>
              <div className="stat-value green">{stats.draw_hit_rate ?? stats.accuracy ?? 0}%</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Predictions</div>
              <div className="stat-value blue">{stats.total_predictions ?? 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Draws Correct</div>
              <div className="stat-value amber">{stats.draws_correct ?? stats.correct_predictions ?? 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Model Adjustment</div>
              <div className="stat-value muted">
                {(learner?.adjustment ?? 0) >= 0 ? '+' : ''}{learner?.adjustment ?? 0}%
              </div>
            </div>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="tabs">
          {[
            { id: 'daily',     label: '📅  Daily Picks',    cls: 'active-green'  },
            { id: 'weekly',    label: '📆  7-Day Outlook',  cls: 'active-blue'   },
            { id: 'analytics', label: '📈  Analytics',      cls: 'active-purple' },
          ].map(t => (
            <button
              key={t.id}
              className={`tab ${activeTab === t.id ? t.cls : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div className="content">

          {activeTab === 'daily' && (
            <>
              <div className="section-header">
                <div className="section-title">TODAY'S <span>PICKS</span></div>
                <div className="section-sub">
                  {daily.length} draw signal{daily.length !== 1 ? 's' : ''} selected by my model
                </div>
              </div>
              <div className="match-grid">
                {daily.length > 0
                  ? daily.map((m, i) => <MatchCard key={i} match={m} index={i} />)
                  : <EmptyState message="No picks for today yet" />
                }
              </div>
            </>
          )}

          {activeTab === 'weekly' && (
            <>
              <div className="section-header">
                <div className="section-title">7-DAY <span>OUTLOOK</span></div>
                <div className="section-sub">
                  {weekly.length} predictions for the week ahead
                </div>
              </div>
              <div className="match-grid">
                {weekly.length > 0
                  ? weekly.map((m, i) => <MatchCard key={i} match={m} index={i} />)
                  : <EmptyState message="No weekly predictions yet" />
                }
              </div>
            </>
          )}

          {activeTab === 'analytics' && (
            <>
              <div className="section-header">
                <div className="section-title">MODEL <span>ANALYTICS</span></div>
                <div className="section-sub">Full transparency — every result tracked</div>
              </div>
              <div className="analytics-grid">

                {/* Top Leagues */}
                <div className="analytics-card">
                  <div className="analytics-card-title">Draw hit-rate by league</div>
                  {topLeagues.length > 0 ? topLeagues.map((l, i) => (
                    <div key={i} className="league-row">
                      <span className="league-name">{leagueName(l.league)}</span>
                      <div className="league-bar-track">
                        <div className="league-bar-fill" style={{ width: `${l.draw_hit_rate ?? l.accuracy ?? 0}%` }} />
                      </div>
                      <span className="league-rate">{l.draw_hit_rate ?? l.accuracy ?? 0}%</span>
                    </div>
                  )) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
                      No league data yet
                    </div>
                  )}
                </div>

                {/* Weekly Trend */}
                <div className="analytics-card">
                  <div className="analytics-card-title">7-day accuracy trend</div>
                  {trend.length > 0 ? trend.map((d, i) => {
                    const rate = d.draw_hit_rate ?? d.accuracy ?? 0
                    return (
                      <div key={i} className="trend-row">
                        <span className="trend-date">{d.date}</span>
                        <span className="trend-stats">{d.draws_correct ?? d.correct ?? 0}/{d.total}</span>
                        <span className={`trend-rate ${rate >= 40 ? 'good' : rate >= 20 ? 'mid' : 'bad'}`}>
                          {rate}%
                        </span>
                      </div>
                    )
                  }) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
                      No trend data yet
                    </div>
                  )}
                </div>

                {/* Model Status */}
                <div className="analytics-card" style={{ gridColumn: '1 / -1' }}>
                  <div className="analytics-card-title">Model status</div>
                  <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                    {[
                      { label: 'Phase', value: stats?.total_predictions < 25 ? '1 — Calibration' : stats?.total_predictions < 50 ? '2 — Stabilization' : stats?.total_predictions < 100 ? '3 — Optimization' : '4 — Full Autonomy' },
                      { label: 'Last Updated', value: learner?.last_updated ?? 'N/A' },
                      { label: 'Confidence Adj', value: `${(learner?.adjustment ?? 0) >= 0 ? '+' : ''}${learner?.adjustment ?? 0}%` },
                      { label: 'Real Draw Rate (30d)', value: `${dashboard?.real_draw_rate?.real_draw_rate ?? '—'}%` },
                    ].map((item, i) => (
                      <div key={i}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                          {item.label}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--text)', fontWeight: 600 }}>
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </>
          )}

        </div>

        {/* ── Footer ── */}
        <footer className="footer">
          <div className="footer-text">
            My model updates daily at 23:00 UTC · Data from football-data.org ·{' '}
            <a href="https://t.me/Drawsignalai" target="_blank" rel="noreferrer">
              t.me/Drawsignalai
            </a>
          </div>
          <div className="footer-text" style={{ marginTop: '6px', opacity: 0.5 }}>
            Bet responsibly · Draw Signal PB · Free during calibration phase
          </div>
        </footer>
      </div>
    </>
  )
}
