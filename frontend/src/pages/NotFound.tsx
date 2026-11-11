import { Link } from 'react-router-dom'
export default function NotFound() { return <main className="auth-shell"><section className="auth-panel"><p className="eyebrow">404 / NOT FOUND</p><h1>That page moved.</h1><p className="muted">Return to your workspace and keep going.</p><Link className="primary-button button-link" to="/dashboard">Back to dashboard</Link></section></main> }
