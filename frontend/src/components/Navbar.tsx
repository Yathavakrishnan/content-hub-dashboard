import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import ConfirmModal from './ConfirmModal'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  async function confirmLogout() {
    await logout()
    setShowLogoutModal(false)
  }

  return <header className="navbar">
    <NavLink to="/dashboard" className="brand">
      <span className="brand-mark">MT</span>
      <span>Machine Task</span>
    </NavLink>
    <nav>
      <NavLink to="/dashboard">Overview</NavLink>
      <NavLink to="/posts">Posts</NavLink>
      <NavLink to="/analytics">Analytics</NavLink>{user?.role === 'admin' && <NavLink to="/users">Users</NavLink>}</nav>
    <div className="account">
      <span>{user?.email}</span>
      <button className="ghost-button cursor-pointer" onClick={() => setShowLogoutModal(true)}>Sign out</button>
    </div>
    {showLogoutModal && <ConfirmModal title="Sign out of your account?" message="Your current session will end on this device." confirmLabel="Sign out" onConfirm={confirmLogout} onCancel={() => setShowLogoutModal(false)} />}
  </header>
}
