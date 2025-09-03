import { useState, useEffect } from 'react'
import { theme } from '../design-system/theme'
import { Button, Input, Modal } from '../design-system'

const DeliveryOptionsPage = () => {
  const [deliveryOptions, setDeliveryOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingOption, setEditingOption] = useState(null)

  const containerStyles = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: theme.spacing[6]
  }

  const headerStyles = {
    marginBottom: theme.spacing[8]
  }

  const titleStyles = {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing[2],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const subtitleStyles = {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.neutral[600],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const optionsListStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[4],
    marginBottom: theme.spacing[6]
  }

  const optionCardStyles = {
    padding: theme.spacing[6],
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.neutral[200]}`,
    boxShadow: theme.shadows.sm
  }

  const optionHeaderStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[3]
  }

  const optionNameStyles = {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.neutral[900],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const optionDetailsStyles = {
    display: 'flex',
    gap: theme.spacing[6],
    alignItems: 'center'
  }

  const optionDetailStyles = {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.neutral[600],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const optionPriceStyles = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary[600],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const actionButtonsStyles = {
    display: 'flex',
    gap: theme.spacing[2]
  }

  const emptyStateStyles = {
    textAlign: 'center',
    padding: theme.spacing[12],
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.neutral[200]}`
  }

  const emptyTitleStyles = {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.neutral[600],
    marginBottom: theme.spacing[2],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const emptyDescriptionStyles = {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.neutral[500],
    marginBottom: theme.spacing[4],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  useEffect(() => {
    fetchDeliveryOptions()
  }, [])

  const fetchDeliveryOptions = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const token = localStorage.getItem('auth_token')
      
      const response = await fetch(`${apiUrl}/api/v1/delivery_options`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch delivery options')
      }

      const data = await response.json()
      setDeliveryOptions(data.delivery_options)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddOption = () => {
    setEditingOption(null)
    setShowAddModal(true)
  }

  const handleEditOption = (option) => {
    setEditingOption(option)
    setShowAddModal(true)
  }

  const handleDeleteOption = async (optionId) => {
    if (!confirm('Are you sure you want to delete this delivery option?')) {
      return
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const token = localStorage.getItem('auth_token')
      
      const response = await fetch(`${apiUrl}/api/v1/delivery_options/${optionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete delivery option')
      }

      // Remove from local state
      setDeliveryOptions(prev => prev.filter(option => option.id !== optionId))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleModalSave = async (optionData) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const token = localStorage.getItem('auth_token')
      
      const url = editingOption 
        ? `${apiUrl}/api/v1/delivery_options/${editingOption.id}`
        : `${apiUrl}/api/v1/delivery_options`
      
      const method = editingOption ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ delivery_option: optionData })
      })

      if (!response.ok) {
        throw new Error(`Failed to ${editingOption ? 'update' : 'create'} delivery option`)
      }

      const data = await response.json()
      
      if (editingOption) {
        // Update existing option
        setDeliveryOptions(prev => 
          prev.map(option => 
            option.id === editingOption.id ? data.delivery_option : option
          )
        )
      } else {
        // Add new option
        setDeliveryOptions(prev => [...prev, data.delivery_option])
      }

      setShowAddModal(false)
      setEditingOption(null)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div style={containerStyles}>
        <div style={{ textAlign: 'center', padding: theme.spacing[12] }}>
          Loading delivery options...
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h1 style={titleStyles}>Delivery Options</h1>
        <p style={subtitleStyles}>
          Set up delivery options for your cards. Buyers will choose from these options when purchasing.
        </p>
      </div>

      {error && (
        <div style={{
          padding: theme.spacing[4],
          backgroundColor: theme.colors.error[50],
          border: `1px solid ${theme.colors.error[200]}`,
          borderRadius: theme.borderRadius.md,
          color: theme.colors.error[700],
          marginBottom: theme.spacing[6]
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing[6] }}>
        <h2 style={{
          fontSize: theme.typography.fontSize['2xl'],
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.neutral[900],
          fontFamily: theme.typography.fontFamily.sans.join(', ')
        }}>
          Your Delivery Options
        </h2>
        
        <Button onClick={handleAddOption} variant="primary">
          Add New Option
        </Button>
      </div>

      {deliveryOptions.length === 0 ? (
        <div style={emptyStateStyles}>
          <h3 style={emptyTitleStyles}>No delivery options yet</h3>
          <p style={emptyDescriptionStyles}>
            Add your first delivery option to let buyers know how you'll ship their cards.
          </p>
          <Button onClick={handleAddOption} variant="primary">
            Add Your First Option
          </Button>
        </div>
      ) : (
        <div style={optionsListStyles}>
          {deliveryOptions.map((option) => (
            <div key={option.id} style={optionCardStyles}>
              <div style={optionHeaderStyles}>
                <div>
                  <h3 style={optionNameStyles}>{option.name}</h3>
                  <div style={optionDetailsStyles}>
                    <span style={optionDetailStyles}>
                      <strong>Duration:</strong> {option.duration}
                    </span>
                    <span style={optionPriceStyles}>
                      {option.formatted_price}
                    </span>
                  </div>
                </div>
                
                <div style={actionButtonsStyles}>
                  <Button 
                    onClick={() => handleEditOption(option)}
                    variant="secondary"
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button 
                    onClick={() => handleDeleteOption(option.id)}
                    variant="danger"
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <DeliveryOptionModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false)
            setEditingOption(null)
          }}
          onSave={handleModalSave}
          editingOption={editingOption}
        />
      )}
    </div>
  )
}

const DeliveryOptionModal = ({ isOpen, onClose, onSave, editingOption }) => {
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    price: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (editingOption) {
      setFormData({
        name: editingOption.name,
        duration: editingOption.duration,
        price: editingOption.price.toString()
      })
    } else {
      setFormData({ name: '', duration: '', price: '' })
    }
  }, [editingOption])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      await onSave({
        name: formData.name,
        duration: formData.duration,
        price: parseFloat(formData.price)
      })
    } finally {
      setSaving(false)
    }
  }

  const inputStyles = {
    width: '100%',
    marginBottom: theme.spacing[4]
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingOption ? 'Edit Delivery Option' : 'Add Delivery Option'}
      size="md"
    >
      <form onSubmit={handleSubmit} style={{ padding: theme.spacing[6] }}>
        <Input
          label="Option Name"
          placeholder="e.g., Standard Shipping, Express Overnight"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
          style={inputStyles}
        />

        <Input
          label="Delivery Duration"
          placeholder="e.g., 3-5 business days, Next day"
          value={formData.duration}
          onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
          required
          style={inputStyles}
        />

        <Input
          label="Price"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={formData.price}
          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
          required
          style={inputStyles}
        />

        <div style={{
          display: 'flex',
          gap: theme.spacing[3],
          justifyContent: 'flex-end',
          marginTop: theme.spacing[6]
        }}>
          <Button onClick={onClose} variant="secondary" disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={saving}>
            {editingOption ? 'Update Option' : 'Add Option'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default DeliveryOptionsPage
