import { useState } from 'react'
import { theme } from '../theme'

const Card = ({ 
  card,
  onClick,
  showPrice = true,
  showOwner = false,
  size = 'md',
  className = '',
  ...props 
}) => {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const getSizeStyles = () => {
    const sizes = {
      sm: {
        width: '200px',
        height: '280px'
      },
      md: {
        width: '250px',
        height: '350px'
      },
      lg: {
        width: '300px',
        height: '420px'
      }
    }
    return sizes[size] || sizes.md
  }

  const cardStyles = {
    ...getSizeStyles(),
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.neutral[200]}`,
    overflow: 'hidden',
    cursor: onClick ? 'pointer' : 'default',
    transition: `all ${theme.animation.duration.normal} ${theme.animation.easing.easeOut}`,
    boxShadow: isHovered ? theme.shadows.lg : theme.shadows.base,
    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
    display: 'flex',
    flexDirection: 'column'
  }

  const imageContainerStyles = {
    position: 'relative',
    flex: '1',
    backgroundColor: theme.colors.neutral[50],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const imageStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: imageLoading || imageError ? 'none' : 'block'
  }

  const placeholderStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    color: theme.colors.neutral[400],
    fontSize: theme.typography.fontSize.sm,
    textAlign: 'center',
    padding: theme.spacing[4]
  }

  const contentStyles = {
    padding: theme.spacing[4],
    borderTop: `1px solid ${theme.colors.neutral[100]}`
  }

  const playerNameStyles = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing[2],
    fontFamily: theme.typography.fontFamily.sans.join(', '),
    lineHeight: theme.typography.lineHeight.tight
  }

  const cardDetailsStyles = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    marginBottom: theme.spacing[3],
    fontFamily: theme.typography.fontFamily.sans.join(', '),
    lineHeight: theme.typography.lineHeight.normal
  }

  const priceStyles = {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary[600],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const badgeContainerStyles = {
    position: 'absolute',
    top: theme.spacing[3],
    left: theme.spacing[3],
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[2]
  }

  const badgeStyles = {
    backgroundColor: theme.colors.primary[500],
    color: theme.colors.white,
    padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
    borderRadius: theme.borderRadius.base,
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

  const ownerStyles = {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral[500],
    marginTop: theme.spacing[2],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  const handleClick = () => {
    if (onClick) {
      onClick(card)
    }
  }

  const formatPrice = (price) => {
    if (!price) return 'Price on request'
    return `$${parseFloat(price).toFixed(2)}`
  }

  const getImageUrl = () => {
    // Prefer thumbnail for gallery display
    return card.front_image_thumbnail_url || card.front_image_medium_url || card.front_image_url
  }

  return (
    <div 
      style={cardStyles}
      className={className}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <div style={imageContainerStyles}>
        {getImageUrl() && !imageError ? (
          <img
            src={getImageUrl()}
            alt={`${card.player_name} ${card.year} ${card.set_name} #${card.card_number}`}
            style={imageStyles}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : null}
        
        {(imageLoading || imageError) && (
          <div style={placeholderStyles}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
            </svg>
            <div style={{ marginTop: theme.spacing[2] }}>
              {imageLoading ? 'Loading...' : 'No image'}
            </div>
          </div>
        )}

        {/* Badges */}
        <div style={badgeContainerStyles}>
          {card.rookie_card && (
            <div style={rookieBadgeStyles}>ROOKIE</div>
          )}
          {card.graded && (
            <div style={gradedBadgeStyles}>
              {card.grading_company} {card.grade}
            </div>
          )}
          {card.autographed && (
            <div style={badgeStyles}>AUTO</div>
          )}
        </div>
      </div>
      
      <div style={contentStyles}>
        <div style={playerNameStyles}>
          {card.player_name}
        </div>
        
        <div style={cardDetailsStyles}>
          {card.year} {card.manufacturer} {card.set_name}
          <br />
          #{card.card_number}
          {card.team && ` • ${card.team}`}
        </div>
        
        {showPrice && card.for_sale && (
          <div style={priceStyles}>
            {formatPrice(card.asking_price)}
            {card.price_negotiable && (
              <span style={{ 
                fontSize: theme.typography.fontSize.xs, 
                color: theme.colors.neutral[500],
                fontWeight: theme.typography.fontWeight.normal,
                marginLeft: theme.spacing[2]
              }}>
                OBO
              </span>
            )}
          </div>
        )}
        
        {showOwner && card.owner && (
          <div style={ownerStyles}>
            Listed by {card.owner.first_name} {card.owner.last_name}
          </div>
        )}
      </div>
    </div>
  )
}

export default Card
