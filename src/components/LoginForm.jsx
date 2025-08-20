import { useState } from 'react'
import { Button, Input, Modal } from '../design-system'

const LoginForm = ({ onLogin, onSwitchToSignup, onClose }) => {
  const [formData, setFormData] = useState({
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

    try {
      await onLogin(formData)
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
      title="Log In"
      size="sm"
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
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
        />
        
        <Button 
          type="submit" 
          variant="primary" 
          size="md"
          disabled={loading}
          loading={loading}
          style={{ marginTop: '0.5rem' }}
        >
          Log In
        </Button>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
            Don't have an account?{' '}
            <Button
              variant="ghost"
              size="sm"
              onClick={onSwitchToSignup}
              disabled={loading}
              style={{ padding: '0', minHeight: 'auto', textDecoration: 'underline' }}
            >
              Sign Up
            </Button>
          </p>
        </div>
      </form>
    </Modal>
  )
}

export default LoginForm
