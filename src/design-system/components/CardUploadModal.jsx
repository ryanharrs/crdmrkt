import { useState } from 'react'
import { theme } from '../theme'
import Modal from './Modal'
import Button from './Button'
import Input from './Input'
import Select from './Select'
import FileUpload from './FileUpload'

const CardUploadModal = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    // Player Information
    player_name: '',
    team: '',
    position: '',
    jersey_number: '',
    
    // Card Details
    manufacturer: '',
    set_name: '',
    card_number: '',
    year: new Date().getFullYear(),
    series: '',
    
    // Special Features
    parallel_variant: '',
    serial_number: '',
    rookie_card: false,
    autographed: false,
    memorabilia: false,
    memorabilia_type: '',
    short_print: false,
    
    // Condition & Grading
    condition: 'Mint',
    graded: false,
    grading_company: '',
    grade: '',
    
    // Market Information
    rarity: '',
    estimated_value: '',
    purchase_price: '',
    
    // Sale Information
    for_sale: false,
    asking_price: '',
    price_negotiable: true,
    
    // Images
    front_image: null,
    back_image: null,
    
    // Additional Info
    description: '',
    acquired_from: 'Pack'
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Dropdown options
  const manufacturerOptions = [
    { value: 'Upper Deck', label: 'Upper Deck' },
    { value: 'Topps', label: 'Topps' },
    { value: 'Panini', label: 'Panini' },
    { value: 'O-Pee-Chee', label: 'O-Pee-Chee' },
    { value: 'Leaf', label: 'Leaf' },
    { value: 'ITG', label: 'ITG' },
    { value: 'Score', label: 'Score' },
    { value: 'Other', label: 'Other' }
  ]

  const conditionOptions = [
    { value: 'Mint', label: 'Mint' },
    { value: 'Near Mint', label: 'Near Mint' },
    { value: 'Excellent', label: 'Excellent' },
    { value: 'Good', label: 'Good' },
    { value: 'Fair', label: 'Fair' },
    { value: 'Poor', label: 'Poor' }
  ]

  const gradingCompanyOptions = [
    { value: 'PSA', label: 'PSA' },
    { value: 'BGS', label: 'BGS (Beckett)' },
    { value: 'SGC', label: 'SGC' },
    { value: 'KSA', label: 'KSA' },
    { value: 'CSG', label: 'CSG' }
  ]

  const rarityOptions = [
    { value: 'Common', label: 'Common' },
    { value: 'Uncommon', label: 'Uncommon' },
    { value: 'Rare', label: 'Rare' },
    { value: 'Ultra Rare', label: 'Ultra Rare' },
    { value: 'Legendary', label: 'Legendary' }
  ]

  const positionOptions = [
    { value: 'C', label: 'Center' },
    { value: 'LW', label: 'Left Wing' },
    { value: 'RW', label: 'Right Wing' },
    { value: 'D', label: 'Defense' },
    { value: 'G', label: 'Goalie' }
  ]

  const acquiredFromOptions = [
    { value: 'Pack', label: 'Pack' },
    { value: 'Trade', label: 'Trade' },
    { value: 'Purchase', label: 'Purchase' },
    { value: 'Gift', label: 'Gift' }
  ]

  const sectionStyles = {
    marginBottom: theme.spacing[6]
  }

  const sectionTitleStyles = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing[4],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: theme.spacing[4]
  }

  const checkboxContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[4]
  }

  const checkboxStyles = {
    width: '18px',
    height: '18px',
    accentColor: theme.colors.primary[500]
  }

  const checkboxLabelStyles = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[700],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const buttonRowStyles = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing[3],
    marginTop: theme.spacing[8],
    paddingTop: theme.spacing[6],
    borderTop: `1px solid ${theme.colors.neutral[200]}`
  }

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Required fields
    if (!formData.player_name.trim()) newErrors.player_name = 'Player name is required'
    if (!formData.manufacturer) newErrors.manufacturer = 'Manufacturer is required'
    if (!formData.set_name.trim()) newErrors.set_name = 'Set name is required'
    if (!formData.card_number.trim()) newErrors.card_number = 'Card number is required'
    if (!formData.year) newErrors.year = 'Year is required'
    if (!formData.condition) newErrors.condition = 'Condition is required'
    if (!formData.front_image) newErrors.front_image = 'Front image is required'

    // Conditional validations
    if (formData.graded && !formData.grading_company) {
      newErrors.grading_company = 'Grading company is required when marked as graded'
    }
    if (formData.graded && !formData.grade) {
      newErrors.grade = 'Grade is required when marked as graded'
    }
    if (formData.for_sale && !formData.asking_price) {
      newErrors.asking_price = 'Asking price is required when marked for sale'
    }

    // Number validations
    if (formData.year && (formData.year < 1900 || formData.year > new Date().getFullYear() + 1)) {
      newErrors.year = 'Please enter a valid year'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (addAnother = false) => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await onSubmit(formData, addAnother)
      
      if (addAnother) {
        // Reset form but keep some fields
        setFormData(prev => ({
          ...prev,
          player_name: '',
          card_number: '',
          serial_number: '',
          front_image: null,
          back_image: null,
          description: '',
          estimated_value: '',
          purchase_price: '',
          asking_price: ''
        }))
      } else {
        onClose()
      }
    } catch (error) {
      console.error('Error submitting card:', error)
      // Handle error - could set a global error state
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      player_name: '',
      team: '',
      position: '',
      jersey_number: '',
      manufacturer: '',
      set_name: '',
      card_number: '',
      year: new Date().getFullYear(),
      series: '',
      parallel_variant: '',
      serial_number: '',
      rookie_card: false,
      autographed: false,
      memorabilia: false,
      memorabilia_type: '',
      short_print: false,
      condition: 'Mint',
      graded: false,
      grading_company: '',
      grade: '',
      rarity: '',
      estimated_value: '',
      purchase_price: '',
      for_sale: false,
      asking_price: '',
      price_negotiable: true,
      front_image: null,
      back_image: null,
      description: '',
      acquired_from: 'Pack'
    })
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Upload Hockey Card"
      size="xl"
    >
      <form onSubmit={(e) => e.preventDefault()}>
        {/* Player Information */}
        <div style={sectionStyles}>
          <h3 style={sectionTitleStyles}>Player Information</h3>
          <div style={gridStyles}>
            <Input
              label="Player Name"
              value={formData.player_name}
              onChange={(e) => updateFormData('player_name', e.target.value)}
              placeholder="Connor McDavid"
              required
              error={errors.player_name}
            />
            <Input
              label="Team"
              value={formData.team}
              onChange={(e) => updateFormData('team', e.target.value)}
              placeholder="Edmonton Oilers"
            />
            <Select
              label="Position"
              value={formData.position}
              onChange={(value) => updateFormData('position', value)}
              options={positionOptions}
              placeholder="Select position"
            />
            <Input
              label="Jersey Number"
              type="number"
              value={formData.jersey_number}
              onChange={(e) => updateFormData('jersey_number', e.target.value)}
              placeholder="97"
              min="1"
              max="99"
            />
          </div>
        </div>

        {/* Card Details */}
        <div style={sectionStyles}>
          <h3 style={sectionTitleStyles}>Card Details</h3>
          <div style={gridStyles}>
            <Select
              label="Manufacturer"
              value={formData.manufacturer}
              onChange={(value) => updateFormData('manufacturer', value)}
              options={manufacturerOptions}
              placeholder="Select manufacturer"
              required
              error={errors.manufacturer}
            />
            <Input
              label="Set Name"
              value={formData.set_name}
              onChange={(e) => updateFormData('set_name', e.target.value)}
              placeholder="2023-24 Upper Deck Series 1"
              required
              error={errors.set_name}
            />
            <Input
              label="Card Number"
              value={formData.card_number}
              onChange={(e) => updateFormData('card_number', e.target.value)}
              placeholder="1"
              required
              error={errors.card_number}
            />
            <Input
              label="Year"
              type="number"
              value={formData.year}
              onChange={(e) => updateFormData('year', parseInt(e.target.value))}
              placeholder="2023"
              min="1900"
              max={new Date().getFullYear() + 1}
              required
              error={errors.year}
            />
            <Input
              label="Series"
              value={formData.series}
              onChange={(e) => updateFormData('series', e.target.value)}
              placeholder="Series 1"
            />
            <Input
              label="Parallel/Variant"
              value={formData.parallel_variant}
              onChange={(e) => updateFormData('parallel_variant', e.target.value)}
              placeholder="Gold, Rainbow, etc."
            />
          </div>
        </div>

        {/* Special Features */}
        <div style={sectionStyles}>
          <h3 style={sectionTitleStyles}>Special Features</h3>
          <div style={gridStyles}>
            <Input
              label="Serial Number"
              value={formData.serial_number}
              onChange={(e) => updateFormData('serial_number', e.target.value)}
              placeholder="123/999"
            />
            <Input
              label="Memorabilia Type"
              value={formData.memorabilia_type}
              onChange={(e) => updateFormData('memorabilia_type', e.target.value)}
              placeholder="Game-Used Jersey"
              disabled={!formData.memorabilia}
            />
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing[4], marginTop: theme.spacing[4] }}>
            <div style={checkboxContainerStyles}>
              <input
                type="checkbox"
                id="rookie_card"
                checked={formData.rookie_card}
                onChange={(e) => updateFormData('rookie_card', e.target.checked)}
                style={checkboxStyles}
              />
              <label htmlFor="rookie_card" style={checkboxLabelStyles}>Rookie Card</label>
            </div>
            
            <div style={checkboxContainerStyles}>
              <input
                type="checkbox"
                id="autographed"
                checked={formData.autographed}
                onChange={(e) => updateFormData('autographed', e.target.checked)}
                style={checkboxStyles}
              />
              <label htmlFor="autographed" style={checkboxLabelStyles}>Autographed</label>
            </div>
            
            <div style={checkboxContainerStyles}>
              <input
                type="checkbox"
                id="memorabilia"
                checked={formData.memorabilia}
                onChange={(e) => updateFormData('memorabilia', e.target.checked)}
                style={checkboxStyles}
              />
              <label htmlFor="memorabilia" style={checkboxLabelStyles}>Memorabilia</label>
            </div>
            
            <div style={checkboxContainerStyles}>
              <input
                type="checkbox"
                id="short_print"
                checked={formData.short_print}
                onChange={(e) => updateFormData('short_print', e.target.checked)}
                style={checkboxStyles}
              />
              <label htmlFor="short_print" style={checkboxLabelStyles}>Short Print</label>
            </div>
          </div>
        </div>

        {/* Condition & Grading */}
        <div style={sectionStyles}>
          <h3 style={sectionTitleStyles}>Condition & Grading</h3>
          <div style={gridStyles}>
            <Select
              label="Condition"
              value={formData.condition}
              onChange={(value) => updateFormData('condition', value)}
              options={conditionOptions}
              required
              error={errors.condition}
            />
            <Select
              label="Rarity"
              value={formData.rarity}
              onChange={(value) => updateFormData('rarity', value)}
              options={rarityOptions}
              placeholder="Select rarity"
            />
            <Select
              label="Grading Company"
              value={formData.grading_company}
              onChange={(value) => updateFormData('grading_company', value)}
              options={gradingCompanyOptions}
              placeholder="Select grading company"
              disabled={!formData.graded}
              error={errors.grading_company}
            />
            <Input
              label="Grade"
              value={formData.grade}
              onChange={(e) => updateFormData('grade', e.target.value)}
              placeholder="10, 9.5, etc."
              disabled={!formData.graded}
              error={errors.grade}
            />
          </div>
          
          <div style={checkboxContainerStyles}>
            <input
              type="checkbox"
              id="graded"
              checked={formData.graded}
              onChange={(e) => updateFormData('graded', e.target.checked)}
              style={checkboxStyles}
            />
            <label htmlFor="graded" style={checkboxLabelStyles}>Professionally Graded</label>
          </div>
        </div>

        {/* Images */}
        <div style={sectionStyles}>
          <h3 style={sectionTitleStyles}>Card Images</h3>
          <div style={gridStyles}>
            <FileUpload
              label="Front Image"
              onChange={(file) => updateFormData('front_image', file)}
              accept="image/*"
              required
              error={errors.front_image}
            />
            <FileUpload
              label="Back Image"
              onChange={(file) => updateFormData('back_image', file)}
              accept="image/*"
            />
          </div>
        </div>

        {/* Market Information */}
        <div style={sectionStyles}>
          <h3 style={sectionTitleStyles}>Market Information</h3>
          <div style={gridStyles}>
            <Input
              label="Estimated Value"
              type="number"
              value={formData.estimated_value}
              onChange={(e) => updateFormData('estimated_value', e.target.value)}
              placeholder="50.00"
              min="0"
              step="0.01"
            />
            <Input
              label="Purchase Price"
              type="number"
              value={formData.purchase_price}
              onChange={(e) => updateFormData('purchase_price', e.target.value)}
              placeholder="25.00"
              min="0"
              step="0.01"
            />
            <Select
              label="Acquired From"
              value={formData.acquired_from}
              onChange={(value) => updateFormData('acquired_from', value)}
              options={acquiredFromOptions}
            />
            <Input
              label="Asking Price"
              type="number"
              value={formData.asking_price}
              onChange={(e) => updateFormData('asking_price', e.target.value)}
              placeholder="75.00"
              min="0"
              step="0.01"
              disabled={!formData.for_sale}
              error={errors.asking_price}
            />
          </div>
          
          <div style={{ display: 'flex', gap: theme.spacing[4], marginTop: theme.spacing[4] }}>
            <div style={checkboxContainerStyles}>
              <input
                type="checkbox"
                id="for_sale"
                checked={formData.for_sale}
                onChange={(e) => updateFormData('for_sale', e.target.checked)}
                style={checkboxStyles}
              />
              <label htmlFor="for_sale" style={checkboxLabelStyles}>List for Sale</label>
            </div>
            
            <div style={checkboxContainerStyles}>
              <input
                type="checkbox"
                id="price_negotiable"
                checked={formData.price_negotiable}
                onChange={(e) => updateFormData('price_negotiable', e.target.checked)}
                style={checkboxStyles}
                disabled={!formData.for_sale}
              />
              <label htmlFor="price_negotiable" style={checkboxLabelStyles}>Price Negotiable</label>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div style={sectionStyles}>
          <h3 style={sectionTitleStyles}>Additional Information</h3>
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => updateFormData('description', e.target.value)}
            placeholder="Any additional notes about this card..."
            multiline
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div style={buttonRowStyles}>
          <Button 
            variant="secondary" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Add Another Card
          </Button>
          <Button 
            variant="primary" 
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Done
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CardUploadModal
