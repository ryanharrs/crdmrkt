import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { theme } from '../design-system/theme'
import { Button, PaymentModal, Input } from '../design-system'

const CardDetailPage = () => {
  const { cardId } = useParams()
  const navigate = useNavigate()
  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
  const token = localStorage.getItem('auth_token')
  const currentUser = token ? JSON.parse(localStorage.getItem('user') || '{}') : null

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

  const contentStyles = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing[8],
    alignItems: 'start',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: theme.spacing[6]
    }
  }

  const imageContainerStyles = {
    position: 'relative',
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    border: `1px solid ${theme.colors.neutral[200]}`,
    aspectRatio: '1'
  }

  const imageStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }

  const detailsStyles = {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing[8],
    border: `1px solid ${theme.colors.neutral[200]}`,
    boxShadow: theme.shadows.base
  }

  const titleStyles = {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing[2]
  }

  const subtitleStyles = {
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.neutral[600],
    marginBottom: theme.spacing[6]
  }

  const statusBadgeStyles = (forSale) => ({
    display: 'inline-block',
    padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
    borderRadius: theme.borderRadius.full,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    backgroundColor: forSale ? theme.colors.success[500] : theme.colors.neutral[500],
    color: theme.colors.white,
    marginBottom: theme.spacing[4]
  })

  const priceStyles = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary[600],
    marginBottom: theme.spacing[6]
  }

  const sectionStyles = {
    marginBottom: theme.spacing[6]
  }

  const sectionTitleStyles = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing[4],
    borderBottom: `1px solid ${theme.colors.neutral[200]}`,
    paddingBottom: theme.spacing[2]
  }

  const fieldRowStyles = {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: theme.spacing[4],
    alignItems: 'center',
    marginBottom: theme.spacing[3],
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.md,
    ':hover': {
      backgroundColor: theme.colors.neutral[25]
    }
  }

  const labelStyles = {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.neutral[700]
  }

  const valueStyles = {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.neutral[900],
    fontWeight: theme.typography.fontWeight.medium
  }

  const editFormStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[4]
  }

  const buttonGroupStyles = {
    display: 'flex',
    gap: theme.spacing[3],
    marginTop: theme.spacing[6]
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
    border: `1px solid ${theme.colors.error[200]}`
  }

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/v1/cards/${cardId}`)
        
        if (!response.ok) {
          throw new Error('Card not found')
        }
        
        const data = await response.json()
        setCard(data.card)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (cardId) {
      fetchCard()
    }
  }, [cardId])

  const handlePurchase = () => {
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = async (paymentIntent) => {
    setShowPaymentModal(false)

    try {
      const response = await fetch(`${apiUrl}/api/v1/cards/${cardId}`)
      
      if (response.ok) {
        const data = await response.json()
        setCard(data.card)
      }
    } catch (error) {
      console.error('Failed to refresh card data:', error)
    }
    
    alert('Payment successful! You now own this card.')
    
    setTimeout(() => {
      navigate('/')
    }, 2000)
  }

  const handlePaymentError = (error) => {
    console.error('Payment error:', error)
  }

  const formatPrice = (price) => {
    if (!price) return 'Price on request'
    return `$${parseFloat(price).toFixed(2)}`
  }

  const renderField = (label, value) => {
    return (
      <div style={fieldRowStyles}>
        <span style={labelStyles}>{label}</span>
        <span style={valueStyles}>{value || 'Not specified'}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={containerStyles}>
        <div style={loadingStyles}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ animation: 'spin 1s linear infinite', marginRight: theme.spacing[3] }}>
            <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"/>
          </svg>
          Loading card details...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={containerStyles}>
        <div style={errorStyles}>
          Error loading card: {error}
        </div>
      </div>
    )
  }

  if (!card) {
    return (
      <div style={containerStyles}>
        <div style={errorStyles}>
          Card not found
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyles}>
      {/* Header */}
      <div style={headerStyles}>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          ← Back
        </Button>

      </div>

      {/* Main Content */}
      <div style={contentStyles}>
        {/* Image Section */}
        <div style={imageContainerStyles}>
          <img
            src={card.front_image_large_url || card.front_image_url}
            alt={`${card.player_name} ${card.year} ${card.set_name} #${card.card_number}`}
            style={imageStyles}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x400/f3f4f6/6b7280?text=No+Image+Available'
            }}
          />
        </div>

        {/* Details Section */}
        <div style={detailsStyles}>
          {/* Title and Status */}
          <h1 style={titleStyles}>{card.player_name}</h1>
          <p style={subtitleStyles}>
            {card.year} {card.manufacturer} {card.set_name} #{card.card_number}
          </p>
          
          <div style={statusBadgeStyles(card.for_sale)}>
            {card.for_sale ? 'FOR SALE' : 'NOT FOR SALE'}
          </div>

          {/* Price */}
          {card.for_sale && card.asking_price && (
            <div style={priceStyles}>
              {formatPrice(card.asking_price)}
              {card.price_negotiable && (
                <span style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.neutral[500], fontWeight: 'normal' }}>
                  {' '}(or best offer)
                </span>
              )}
            </div>
          )}

          {/* Basic Information */}
          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>Basic Information</h3>
            {renderField('Player Name', card.player_name)}
            {renderField('Team', card.team)}
            {renderField('Position', card.position)}
            {renderField('Jersey Number', card.jersey_number)}
          </div>

          {/* Card Details */}
          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>Card Details</h3>
            {renderField('Year', card.year)}
            {renderField('Manufacturer', card.manufacturer)}
            {renderField('Set Name', card.set_name)}
            {renderField('Card Number', card.card_number)}
            {renderField('Condition', card.condition)}
          </div>

          {/* Special Features */}
          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>Special Features</h3>
            <div style={fieldRowStyles}>
              <span style={labelStyles}>Rookie Card</span>
              <span style={valueStyles}>{card.rookie_card ? 'Yes' : 'No'}</span>
            </div>
            <div style={fieldRowStyles}>
              <span style={labelStyles}>Autographed</span>
              <span style={valueStyles}>{card.autographed ? 'Yes' : 'No'}</span>
            </div>
            <div style={fieldRowStyles}>
              <span style={labelStyles}>Memorabilia</span>
              <span style={valueStyles}>{card.memorabilia ? 'Yes' : 'No'}</span>
            </div>
            {card.graded && (
              <>
                <div style={fieldRowStyles}>
                  <span style={labelStyles}>Grading Company</span>
                  <span style={valueStyles}>{card.grading_company}</span>
                </div>
                <div style={fieldRowStyles}>
                  <span style={labelStyles}>Grade</span>
                  <span style={valueStyles}>{card.grade}</span>
                </div>
              </>
            )}
          </div>

          {/* Owner Information */}
          {card.owner && (
            <div style={sectionStyles}>
              <h3 style={sectionTitleStyles}>Owner</h3>
              <div style={fieldRowStyles}>
                <span style={labelStyles}>Seller</span>
                <span style={valueStyles}>{card.owner.full_name}</span>
              </div>
            </div>
          )}

          {/* Purchase Button */}
          {card.for_sale && (
            <div style={buttonGroupStyles}>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handlePurchase}
                style={{ flex: 1 }}
              >
                Purchase Card - {formatPrice(card.asking_price)}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          card={card}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      )}
    </div>
  )
}

export default CardDetailPage