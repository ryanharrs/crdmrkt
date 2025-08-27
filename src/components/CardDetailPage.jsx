import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { theme } from '../design-system/theme'
import { Button } from '../design-system'

const CardDetailPage = () => {
  const { cardId } = useParams()
  const navigate = useNavigate()
  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const containerStyles = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: theme.spacing[6],
    minHeight: '100vh'
  }

  const backButtonStyles = {
    marginBottom: theme.spacing[6]
  }

  const contentStyles = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing[8],
    alignItems: 'start'
  }

  const imageContainerStyles = {
    position: 'relative',
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    border: `1px solid ${theme.colors.neutral[200]}`
  }

  const imageStyles = {
    width: '100%',
    height: 'auto',
    display: 'block'
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
    marginBottom: theme.spacing[2],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const subtitleStyles = {
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.neutral[600],
    marginBottom: theme.spacing[6],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const priceStyles = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary[600],
    marginBottom: theme.spacing[6],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const sectionStyles = {
    marginBottom: theme.spacing[6]
  }

  const sectionTitleStyles = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing[3],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const detailRowStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${theme.spacing[3]} 0`,
    borderBottom: `1px solid ${theme.colors.neutral[100]}`
  }

  const labelStyles = {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.neutral[700],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const valueStyles = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[900],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const badgeContainerStyles = {
    display: 'flex',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[4],
    flexWrap: 'wrap'
  }

  const badgeStyles = {
    backgroundColor: theme.colors.primary[500],
    color: theme.colors.white,
    padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
    borderRadius: theme.borderRadius.full,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const rookieBadgeStyles = {
    ...badgeStyles,
    backgroundColor: theme.colors.warning[500]
  }

  const gradedBadgeStyles = {
    ...badgeStyles,
    backgroundColor: theme.colors.success[500]
  }

  const descriptionStyles = {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.neutral[700],
    lineHeight: theme.typography.lineHeight.relaxed,
    fontFamily: theme.typography.fontFamily.sans.join(', '),
    backgroundColor: theme.colors.neutral[25],
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.neutral[100]}`
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

  const mobileStyles = {
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: theme.spacing[6]
    }
  }

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
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
    // TODO: Implement purchase functionality
    console.log('Purchase card:', card.id)
    alert('Purchase functionality coming soon!')
  }

  const formatPrice = (price) => {
    if (!price) return 'Price on request'
    return `$${parseFloat(price).toFixed(2)}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
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
      {/* Back Button */}
      <div style={backButtonStyles}>
        <Button variant="secondary" onClick={() => navigate('/')}>
          ← Back to Gallery
        </Button>
      </div>

      {/* Main Content */}
      <div style={{ ...contentStyles, ...mobileStyles }}>
        {/* Image Section */}
        <div style={imageContainerStyles}>
          <img
            src={card.front_image_large_url || card.front_image_url}
            alt={`${card.player_name} ${card.year} ${card.set_name} #${card.card_number}`}
            style={imageStyles}
          />
        </div>

        {/* Details Section */}
        <div style={detailsStyles}>
          {/* Title */}
          <h1 style={titleStyles}>{card.player_name}</h1>
          <p style={subtitleStyles}>
            {card.year} {card.manufacturer} {card.set_name} #{card.card_number}
          </p>

          {/* Badges */}
          <div style={badgeContainerStyles}>
            {card.rookie_card && (
              <span style={rookieBadgeStyles}>ROOKIE</span>
            )}
            {card.graded && (
              <span style={gradedBadgeStyles}>
                {card.grading_company} {card.grade}
              </span>
            )}
            {card.autographed && (
              <span style={badgeStyles}>AUTOGRAPHED</span>
            )}
            {card.memorabilia && (
              <span style={badgeStyles}>MEMORABILIA</span>
            )}
          </div>

          {/* Price */}
          {card.for_sale && (
            <div style={priceStyles}>
              {formatPrice(card.asking_price)}
              {card.price_negotiable && (
                <span style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.neutral[500], fontWeight: 'normal' }}>
                  {' '}(or best offer)
                </span>
              )}
            </div>
          )}

          {/* Card Information */}
          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>Card Information</h3>
            
            <div style={detailRowStyles}>
              <span style={labelStyles}>Player</span>
              <span style={valueStyles}>{card.player_name}</span>
            </div>
            
            {card.team && (
              <div style={detailRowStyles}>
                <span style={labelStyles}>Team</span>
                <span style={valueStyles}>{card.team}</span>
              </div>
            )}
            
            {card.position && (
              <div style={detailRowStyles}>
                <span style={labelStyles}>Position</span>
                <span style={valueStyles}>{card.position}</span>
              </div>
            )}
            
            <div style={detailRowStyles}>
              <span style={labelStyles}>Year</span>
              <span style={valueStyles}>{card.year}</span>
            </div>
            
            <div style={detailRowStyles}>
              <span style={labelStyles}>Manufacturer</span>
              <span style={valueStyles}>{card.manufacturer}</span>
            </div>
            
            <div style={detailRowStyles}>
              <span style={labelStyles}>Set</span>
              <span style={valueStyles}>{card.set_name}</span>
            </div>
            
            <div style={detailRowStyles}>
              <span style={labelStyles}>Card Number</span>
              <span style={valueStyles}>#{card.card_number}</span>
            </div>
            
            <div style={detailRowStyles}>
              <span style={labelStyles}>Condition</span>
              <span style={valueStyles}>{card.condition_grade_display}</span>
            </div>
            
            {card.rarity && (
              <div style={detailRowStyles}>
                <span style={labelStyles}>Rarity</span>
                <span style={valueStyles}>{card.rarity}</span>
              </div>
            )}
            
            {card.serial_number && (
              <div style={detailRowStyles}>
                <span style={labelStyles}>Serial Number</span>
                <span style={valueStyles}>{card.serial_number}</span>
              </div>
            )}
          </div>

          {/* Additional Information */}
          {(card.estimated_value || card.memorabilia_type) && (
            <div style={sectionStyles}>
              <h3 style={sectionTitleStyles}>Additional Details</h3>
              
              {card.estimated_value && (
                <div style={detailRowStyles}>
                  <span style={labelStyles}>Estimated Value</span>
                  <span style={valueStyles}>{formatPrice(card.estimated_value)}</span>
                </div>
              )}
              
              {card.memorabilia_type && (
                <div style={detailRowStyles}>
                  <span style={labelStyles}>Memorabilia Type</span>
                  <span style={valueStyles}>{card.memorabilia_type}</span>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {card.description && (
            <div style={sectionStyles}>
              <h3 style={sectionTitleStyles}>Description</h3>
              <div style={descriptionStyles}>
                {card.description}
              </div>
            </div>
          )}

          {/* Purchase Button */}
          {card.for_sale && (
            <div style={{ marginTop: theme.spacing[8] }}>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handlePurchase}
                style={{ width: '100%' }}
              >
                Purchase Card
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CardDetailPage
