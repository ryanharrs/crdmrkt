import { useState } from 'react'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { theme } from '../theme'
import Modal from './Modal'
import Button from './Button'

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const PaymentForm = ({ card, onSuccess, onError, onClose }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState('')

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

  const cardElementStyles = {
    padding: theme.spacing[4],
    border: `1px solid ${theme.colors.neutral[300]}`,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white
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

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)
    setPaymentError('')

    const cardElement = elements.getElement(CardElement)

    try {
      // Create payment intent on backend
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const response = await fetch(`${apiUrl}/api/v1/payments/create_intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
          card: cardElement,
          billing_details: {
            name: 'Card Buyer' // In real app, collect buyer info
          }
        }
      })

      if (stripeError) {
        setPaymentError(stripeError.message)
      } else if (paymentIntent.status === 'succeeded') {
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
        {/* Payment Method */}
        <div style={formSectionStyles}>
          <h3 style={sectionTitleStyles}>Payment Method</h3>
          <div style={cardElementStyles}>
            <CardElement
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
