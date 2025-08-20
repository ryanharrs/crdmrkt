import { useState, useEffect } from 'react'
import './App.css'
import './design-system/global.css'
import { Button, Input, Navigation, CardUploadModal } from './design-system'
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
  const [showCardUpload, setShowCardUpload] = useState(false)

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

  const handleCardUpload = async (cardData, addAnother = false) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    const token = localStorage.getItem('auth_token')
    
    // Create FormData for file upload
    const formData = new FormData()
    
    // Add all text fields to FormData
    Object.keys(cardData).forEach(key => {
      if (key === 'front_image' || key === 'back_image') {
        if (cardData[key]) {
          formData.append(`card[${key}]`, cardData[key])
        }
      } else if (cardData[key] !== null && cardData[key] !== undefined && cardData[key] !== '') {
        formData.append(`card[${key}]`, cardData[key])
      }
    })

    const response = await fetch(`${apiUrl}/api/v1/cards`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to upload card')
    }

    // If not adding another, close the modal
    if (!addAnother) {
      setShowCardUpload(false)
    }

    return data
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
      <Navigation 
        user={user}
        onLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
        onUploadCards={() => setShowCardUpload(true)}
      />
      
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
            <form onSubmit={updateFavoriteNumber} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
              <Input
                type="number"
                label="New Favorite Number"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                placeholder="Enter a new favorite number"
                min="1"
                disabled={updating}
                style={{ flex: 1 }}
              />
              <Button 
                type="submit" 
                variant="primary"
                disabled={updating || !newNumber}
                loading={updating}
                style={{ marginBottom: '1rem' }}
              >
                Update Number
              </Button>
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

      {showCardUpload && (
        <CardUploadModal
          isOpen={showCardUpload}
          onClose={() => setShowCardUpload(false)}
          onSubmit={handleCardUpload}
        />
      )}
    </div>
  )
}

export default App
