import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  return <>
    <Navbar />
    <main className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">WORKSPACE / OVERVIEW</p>
          <h1>Good to see you, {user?.email?.split('@')[0]}.</h1>
          <p className="muted">Your operational view of the content workspace.</p>
        </div>
        <span className="role-chip">{user?.role || 'user'}</span>
      </div>
      <div className="metric-grid">
        <div className="metric">
          <span>01 / STATUS</span>
          <strong>Active</strong>
          <p>API connection ready</p>
        </div>
        <div className="metric">
          <span>02 / ACCESS</span>
          <strong>{user?.role === 'admin' ? 'Full' : 'Standard'}</strong>
          <p>Current permission level</p>
        </div><div className="metric">
          <span>03 / SESSION</span>
          <strong>Secure</strong>
          <p>JWT authenticated</p>
        </div>
      </div>
      <section className="action-section">
        <p className="eyebrow">QUICK ACTIONS</p>
        <div className="action-grid">
          <Link to="/posts" className="action-card">
            <span>01</span>
            <h2>Explore posts</h2>
            <p>Read, publish, and like content.</p>
          </Link>
          {user?.role === 'admin' && <Link to="/users" className="action-card">
            <span>02</span>
            <h2>Manage people</h2>
            <p>Search your user directory.</p>
          </Link>}
          <Link to="/analytics" className="action-card">
            <span>03</span>
            <h2>View analytics</h2>
            <p>Track activity across the workspace.</p>
          </Link>
        </div>
      </section>
    </main></>
}
