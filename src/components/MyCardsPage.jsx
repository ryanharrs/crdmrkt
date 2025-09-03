import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { theme } from '../design-system/theme'
import Button from '../design-system/components/Button'

const MyCardsPage = () => {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // 'all', 'for_sale', 'sold'

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
  const token = localStorage.getItem('auth_token')

  const containerStyles = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: theme.spacing[6],
    minHeight: '100vh'
  }

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[6]
  }

  const titleStyles = {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral[900],
    margin: 0
  }

  const filterContainerStyles = {
    display: 'flex',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[6]
  }

  const filterButtonStyles = (isActive) => ({
    padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${isActive ? theme.colors.primary[500] : theme.colors.neutral[300]}`,
    backgroundColor: isActive ? theme.colors.primary[50] : theme.colors.white,
    color: isActive ? theme.colors.primary[700] : theme.colors.neutral[700],
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    cursor: 'pointer',
    transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.easeInOut}`
  })

  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: theme.spacing[6],
    marginTop: theme.spacing[6]
  }

  const cardStyles = {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    border: `1px solid ${theme.colors.neutral[200]}`,
    boxShadow: theme.shadows.sm,
    transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.easeInOut}`,
    cursor: 'pointer'
  }

  const cardHoverStyles = {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows.lg
  }

  const imageContainerStyles = {
    position: 'relative',
    backgroundColor: theme.colors.neutral[50],
    aspectRatio: '1',
    overflow: 'hidden'
  }

  const imageStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }

  const statusBadgeStyles = (forSale) => ({
    position: 'absolute',
    top: theme.spacing[2],
    right: theme.spacing[2],
    padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
    borderRadius: theme.borderRadius.full,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    backgroundColor: forSale ? theme.colors.success[500] : theme.colors.neutral[500],
    color: theme.colors.white
  })

  const contentStyles = {
    padding: theme.spacing[4]
  }

  const nameStyles = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing[1]
  }

  const detailsStyles = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    marginBottom: theme.spacing[3]
  }

  const priceStyles = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary[600],
    marginBottom: theme.spacing[3]
  }

  const actionsStyles = {
    display: 'flex',
    gap: theme.spacing[2]
  }

  const loadingStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.neutral[600]
  }

  const errorStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.error[600],
    backgroundColor: theme.colors.error[50],
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.error[200]}`,
    padding: theme.spacing[6]
  }

  const emptyStateStyles = {
    textAlign: 'center',
    padding: theme.spacing[12],
    color: theme.colors.neutral[600]
  }

  const emptyStateIconStyles = {
    fontSize: theme.typography.fontSize['4xl'],
    marginBottom: theme.spacing[4]
  }

  useEffect(() => {
    fetchMyCards()
  }, [])

  const fetchMyCards = async () => {
    if (!token) {
      setError('You must be logged in to view your cards.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`${apiUrl}/api/v1/cards/my_cards`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch your cards')
      }

      const data = await response.json()
      setCards(data.cards)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleSale = async (cardId, currentStatus) => {
    try {
      let askingPrice = null
      
      if (!currentStatus) {
        // Listing for sale - ask for price
        const price = prompt('Enter asking price (e.g., 25.99):')
        if (price === null) return // User cancelled
        
        askingPrice = parseFloat(price)
        if (isNaN(askingPrice) || askingPrice <= 0) {
          alert('Please enter a valid price')
          return
        }
      }

      const response = await fetch(`${apiUrl}/api/v1/cards/${cardId}/toggle_sale`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          asking_price: askingPrice
        })
      })

      if (response.ok) {
        fetchMyCards() // Refresh the cards list
      } else {
        throw new Error('Failed to update sale status')
      }
    } catch (err) {
      alert('Error updating sale status: ' + err.message)
    }
  }

  const formatPrice = (price) => {
    if (!price) return 'Price on request'
    return `$${parseFloat(price).toFixed(2)}`
  }

  const filteredCards = cards.filter(card => {
    if (filter === 'for_sale') return card.for_sale
    if (filter === 'sold') return !card.for_sale
    return true // 'all'
  })

  const getCardCounts = () => {
    const total = cards.length
    const forSale = cards.filter(card => card.for_sale).length
    const sold = cards.filter(card => !card.for_sale).length
    return { total, forSale, sold }
  }

  const counts = getCardCounts()

  if (loading) {
    return (
      <div style={containerStyles}>
        <div style={loadingStyles}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ animation: 'spin 1s linear infinite', marginRight: theme.spacing[3] }}>
            <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"/>
          </svg>
          Loading your cards...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={containerStyles}>
        <div style={errorStyles}>
          Error loading cards: {error}
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyles}>
      {/* Header */}
      <div style={headerStyles}>
        <h1 style={titleStyles}>My Cards</h1>
        <Button variant="primary" onClick={() => window.location.href = '/upload-cards'}>
          Upload New Card
        </Button>
      </div>

      {/* Filters */}
      <div style={filterContainerStyles}>
        <button
          style={filterButtonStyles(filter === 'all')}
          onClick={() => setFilter('all')}
        >
          All Cards ({counts.total})
        </button>
        <button
          style={filterButtonStyles(filter === 'for_sale')}
          onClick={() => setFilter('for_sale')}
        >
          For Sale ({counts.forSale})
        </button>
        <button
          style={filterButtonStyles(filter === 'sold')}
          onClick={() => setFilter('sold')}
        >
          Sold ({counts.sold})
        </button>
      </div>

      {/* Cards Grid */}
      {filteredCards.length === 0 ? (
        <div style={emptyStateStyles}>
          <div style={emptyStateIconStyles}>📦</div>
          <h3 style={{ fontSize: theme.typography.fontSize.xl, marginBottom: theme.spacing[2] }}>
            {filter === 'all' 
              ? 'No cards yet' 
              : filter === 'for_sale' 
                ? 'No cards for sale'
                : 'No sold cards'
            }
          </h3>
          <p style={{ marginBottom: theme.spacing[4] }}>
            {filter === 'all' 
              ? 'Upload your first card to get started!' 
              : filter === 'for_sale' 
                ? 'Mark some cards as for sale to see them here.'
                : 'Sold cards will appear here once you make your first sale.'
            }
          </p>
          {filter === 'all' && (
            <Button variant="primary" onClick={() => window.location.href = '/upload-cards'}>
              Upload Your First Card
            </Button>
          )}
        </div>
      ) : (
        <div style={gridStyles}>
          {filteredCards.map((card) => (
            <div
              key={card.id}
              style={cardStyles}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, cardHoverStyles)
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, cardStyles)
              }}
            >
              {/* Image */}
              <div style={imageContainerStyles}>
                <img
                  src={card.front_image_medium_url || card.front_image_url}
                  alt={`${card.player_name} ${card.year} ${card.set_name}`}
                  style={imageStyles}
                />
                <div style={statusBadgeStyles(card.for_sale)}>
                  {card.for_sale ? 'FOR SALE' : 'SOLD'}
                </div>
              </div>

              {/* Content */}
              <div style={contentStyles}>
                <h3 style={nameStyles}>{card.player_name}</h3>
                <p style={detailsStyles}>
                  {card.year} {card.manufacturer} {card.set_name} #{card.card_number}
                </p>

                {card.for_sale && card.asking_price && (
                  <div style={priceStyles}>
                    {formatPrice(card.asking_price)}
                  </div>
                )}

                {/* Actions */}
                <div style={actionsStyles}>
                  <Link to={`/edit-card/${card.id}`}>
                    <Button variant="secondary" size="sm">
                      Edit Card
                    </Button>
                  </Link>
                  <Button
                    variant={card.for_sale ? "outline" : "primary"}
                    size="sm"
                    onClick={() => handleToggleSale(card.id, card.for_sale)}
                  >
                    {card.for_sale ? 'Remove from Sale' : 'List for Sale'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyCardsPage
