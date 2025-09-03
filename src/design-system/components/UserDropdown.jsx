import { useState } from 'react'
import { theme } from '../theme'
import Dropdown from './Dropdown'
import DropdownItem from './DropdownItem'

const UserDropdown = ({ user, onPaymentSetup, onDeliverySetup, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false)

  const triggerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[2],
    padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: theme.borderRadius.md,
    cursor: 'pointer',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.neutral[700],
    fontFamily: theme.typography.fontFamily.sans.join(', '),
    transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.easeInOut}`,
    ':hover': {
      backgroundColor: theme.colors.neutral[50],
      color: theme.colors.neutral[900]
    }
  }

  const welcomeTextStyles = {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.neutral[700],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const userNameStyles = {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary[600],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const chevronStyles = {
    width: '16px',
    height: '16px',
    transition: `transform ${theme.animation.duration.fast} ${theme.animation.easing.easeInOut}`,
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
  }

  const handlePaymentSetup = () => {
    setIsOpen(false)
    onPaymentSetup()
  }

  const handleDeliverySetup = () => {
    setIsOpen(false)
    onDeliverySetup()
  }

  const handleLogout = () => {
    setIsOpen(false)
    onLogout()
  }

  return (
    <Dropdown
      onToggle={setIsOpen}
      trigger={
        <button style={triggerStyles}>
          <div>
            <span style={welcomeTextStyles}>Welcome, </span>
            <span style={userNameStyles}>{user.first_name}</span>
          </div>
          <svg style={chevronStyles} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      }
    >
      <DropdownItem onClick={handlePaymentSetup}>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          Set up Payment Info
        </div>
      </DropdownItem>
      
      <DropdownItem onClick={handleDeliverySetup}>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" clipRule="evenodd" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-.293-.707L15 4.586A1 1 0 0014.414 4H14v3z" />
          </svg>
          Set up Delivery Options
        </div>
      </DropdownItem>
      
      <DropdownItem onClick={() => {}}>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
          </svg>
          Account Settings
        </div>
      </DropdownItem>

      <div style={{ 
        height: '1px', 
        backgroundColor: theme.colors.neutral[200], 
        margin: `${theme.spacing[1]} 0` 
      }} />
      
      <DropdownItem onClick={handleLogout}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: theme.spacing[2],
          color: theme.colors.error[600]
        }}>
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Sign Out
        </div>
      </DropdownItem>
    </Dropdown>
  )
}

export default UserDropdown
