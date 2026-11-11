import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('')
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard')
    } catch {
      setError('Invalid email or password')
    }
  }
  return <main className="auth-shell">
    <section className="auth-panel">
      <p className="eyebrow">MACHINE TASK / ACCESS</p>
      <h1>Welcome back.</h1>
      <p className="muted">Sign in to manage your workspace.</p>
      <form onSubmit={submit}>
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>{error && <p className="form-error">{error}</p>}
        <button className="primary-button" type="submit">Sign in</button>
      </form>
      <p className="auth-switch">New here? <Link to="/register">Create an account</Link></p></section><aside className="auth-aside"><span className="aside-number">01</span><h2>A clearer way to run your content.</h2><p>People, posts, and performance in one focused workspace.</p></aside></main>
}
