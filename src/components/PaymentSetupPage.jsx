import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { theme } from '../design-system/theme'
import { Button } from '../design-system'

const PaymentSetupPage = ({ user }) => {
  const navigate = useNavigate()
  const [stripeStatus, setStripeStatus] = useState('loading') // 'loading', 'not_connected', 'pending', 'active'
  const [stripeDetails, setStripeDetails] = useState(null)
  const [isCreatingAccount, setIsCreatingAccount] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [error, setError] = useState('')

  const containerStyles = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: theme.spacing[6],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const headerStyles = {
    textAlign: 'center',
    marginBottom: theme.spacing[8]
  }

  const titleStyles = {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing[4],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const subtitleStyles = {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.neutral[600],
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: theme.typography.lineHeight.relaxed,
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const cardStyles = {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[8],
    boxShadow: theme.shadows.lg,
    border: `1px solid ${theme.colors.neutral[200]}`
  }

  const statusStyles = {
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[6],
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[3]
  }

  const getStatusStyles = (status) => {
    switch (status) {
      case 'active':
        return {
          ...statusStyles,
          backgroundColor: theme.colors.success[50],
          border: `1px solid ${theme.colors.success[200]}`,
          color: theme.colors.success[800]
        }
      case 'pending':
        return {
          ...statusStyles,
          backgroundColor: theme.colors.warning[50],
          border: `1px solid ${theme.colors.warning[200]}`,
          color: theme.colors.warning[800]
        }
      default:
        return {
          ...statusStyles,
          backgroundColor: theme.colors.neutral[50],
          border: `1px solid ${theme.colors.neutral[200]}`,
          color: theme.colors.neutral[700]
        }
    }
  }

  const benefitsList = [
    'Receive payments automatically when your cards sell',
    'Get paid within 2-7 business days',
    'Track all your sales and payouts',
    'Secure payment processing by Stripe',
    'Tax reporting made simple'
  ]

  const benefitsStyles = {
    marginBottom: theme.spacing[8]
  }

  const benefitItemStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[3],
    marginBottom: theme.spacing[3],
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.neutral[700],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const checkIconStyles = {
    width: '20px',
    height: '20px',
    color: theme.colors.success[500],
    flexShrink: 0
  }

  const buttonContainerStyles = {
    display: 'flex',
    gap: theme.spacing[4],
    justifyContent: 'center',
    alignItems: 'center'
  }

  const errorStyles = {
    color: theme.colors.error[600],
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing[2],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  useEffect(() => {
    checkStripeStatus()
  }, [])

  const checkStripeStatus = async () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    const token = localStorage.getItem('auth_token')

    try {
      const response = await fetch(`${apiUrl}/api/v1/payments/connect_status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
      if (response.ok) {
        setStripeStatus(data.status)
      } else {
        setError(data.error || 'Failed to check payment status')
      }
    } catch (err) {
      console.error('Error checking Stripe status:', err)
      setStripeStatus('not_connected')
    }
  }

  const handleCreateStripeAccount = async () => {
    setIsCreatingAccount(true)
    setError('')
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    const token = localStorage.getItem('auth_token')

    try {
      const response = await fetch(`${apiUrl}/api/v1/payments/create_connect_account`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
      if (response.ok) {
        // Redirect to Stripe onboarding
        window.location.href = data.onboarding_url
      } else {
        setError(data.error || 'Failed to create Stripe account')
      }
    } catch (err) {
      console.error('Error creating Stripe account:', err)
      setError('Network error. Please try again.')
    } finally {
      setIsCreatingAccount(false)
    }
  }

  const handleResetStripeAccount = async () => {
    setIsResetting(true)
    setError('')
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    const token = localStorage.getItem('auth_token')

    try {
      const response = await fetch(`${apiUrl}/api/v1/payments/reset_connect_account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      
      if (response.ok) {
        // Reset local state
        setStripeStatus('not_connected')
        setStripeDetails(null)
        setError('')
        alert('Stripe account reset successfully! You can now set up a new account.')
      } else {
        setError(data.error || 'Failed to reset Stripe account')
      }
    } catch (err) {
      console.error('Error resetting Stripe account:', err)
      setError('Network error. Please try again.')
    } finally {
      setIsResetting(false)
    }
  }

  const renderStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return (
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      case 'pending':
        return (
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  const renderStatusMessage = () => {
    switch (stripeStatus) {
      case 'active':
        return {
          title: 'Payment Setup Complete! ✅',
          message: 'Your Stripe account is active and ready to receive payments. You\'ll get paid automatically when your cards sell.'
        }
      case 'pending':
        return {
          title: 'Setup In Progress ⏳',
          message: 'Your Stripe account is being reviewed. This usually takes a few minutes to complete. You can start selling cards now!'
        }
      case 'not_connected':
        return {
          title: 'Set Up Payment Processing',
          message: 'Connect your bank account to receive payments when your cards sell. This is required to start selling on our marketplace.'
        }
      default:
        return {
          title: 'Checking Payment Status...',
          message: 'Please wait while we check your payment setup status.'
        }
    }
  }

  const statusMessage = renderStatusMessage()

  if (stripeStatus === 'loading') {
    return (
      <div style={containerStyles}>
        <div style={headerStyles}>
          <h1 style={titleStyles}>Loading...</h1>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h1 style={titleStyles}>Payment Setup</h1>
        <p style={subtitleStyles}>
          Set up your payment information to start receiving money from card sales
        </p>
      </div>

      <div style={cardStyles}>
        {/* Status Section */}
        <div style={getStatusStyles(stripeStatus)}>
          {renderStatusIcon(stripeStatus)}
          <div>
            <h3 style={{ margin: 0, marginBottom: theme.spacing[1], fontSize: theme.typography.fontSize.lg, fontWeight: theme.typography.fontWeight.semibold }}>
              {statusMessage.title}
            </h3>
            <p style={{ margin: 0, fontSize: theme.typography.fontSize.sm }}>
              {statusMessage.message}
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        {stripeStatus === 'not_connected' && (
          <div style={benefitsStyles}>
            <h3 style={{ 
              fontSize: theme.typography.fontSize.lg, 
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.neutral[900],
              marginBottom: theme.spacing[4],
              fontFamily: theme.typography.fontFamily.sans.join(', ')
            }}>
              What you'll get:
            </h3>
            {benefitsList.map((benefit, index) => (
              <div key={index} style={benefitItemStyles}>
                <svg style={checkIconStyles} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {benefit}
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div style={buttonContainerStyles}>
          {stripeStatus === 'not_connected' && (
            <Button
              variant="primary"
              size="lg"
              onClick={handleCreateStripeAccount}
              loading={isCreatingAccount}
              disabled={isCreatingAccount}
            >
              {isCreatingAccount ? 'Setting up...' : 'Set Up Payment Account'}
            </Button>
          )}
          
          {stripeStatus === 'pending' && (
            <>
              <Button
                variant="secondary"
                onClick={checkStripeStatus}
              >
                Check Status
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateStripeAccount}
                loading={isCreatingAccount}
                disabled={isCreatingAccount}
              >
                Complete Setup
              </Button>
              <Button
                variant="outline"
                onClick={handleResetStripeAccount}
                loading={isResetting}
                disabled={isResetting}
              >
                {isResetting ? 'Resetting...' : 'Reset & Start Over'}
              </Button>
            </>
          )}

          <Button
            variant="secondary"
            onClick={() => navigate('/')}
          >
            {stripeStatus === 'active' ? 'Continue to Marketplace' : 'Back to Marketplace'}
          </Button>
        </div>

        {error && (
          <div style={errorStyles}>
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentSetupPage
