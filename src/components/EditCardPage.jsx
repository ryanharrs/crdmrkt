import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { theme } from '../design-system/theme'
import { Button, Input } from '../design-system'

const EditCardPage = () => {
  const { cardId } = useParams()
  const navigate = useNavigate()
  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [editData, setEditData] = useState({})
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
  const token = localStorage.getItem('auth_token')
  const currentUser = token ? JSON.parse(localStorage.getItem('user') || '{}') : null

  const containerStyles = {
    maxWidth: '800px',
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
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral[900],
    margin: 0
  }

  const contentStyles = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '300px 1fr',
    gap: isMobile ? theme.spacing[6] : theme.spacing[8],
    alignItems: 'start'
  }

  const imageContainerStyles = {
    position: 'relative',
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    border: `1px solid ${theme.colors.neutral[200]}`,
    aspectRatio: '1'
  }

  const imageStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  }

  const formStyles = {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[6],
    border: `1px solid ${theme.colors.neutral[200]}`,
    boxShadow: theme.shadows.sm
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

  const formGridStyles = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing[4],
    marginBottom: theme.spacing[4]
  }

  const fullWidthStyles = {
    gridColumn: '1 / -1'
  }

  const checkboxContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[3]
  }

  const checkboxStyles = {
    width: '16px',
    height: '16px',
    accentColor: theme.colors.primary[500]
  }

  const checkboxLabelStyles = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[700],
    fontWeight: theme.typography.fontWeight.medium
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

  const buttonGroupStyles = {
    display: 'flex',
    gap: theme.spacing[3],
    justifyContent: 'flex-end',
    paddingTop: theme.spacing[6],
    borderTop: `1px solid ${theme.colors.neutral[200]}`
  }

  const saleManagementStyles = {
    backgroundColor: theme.colors.primary[50],
    border: `1px solid ${theme.colors.primary[200]}`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[6]
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

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchCard = async () => {
      if (!token) {
        setError('You must be logged in to edit cards.')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`${apiUrl}/api/v1/cards/${cardId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Card not found')
        }
        
        const data = await response.json()
        
        // Check if user owns this card
        if (data.card.owner_id !== currentUser.id) {
          setError('You can only edit cards that you own.')
          setLoading(false)
          return
        }
        
        setCard(data.card)
        setEditData(data.card)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (cardId) {
      fetchCard()
    }
  }, [cardId, currentUser?.id, token])

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCheckboxChange = (field, checked) => {
    setEditData(prev => ({
      ...prev,
      [field]: checked
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch(`${apiUrl}/api/v1/cards/${cardId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ card: editData })
      })

      if (!response.ok) {
        throw new Error('Failed to update card')
      }

      const data = await response.json()
      setCard(data.card)
      setEditData(data.card)
      alert('Card updated successfully!')
    } catch (err) {
      alert('Error updating card: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleToggleSale = async () => {
    try {
      let askingPrice = null
      
      if (!card.for_sale) {
        const price = prompt('Enter asking price (e.g., 25.99):')
        if (price === null) return
        
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
        body: JSON.stringify({ asking_price: askingPrice })
      })

      if (response.ok) {
        const data = await response.json()
        setCard(data.card)
        setEditData(data.card)
      } else {
        throw new Error('Failed to update sale status')
      }
    } catch (err) {
      alert('Error updating sale status: ' + err.message)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`${apiUrl}/api/v1/cards/${cardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('Card deleted successfully!')
        navigate('/my-cards')
      } else {
        throw new Error('Failed to delete card')
      }
    } catch (err) {
      alert('Error deleting card: ' + err.message)
    }
  }

  const formatPrice = (price) => {
    if (!price) return 'Not set'
    return `$${parseFloat(price).toFixed(2)}`
  }

  if (loading) {
    return (
      <div style={containerStyles}>
        <div style={loadingStyles}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ animation: 'spin 1s linear infinite', marginRight: theme.spacing[3] }}>
            <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"/>
          </svg>
          Loading card...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={containerStyles}>
        <div style={errorStyles}>
          {error}
          <div style={{ marginTop: theme.spacing[4] }}>
            <Button variant="secondary" onClick={() => navigate('/my-cards')}>
              Back to My Cards
            </Button>
          </div>
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
        <h1 style={titleStyles}>Edit Card</h1>
        <Button variant="secondary" onClick={() => navigate('/my-cards')}>
          ← Back to My Cards
        </Button>
      </div>

      {/* Content */}
      <div style={contentStyles}>
        {/* Image */}
        <div style={imageContainerStyles}>
          <img
            src={card.front_image_large_url || card.front_image_url}
            alt={`${card.player_name} ${card.year} ${card.set_name} #${card.card_number}`}
            style={imageStyles}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300/f3f4f6/6b7280?text=No+Image+Available'
            }}
          />
        </div>

        {/* Edit Form */}
        <div style={formStyles}>
          {/* Sale Status */}
          <div style={saleManagementStyles}>
            <div style={statusBadgeStyles(card.for_sale)}>
              {card.for_sale ? 'FOR SALE' : 'NOT FOR SALE'}
            </div>
            {card.for_sale && card.asking_price && (
              <div style={{ fontSize: theme.typography.fontSize.lg, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.primary[600], marginBottom: theme.spacing[3] }}>
                {formatPrice(card.asking_price)}
              </div>
            )}
            <Button 
              variant={card.for_sale ? "outline" : "primary"} 
              onClick={handleToggleSale}
              size="sm"
            >
              {card.for_sale ? 'Remove from Sale' : 'List for Sale'}
            </Button>
          </div>

          {/* Basic Information */}
          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>Basic Information</h3>
            <div style={formGridStyles}>
              <Input
                label="Player Name"
                value={editData.player_name || ''}
                onChange={(e) => handleInputChange('player_name', e.target.value)}
                required
              />
              <Input
                label="Team"
                value={editData.team || ''}
                onChange={(e) => handleInputChange('team', e.target.value)}
              />
              <Input
                label="Position"
                value={editData.position || ''}
                onChange={(e) => handleInputChange('position', e.target.value)}
              />
              <Input
                label="Jersey Number"
                type="number"
                value={editData.jersey_number || ''}
                onChange={(e) => handleInputChange('jersey_number', e.target.value)}
              />
            </div>
          </div>

          {/* Card Details */}
          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>Card Details</h3>
            <div style={formGridStyles}>
              <Input
                label="Year"
                type="number"
                value={editData.year || ''}
                onChange={(e) => handleInputChange('year', e.target.value)}
                required
              />
              <Input
                label="Manufacturer"
                value={editData.manufacturer || ''}
                onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                required
              />
              <Input
                label="Set Name"
                value={editData.set_name || ''}
                onChange={(e) => handleInputChange('set_name', e.target.value)}
                required
              />
              <Input
                label="Card Number"
                value={editData.card_number || ''}
                onChange={(e) => handleInputChange('card_number', e.target.value)}
                required
              />
            </div>
            
            <div style={fullWidthStyles}>
              <Input
                label="Condition"
                value={editData.condition || ''}
                onChange={(e) => handleInputChange('condition', e.target.value)}
                placeholder="e.g., Mint, Near Mint, Excellent"
              />
            </div>
          </div>

          {/* Special Features */}
          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>Special Features</h3>
            <div style={checkboxContainerStyles}>
              <input
                type="checkbox"
                id="rookie_card"
                style={checkboxStyles}
                checked={editData.rookie_card || false}
                onChange={(e) => handleCheckboxChange('rookie_card', e.target.checked)}
              />
              <label htmlFor="rookie_card" style={checkboxLabelStyles}>
                Rookie Card
              </label>
            </div>
            
            <div style={checkboxContainerStyles}>
              <input
                type="checkbox"
                id="autographed"
                style={checkboxStyles}
                checked={editData.autographed || false}
                onChange={(e) => handleCheckboxChange('autographed', e.target.checked)}
              />
              <label htmlFor="autographed" style={checkboxLabelStyles}>
                Autographed
              </label>
            </div>
            
            <div style={checkboxContainerStyles}>
              <input
                type="checkbox"
                id="memorabilia"
                style={checkboxStyles}
                checked={editData.memorabilia || false}
                onChange={(e) => handleCheckboxChange('memorabilia', e.target.checked)}
              />
              <label htmlFor="memorabilia" style={checkboxLabelStyles}>
                Memorabilia
              </label>
            </div>

            <div style={checkboxContainerStyles}>
              <input
                type="checkbox"
                id="graded"
                style={checkboxStyles}
                checked={editData.graded || false}
                onChange={(e) => handleCheckboxChange('graded', e.target.checked)}
              />
              <label htmlFor="graded" style={checkboxLabelStyles}>
                Graded
              </label>
            </div>

            {editData.graded && (
              <div style={formGridStyles}>
                <Input
                  label="Grading Company"
                  value={editData.grading_company || ''}
                  onChange={(e) => handleInputChange('grading_company', e.target.value)}
                  placeholder="e.g., PSA, BGS, SGC"
                />
                <Input
                  label="Grade"
                  value={editData.grade || ''}
                  onChange={(e) => handleInputChange('grade', e.target.value)}
                  placeholder="e.g., 10, 9.5"
                />
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div style={sectionStyles}>
            <h3 style={sectionTitleStyles}>Additional Information</h3>
            <div style={formGridStyles}>
              <Input
                label="Rarity"
                value={editData.rarity || ''}
                onChange={(e) => handleInputChange('rarity', e.target.value)}
                placeholder="e.g., Common, Rare, Ultra Rare"
              />
              <Input
                label="Estimated Value"
                type="number"
                step="0.01"
                value={editData.estimated_value || ''}
                onChange={(e) => handleInputChange('estimated_value', e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={buttonGroupStyles}>
            <Button 
              variant="error" 
              onClick={handleDelete}
              size="sm"
            >
              Delete Card
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSave}
              loading={saving}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditCardPage
