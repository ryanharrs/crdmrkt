import { useState, useEffect } from 'react'
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { theme } from '../theme'
import Modal from './Modal'
import Button from './Button'

// Initialize Stripe
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
if (!stripeKey) {
  console.error('VITE_STRIPE_PUBLISHABLE_KEY is not set!')
}
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

const PaymentForm = ({ card, onSuccess, onError, onClose }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [deliveryOptions, setDeliveryOptions] = useState([])
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(null)
  const [loadingDeliveryOptions, setLoadingDeliveryOptions] = useState(true)
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'CA'
    }
  })

  const containerStyles = {
    padding: theme.spacing[6]
  }

  const summaryStyles = {
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[6],
    marginBottom: theme.spacing[6],
    border: `1px solid ${theme.colors.neutral[200]}`
  }

  const cardInfoStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[4],
    marginBottom: theme.spacing[4]
  }

  const cardImageStyles = {
    width: '80px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.neutral[200]}`
  }

  const cardDetailsStyles = {
    flex: 1
  }

  const cardNameStyles = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing[1],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const cardMetaStyles = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const priceStyles = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary[600],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const formSectionStyles = {
    marginBottom: theme.spacing[6]
  }

  const sectionTitleStyles = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing[4],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const inputStyles = {
    padding: theme.spacing[3],
    border: `1px solid ${theme.colors.neutral[300]}`,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.sans.join(', '),
    color: theme.colors.neutral[900],
    width: '100%',
    ':focus': {
      outline: 'none',
      borderColor: theme.colors.primary[500],
      boxShadow: `0 0 0 1px ${theme.colors.primary[500]}`
    }
  }

  const cardElementStyles = {
    padding: theme.spacing[4],
    border: `1px solid ${theme.colors.neutral[300]}`,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white
  }

  const inputRowStyles = {
    display: 'flex',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[4]
  }

  const inputColumnStyles = {
    flex: 1
  }

  const labelStyles = {
    display: 'block',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.neutral[700],
    marginBottom: theme.spacing[2],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const errorStyles = {
    color: theme.colors.error[600],
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing[2],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const feeInfoStyles = {
    backgroundColor: theme.colors.neutral[25],
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[6],
    border: `1px solid ${theme.colors.neutral[100]}`
  }

  const feeRowStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[2],
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const totalRowStyles = {
    ...feeRowStyles,
    fontWeight: theme.typography.fontWeight.semibold,
    fontSize: theme.typography.fontSize.base,
    borderTop: `1px solid ${theme.colors.neutral[200]}`,
    paddingTop: theme.spacing[2],
    marginBottom: 0
  }

  const buttonRowStyles = {
    display: 'flex',
    gap: theme.spacing[3],
    justifyContent: 'flex-end'
  }

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`
  }

  const calculateFees = (price, deliveryCost = 0) => {
    const cardPrice = parseFloat(price)
    const deliveryPrice = parseFloat(deliveryCost) || 0
    const subtotal = cardPrice + deliveryPrice
    const stripeFee = Math.round((subtotal * 0.029 + 0.30) * 100) / 100 // 2.9% + 30¢ on total including delivery
    const platformFee = Math.round(cardPrice * 0.05 * 100) / 100 // 5% platform fee on card price only
    const total = subtotal + stripeFee + platformFee
    const sellerReceives = cardPrice - platformFee + deliveryPrice // Seller gets card price - platform fee + full delivery cost

    return {
      cardPrice,
      deliveryCost: deliveryPrice,
      subtotal,
      stripeFee,
      platformFee,
      total,
      sellerReceives
    }
  }

  const fees = calculateFees(card.asking_price, selectedDeliveryOption?.price || 0)

  // Fetch delivery options when component mounts
  useEffect(() => {
    const fetchDeliveryOptions = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
        const response = await fetch(`${apiUrl}/api/v1/delivery_options/for_seller/${card.owner_id}`)
        
        if (response.ok) {
          const data = await response.json()
          setDeliveryOptions(data.delivery_options)
          
          // Auto-select the first (cheapest) option if available
          if (data.delivery_options.length > 0) {
            setSelectedDeliveryOption(data.delivery_options[0])
          }
        } else {
          console.error('Failed to fetch delivery options, status:', response.status)
        }
      } catch (error) {
        console.error('Failed to fetch delivery options:', error)
      } finally {
        setLoadingDeliveryOptions(false)
      }
    }

    if (card?.owner_id) {
      fetchDeliveryOptions()
    } else {
      setLoadingDeliveryOptions(false)
    }
  }, [card?.owner_id])

  const handleBillingChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setBillingDetails(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setBillingDetails(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)
    setPaymentError('')

    const cardNumberElement = elements.getElement(CardNumberElement)

    try {
      // Create payment intent on backend
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const token = localStorage.getItem('auth_token')
      
      const headers = {
        'Content-Type': 'application/json'
      }
      
      // Add auth header if user is logged in (optional for guest purchases)
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(`${apiUrl}/api/v1/payments/create_intent`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          card_id: card.id,
          amount: Math.round(fees.total * 100) // Convert to cents
        })
      })

      const { client_secret, error } = await response.json()

      if (error) {
        throw new Error(error)
      }

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: billingDetails
        }
      })

      if (stripeError) {
        setPaymentError(stripeError.message)
      } else if (paymentIntent.status === 'succeeded') {
        // For local development: manually confirm payment since webhooks don't work
        // In production, this is handled by webhooks
        const isProduction = import.meta.env.PROD
        
        console.log('Payment success - Is Production:', isProduction)
        
        if (!isProduction) {
          console.log('Development mode - calling confirm_payment endpoint')
          try {
            await fetch(`${apiUrl}/api/v1/payments/confirm_payment`, {
              method: 'POST',
              headers: headers,
              body: JSON.stringify({
                payment_intent_id: paymentIntent.id
              })
            })
          } catch (confirmError) {
            console.warn('Payment confirmation failed (this is expected in local dev):', confirmError.message)
          }
        } else {
          console.log('Production mode - relying on webhooks, no manual confirmation')
        }
        
        onSuccess(paymentIntent)
      }
    } catch (error) {
      setPaymentError(error.message)
      onError(error)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div style={containerStyles}>
      {/* Purchase Summary */}
      <div style={summaryStyles}>
        <div style={cardInfoStyles}>
          <img 
            src={card.front_image_thumbnail_url || card.front_image_url} 
            alt={card.player_name}
            style={cardImageStyles}
          />
          <div style={cardDetailsStyles}>
            <div style={cardNameStyles}>{card.player_name}</div>
            <div style={cardMetaStyles}>
              {card.year} {card.manufacturer} {card.set_name} #{card.card_number}
            </div>
          </div>
          <div style={priceStyles}>
            {formatPrice(card.asking_price)}
          </div>
        </div>
      </div>

      {/* Delivery Options */}
      {loadingDeliveryOptions ? (
        <div style={{ 
          padding: theme.spacing[4], 
          textAlign: 'center',
          color: theme.colors.neutral[600],
          fontSize: theme.typography.fontSize.sm,
          backgroundColor: theme.colors.neutral[50],
          borderRadius: theme.borderRadius.md,
          border: `1px solid ${theme.colors.neutral[200]}`,
          marginBottom: theme.spacing[4]
        }}>
          Loading delivery options...
        </div>
      ) : deliveryOptions.length === 0 ? (
        <div style={{
          padding: theme.spacing[4],
          backgroundColor: theme.colors.neutral[50],
          borderRadius: theme.borderRadius.md,
          border: `1px solid ${theme.colors.neutral[200]}`,
          textAlign: 'center',
          marginBottom: theme.spacing[4]
        }}>
          <p style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.neutral[600],
            margin: 0
          }}>
            No delivery options available for this seller.
          </p>
        </div>
      ) : (
        <div style={{ marginBottom: theme.spacing[4] }}>
          <h3 style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.neutral[900],
            marginBottom: theme.spacing[3],
            marginTop: 0
          }}>
            Select Delivery Option
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
            {deliveryOptions.map((option) => (
              <label
                key={option.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: theme.spacing[4],
                  backgroundColor: selectedDeliveryOption?.id === option.id 
                    ? theme.colors.primary[50] 
                    : theme.colors.white,
                  border: selectedDeliveryOption?.id === option.id 
                    ? `2px solid ${theme.colors.primary[500]}` 
                    : `1px solid ${theme.colors.neutral[200]}`,
                  borderRadius: theme.borderRadius.md,
                  cursor: 'pointer',
                  transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.easeInOut}`
                }}
              >
                <input
                  type="radio"
                  name="deliveryOption"
                  value={option.id}
                  checked={selectedDeliveryOption?.id === option.id}
                  onChange={() => setSelectedDeliveryOption(option)}
                  style={{ marginRight: theme.spacing[3] }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: theme.typography.fontSize.base,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.neutral[900],
                    marginBottom: theme.spacing[1]
                  }}>
                    {option.name}
                  </div>
                  <div style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.neutral[600]
                  }}>
                    {option.duration}
                  </div>
                </div>
                <div style={{
                  fontSize: theme.typography.fontSize.lg,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.primary[600]
                }}>
                  {formatPrice(option.price)}
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Fee Breakdown */}
      <div style={feeInfoStyles}>
        <div style={feeRowStyles}>
          <span>Card Price:</span>
          <span>{formatPrice(fees.cardPrice)}</span>
        </div>
        {selectedDeliveryOption && (
          <div style={feeRowStyles}>
            <span>Delivery ({selectedDeliveryOption.name}):</span>
            <span>{formatPrice(fees.deliveryCost)}</span>
          </div>
        )}
        <div style={feeRowStyles}>
          <span>Processing Fee:</span>
          <span>{formatPrice(fees.stripeFee)}</span>
        </div>
        <div style={feeRowStyles}>
          <span>Platform Fee (5%):</span>
          <span>{formatPrice(fees.platformFee)}</span>
        </div>
        <div style={totalRowStyles}>
          <span>Total:</span>
          <span>{formatPrice(fees.total)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Billing Information */}
        <div style={formSectionStyles}>
          <h3 style={sectionTitleStyles}>Billing Information</h3>
          
          <div style={inputRowStyles}>
            <div style={inputColumnStyles}>
              <label style={labelStyles}>Full Name</label>
              <input
                type="text"
                style={inputStyles}
                placeholder="John Doe"
                value={billingDetails.name}
                onChange={(e) => handleBillingChange('name', e.target.value)}
                required
              />
            </div>
            <div style={inputColumnStyles}>
              <label style={labelStyles}>Email</label>
              <input
                type="email"
                style={inputStyles}
                placeholder="john@example.com"
                value={billingDetails.email}
                onChange={(e) => handleBillingChange('email', e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: theme.spacing[4] }}>
            <label style={labelStyles}>Address</label>
            <input
              type="text"
              style={inputStyles}
              placeholder="123 Main Street"
              value={billingDetails.address.line1}
              onChange={(e) => handleBillingChange('address.line1', e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: theme.spacing[4] }}>
            <label style={labelStyles}>Address Line 2 (Optional)</label>
            <input
              type="text"
              style={inputStyles}
              placeholder="Apartment, suite, etc."
              value={billingDetails.address.line2}
              onChange={(e) => handleBillingChange('address.line2', e.target.value)}
            />
          </div>

          <div style={inputRowStyles}>
            <div style={inputColumnStyles}>
              <label style={labelStyles}>City</label>
              <input
                type="text"
                style={inputStyles}
                placeholder="Toronto"
                value={billingDetails.address.city}
                onChange={(e) => handleBillingChange('address.city', e.target.value)}
                required
              />
            </div>
            <div style={inputColumnStyles}>
              <label style={labelStyles}>Province/State</label>
              <input
                type="text"
                style={inputStyles}
                placeholder="ON"
                value={billingDetails.address.state}
                onChange={(e) => handleBillingChange('address.state', e.target.value)}
                required
              />
            </div>
            <div style={inputColumnStyles}>
              <label style={labelStyles}>Postal Code</label>
              <input
                type="text"
                style={inputStyles}
                placeholder="M5V 3A8"
                value={billingDetails.address.postal_code}
                onChange={(e) => handleBillingChange('address.postal_code', e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: theme.spacing[4] }}>
            <label style={labelStyles}>Country</label>
            <select
              style={inputStyles}
              value={billingDetails.address.country}
              onChange={(e) => handleBillingChange('address.country', e.target.value)}
              required
            >
              <option value="CA">Canada</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="JP">Japan</option>
              <option value="BR">Brazil</option>
              <option value="MX">Mexico</option>
              <option value="NL">Netherlands</option>
              <option value="SE">Sweden</option>
              <option value="IT">Italy</option>
              <option value="ES">Spain</option>
            </select>
          </div>
        </div>

        {/* Payment Method */}
        <div style={formSectionStyles}>
          <h3 style={sectionTitleStyles}>Payment Method</h3>
          
          <div style={{ marginBottom: theme.spacing[4] }}>
            <label style={labelStyles}>Card Number</label>
            <div style={cardElementStyles}>
              <CardNumberElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: theme.colors.neutral[900],
                      fontFamily: theme.typography.fontFamily.sans.join(', '),
                      '::placeholder': {
                        color: theme.colors.neutral[400],
                      },
                    },
                    invalid: {
                      color: theme.colors.error[600],
                    },
                  },
                }}
              />
            </div>
          </div>

          <div style={inputRowStyles}>
            <div style={inputColumnStyles}>
              <label style={labelStyles}>Expiry Date</label>
              <div style={cardElementStyles}>
                <CardExpiryElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: theme.colors.neutral[900],
                        fontFamily: theme.typography.fontFamily.sans.join(', '),
                        '::placeholder': {
                          color: theme.colors.neutral[400],
                        },
                      },
                      invalid: {
                        color: theme.colors.error[600],
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div style={inputColumnStyles}>
              <label style={labelStyles}>Security Code</label>
              <div style={cardElementStyles}>
                <CardCvcElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: theme.colors.neutral[900],
                        fontFamily: theme.typography.fontFamily.sans.join(', '),
                        '::placeholder': {
                          color: theme.colors.neutral[400],
                        },
                      },
                      invalid: {
                        color: theme.colors.error[600],
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {paymentError && (
            <div style={errorStyles}>
              {paymentError}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={buttonRowStyles}>
          <Button 
            variant="secondary" 
            onClick={onClose}
            disabled={processing}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            disabled={!stripe || processing || (deliveryOptions.length > 0 && !selectedDeliveryOption)}
            loading={processing}
          >
            {processing ? 'Processing...' : `Pay ${formatPrice(fees.total)}`}
          </Button>
        </div>
      </form>
    </div>
  )
}

const PaymentModal = ({ isOpen, onClose, card, onSuccess, onError }) => {
  if (!stripePromise) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Payment Error"
        size="md"
        showCloseButton={true}
      >
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <p>Payment system is not properly configured. Please contact support.</p>
          <Button onClick={onClose} style={{ marginTop: '16px' }}>Close</Button>
        </div>
      </Modal>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Purchase Card"
        size="md"
        showCloseButton={true}
      >
        <PaymentForm 
          card={card}
          onSuccess={onSuccess}
          onError={onError}
          onClose={onClose}
        />
      </Modal>
    </Elements>
  )
}

export default PaymentModal
