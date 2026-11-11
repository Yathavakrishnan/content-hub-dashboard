import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
    const { register } = useAuth(); 
    const navigate = useNavigate(); 
    const [form, setForm] = useState({ name: '', email: '', password: '' }); 
    const [error, setError] = useState('')
    async function submit(event: React.FormEvent) 
    { 
        event.preventDefault(); setError(''); 
        try { 
            await register(form.name, form.email, form.password); 
            navigate('/dashboard') 
        } catch 
        { 
            setError('Registration failed. Check the API and try again.') 
        } 
    }
    return (
    <main className="auth-shell">
        <section className="auth-panel">
            <p className="eyebrow">MACHINE TASK / JOIN</p>
            <h1>Make your mark.</h1>
            <p className="muted">Create an account to enter the workspace.</p>
            <form onSubmit={submit}>
                <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
                <label>Email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></label>
                <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={6} required /></label>{error && <p className="form-error">{error}</p>}
                <button className="primary-button" type="submit">Create account</button>
            </form>
            <p className="auth-switch">Already registered? 
                <Link to="/login">Sign in</Link>
            </p></section>
            <aside className="auth-aside">                
                <span className="aside-number">02</span>
                    <h2>Build momentum, one post at a time.</h2>
                    <p>Publish ideas and see what resonates with your audience.</p>
                </aside>
        </main>
    )
    }
