import { useState, useEffect } from 'react'
import './App.css'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'

function App() {
  const [favoriteNumber, setFavoriteNumber] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [newNumber, setNewNumber] = useState('')
  const [updating, setUpdating] = useState(false)
  
  // Authentication state
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  useEffect(() => {
    const fetchFavoriteNumber = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
        const response = await fetch(`${apiUrl}/api/v1/ryan/favorite_number`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch favorite number')
        }
        
        const data = await response.json()
        setFavoriteNumber(data.favorite_number)
        setLastUpdated(data.last_updated)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchFavoriteNumber()
  }, [])

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
          const response = await fetch(`${apiUrl}/api/v1/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          if (response.ok) {
            const data = await response.json()
            setUser(data.user)
          } else {
            localStorage.removeItem('auth_token')
          }
        } catch (err) {
          localStorage.removeItem('auth_token')
        }
      }
      setAuthLoading(false)
    }
    
    checkAuth()
  }, [])

  const updateFavoriteNumber = async (e) => {
    e.preventDefault()
    
    if (!newNumber || isNaN(newNumber) || parseInt(newNumber) <= 0) {
      setError('Please enter a valid positive number')
      return
    }

    setUpdating(true)
    setError(null)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const response = await fetch(`${apiUrl}/api/v1/ryan/favorite_number`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ favorite_number: parseInt(newNumber) })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update favorite number')
      }

      const data = await response.json()
      setFavoriteNumber(data.favorite_number)
      setLastUpdated(data.last_updated)
      setNewNumber('')
      setUpdating(false)
    } catch (err) {
      setError(err.message)
      setUpdating(false)
    }
  }

  const handleLogin = async (credentials) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Login failed')
    }

    localStorage.setItem('auth_token', data.token)
    setUser(data.user)
    setShowLogin(false)
  }

  const handleSignup = async (userData) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    const response = await fetch(`${apiUrl}/api/v1/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: userData })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.details ? data.details.join(', ') : data.error || 'Signup failed')
    }

    localStorage.setItem('auth_token', data.token)
    setUser(data.user)
    setShowSignup(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  if (authLoading) {
    return (
      <div className="App">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  return (
    <div className="App">
      <div className="top-nav">
        <div className="nav-left">
          <h1>CrdMrkt</h1>
        </div>
        <div className="nav-right">
          {user ? (
            <div className="user-menu">
              <span className="welcome-text">Welcome, {user.first_name}!</span>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="login-button" onClick={() => setShowLogin(true)}>
              Log In
            </button>
          )}
        </div>
      </div>
      
      <header className="App-header">
        <h1>Hello HOMIES!</h1>
        <p>Welcome to CrdMrkt</p>
        
        <div className="api-section">
          <h2>Backend API + MongoDB Test</h2>
          {loading && <p>Loading Ryan's favorite number...</p>}
          {error && <p className="error">Error: {error}</p>}
          {favoriteNumber !== null && (
            <div className="favorite-number">
              <p>🎉 Ryan's favorite number is: <strong>{favoriteNumber}</strong></p>
              {lastUpdated && (
                <p className="last-updated">
                  Last updated: {new Date(lastUpdated).toLocaleString()}
                </p>
              )}
            </div>
          )}
          
          <div className="update-section">
            <h3>Update Favorite Number</h3>
            <form onSubmit={updateFavoriteNumber}>
              <input
                type="number"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                placeholder="Enter a new favorite number"
                min="1"
                disabled={updating}
              />
              <button type="submit" disabled={updating || !newNumber}>
                {updating ? 'Updating...' : 'Update Number'}
              </button>
            </form>
          </div>
        </div>
        
        <p>
          This React app is now connected to a Ruby on Rails backend with MongoDB!
        </p>
      </header>
      
      {showLogin && (
        <LoginForm
          onLogin={handleLogin}
          onSwitchToSignup={() => {
            setShowLogin(false)
            setShowSignup(true)
          }}
          onClose={() => setShowLogin(false)}
        />
      )}
      
      {showSignup && (
        <SignupForm
          onSignup={handleSignup}
          onSwitchToLogin={() => {
            setShowSignup(false)
            setShowLogin(true)
          }}
          onClose={() => setShowSignup(false)}
        />
      )}
    </div>
  )
}

export default App
