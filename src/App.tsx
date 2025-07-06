import React, { useState, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom'
import { ApiService, mockCaseResults, CaseSearchResult } from './utils/api'
import Register from './Register'
import './App.css'

// Simple Context for Auth
const AuthContext = createContext<any>(null)

const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const login = async (email: string, password: string) => {
    console.log('🔄 Attempting login for:', email)
    try {
      // Try real backend API first
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      
      console.log('📡 Backend response status:', response.status)
      const data = await response.json()
      console.log('📦 Backend response data:', data)
      
      if (data.success) {
        localStorage.setItem('lexiai_token', data.token)
        const userData = { 
          name: `${data.firstName} ${data.lastName}`, 
          email: data.email, 
          firm: data.firmName 
        }
        console.log('👤 Setting user data:', userData)
        setUser(userData)
        setIsAuthenticated(true)
        console.log('✅ Authentication state updated successfully')
        return
      } else {
        console.error('❌ Backend login failed:', data.message)
        throw new Error(data.message || 'Login failed')
      }
    } catch (error) {
      // Fallback to mock login for development
      console.log('🔄 Backend login failed, trying mock login:', error)
      if (email === 'demo@lawfirm.com' && password === 'demo123') {
        const userData = { name: 'Demo User', email, firm: 'Demo Law Firm' }
        console.log('👤 Setting mock user data:', userData)
        setUser(userData)
        setIsAuthenticated(true)
        console.log('✅ Mock authentication successful')
      } else {
        console.error('❌ Invalid credentials for mock login')
        throw new Error('Invalid credentials')
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('lexiai_token')
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Components
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
}

const Layout: React.FC = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="logo">
          <span className="logo-icon">⚖️</span>
          <span className="logo-text">LexiAI</span>
        </div>
        <ul className="nav-links">
          <li><Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>📊 Dashboard</Link></li>
          <li><Link to="/research" className={location.pathname === '/research' ? 'active' : ''}>🔍 Research</Link></li>
          <li><Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>👤 Profile</Link></li>
        </ul>
      </nav>
      <div className="main-content">
        <header className="header">
          <h1>Legal Case Research Platform</h1>
          <div className="user-menu">
            <span>Welcome, {user?.name}</span>
            <button onClick={logout} className="btn-logout">Logout</button>
          </div>
        </header>
        <main className="content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/research" element={<Research />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

const Login: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await login(email, password)
      console.log('✅ Login successful, navigating to dashboard')
      navigate('/dashboard')
    } catch (err: any) {
      console.error('❌ Login failed:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (showRegister) {
    return <Register onBackToLogin={() => setShowRegister(false)} />
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo-large">⚖️</div>
          <h1>LexiAI</h1>
          <p>Legal Case Research Platform</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error">{error}</div>}
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <div className="demo-info">
            <p><strong>Demo:</strong> demo@lawfirm.com / demo123</p>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              Don't have an account?{' '}
              <button 
                type="button" 
                onClick={() => setShowRegister(true)} 
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1976d2',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Create Account
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">342</div>
          <div className="stat-label">Total Searches</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">156</div>
          <div className="stat-label">Cases Reviewed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">89</div>
          <div className="stat-label">Saved Cases</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">24</div>
          <div className="stat-label">Research Sessions</div>
        </div>
      </div>
      
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span>🔍</span>
            <div>
              <div className="activity-title">Contract Dispute Research</div>
              <div className="activity-time">2 hours ago</div>
            </div>
          </div>
          <div className="activity-item">
            <span>📄</span>
            <div>
              <div className="activity-title">Smith v. Johnson Case</div>
              <div className="activity-time">5 hours ago</div>
            </div>
          </div>
          <div className="activity-item">
            <span>⭐</span>
            <div>
              <div className="activity-title">Saved Corporate Law Case</div>
              <div className="activity-time">1 day ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Research: React.FC = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CaseSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isUsingMockData, setIsUsingMockData] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    
    setLoading(true)
    setError('')
    setIsUsingMockData(false)
    
    try {
      // Try to fetch from backend API first
      const data = await ApiService.searchCases(query)
      setResults(data)
      console.log('✅ Connected to backend API')
    } catch (err) {
      console.log('⚠️ Backend not available, using mock data')
      setIsUsingMockData(true)
      // Fallback to mock data if backend is not available
      setTimeout(() => {
        const filteredResults = mockCaseResults.filter(result => 
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.summary.toLowerCase().includes(query.toLowerCase()) ||
          result.court.toLowerCase().includes(query.toLowerCase())
        )
        setResults(filteredResults.length > 0 ? filteredResults : mockCaseResults)
        setLoading(false)
      }, 500)
      return
    }
    
    setLoading(false)
  }

  return (
    <div className="research">
      <h2>Case Research</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter your legal query (e.g., 'breach of contract manufacturing')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading} className="btn-primary">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      {error && (
        <div className="error" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      
      {isUsingMockData && results.length > 0 && (
        <div style={{ 
          background: '#fef3c7', 
          color: '#92400e', 
          padding: '0.75rem', 
          borderRadius: '0.5rem', 
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          ⚠️ Using demo data - backend API not available at localhost:8080
        </div>
      )}

      {results.length > 0 && (
        <div className="search-results">
          <h3>Search Results</h3>
          {results.map(result => (
            <div key={result.id} className="result-card">
              <div className="result-header">
                <h4>{result.title}</h4>
                <div className="relevance">Relevance: {result.relevance}%</div>
              </div>
              <div className="result-meta">
                <span>{result.court}</span> • <span>{result.date}</span>
                {result.citation && (
                  <>
                    <br />
                    <strong>Citation:</strong> {result.citation}
                  </>
                )}
              </div>
              <p>{result.summary}</p>
              {result.tags && result.tags.length > 0 && (
                <div style={{ margin: '1rem 0' }}>
                  {result.tags.map(tag => (
                    <span key={tag} style={{
                      background: '#dbeafe',
                      color: '#1d4ed8',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      marginRight: '0.5rem',
                      marginBottom: '0.25rem',
                      display: 'inline-block'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="result-actions">
                <button className="btn-secondary">View Details</button>
                <button className="btn-secondary">Save Case</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const Profile: React.FC = () => {
  const { user } = useAuth()
  
  return (
    <div className="profile">
      <h2>Profile</h2>
      <div className="profile-card">
        <div className="profile-avatar">👤</div>
        <div className="profile-info">
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
          <p>{user?.firm}</p>
        </div>
      </div>
      
      <div className="profile-stats">
        <h3>Account Statistics</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">342</div>
            <div className="stat-label">Total Searches</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">89</div>
            <div className="stat-label">Saved Cases</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/*" element={<ProtectedRoute />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
