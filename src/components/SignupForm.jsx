import { useState } from 'react'
import { Button, Input, Modal } from '../design-system'

const SignupForm = ({ onSignup, onSwitchToLogin, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      await onSignup({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title="Create Account"
      size="md"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Input
            type="text"
            name="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
            disabled={loading}
          />
          
          <Input
            type="text"
            name="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <Input
          type="email"
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
        />
        
        <Input
          type="password"
          name="password"
          label="Password"
          hint="Must be at least 6 characters"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
          minLength="6"
        />
        
        <Button 
          type="submit" 
          variant="primary" 
          size="md"
          disabled={loading}
          loading={loading}
          style={{ marginTop: '0.5rem' }}
        >
          Create Account
        </Button>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Button
              variant="ghost"
              size="sm"
              onClick={onSwitchToLogin}
              disabled={loading}
              style={{ padding: '0', minHeight: 'auto', textDecoration: 'underline' }}
            >
              Log In
            </Button>
          </p>
        </div>
      </form>
    </Modal>
  )
}

export default SignupForm
