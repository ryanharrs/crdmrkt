import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [favoriteNumber, setFavoriteNumber] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchFavoriteNumber()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello HOMIES!</h1>
        <p>Welcome to CrdMrkt</p>
        
        <div className="api-section">
          <h2>Backend API Test</h2>
          {loading && <p>Loading Ryan's favorite number...</p>}
          {error && <p className="error">Error: {error}</p>}
          {favoriteNumber !== null && (
            <div className="favorite-number">
              <p>🎉 Ryan's favorite number is: <strong>{favoriteNumber}</strong></p>
            </div>
          )}
        </div>
        
        <p>
          This React app is now connected to a Ruby on Rails backend with MongoDB!
        </p>
      </header>
    </div>
  )
}

export default App
