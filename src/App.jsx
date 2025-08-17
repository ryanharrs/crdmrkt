import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [favoriteNumber, setFavoriteNumber] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [newNumber, setNewNumber] = useState('')
  const [updating, setUpdating] = useState(false)

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

  return (
    <div className="App">
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
    </div>
  )
}

export default App
