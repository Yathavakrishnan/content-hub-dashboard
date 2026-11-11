import { createContext, useContext, useState, type ReactNode } from 'react'
import api from '../services/api'

type User = { sub: number; email: string; role: string }
type AuthContextValue = { user: User | null; token: string | null; login: (email: string, password: string) => Promise<void>; register: (name: string, email: string, password: string) => Promise<void>; logout: () => void }

const AuthContext = createContext<AuthContextValue | null>(null)

function decodeUser(token: string): User {
  return JSON.parse(atob(token.split('.')[1])) as User
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem('access_token'))
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('access_token')
    return saved ? decodeUser(saved) : null
  })

  async function login(email: string, password: string) {
    const response = await api.post<{ access_token: string }>('/auth/login', { email, password })
    localStorage.setItem('access_token', response.data.access_token)
    setToken(response.data.access_token)
    setUser(decodeUser(response.data.access_token))
  }

  async function register(name: string, email: string, password: string) {
    await api.post('/auth/register', { name, email, password })
    await login(email, password)
  }

  async function logout() {
    const currentToken = localStorage.getItem('access_token')
    if (currentToken) {
      await api.post('/auth/logout', {}, {
        headers: { Authorization: `Bearer ${currentToken}` },
      }).catch(() => undefined)
    }
    localStorage.removeItem('access_token')
    setToken(null)
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, token, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
