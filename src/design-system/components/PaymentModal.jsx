import { useState } from 'react'
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { theme } from '../theme'
import Modal from './Modal'
import Button from './Button'

// Initialize Stripe
console.log('Stripe publishable key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
console.log('All env vars:', import.meta.env)
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

  const calculateFees = (price) => {
    const cardPrice = parseFloat(price)
    const stripeFee = Math.round((cardPrice * 0.029 + 0.30) * 100) / 100 // 2.9% + 30¢
    const platformFee = Math.round(cardPrice * 0.05 * 100) / 100 // 5% platform fee
    const total = cardPrice + stripeFee + platformFee
    const sellerReceives = cardPrice - platformFee

    return {
      cardPrice,
      stripeFee,
      platformFee,
      total,
      sellerReceives
    }
  }

  const fees = calculateFees(card.asking_price)

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
        const isLocalDev = apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1') || apiUrl.includes('3001')
        
        console.log('Payment success - API URL:', apiUrl, 'Is Local Dev:', isLocalDev)
        
        if (isLocalDev) {
          console.log('Local dev detected - calling confirm_payment endpoint')
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
          console.log('Production detected - relying on webhooks, no manual confirmation')
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

      {/* Fee Breakdown */}
      <div style={feeInfoStyles}>
        <div style={feeRowStyles}>
          <span>Card Price:</span>
          <span>{formatPrice(fees.cardPrice)}</span>
        </div>
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
            disabled={!stripe || processing}
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
