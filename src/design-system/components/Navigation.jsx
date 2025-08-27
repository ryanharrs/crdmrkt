import { theme } from '../theme'
import Button from './Button'
import Dropdown from './Dropdown'
import DropdownItem from './DropdownItem'
import UserDropdown from './UserDropdown'

const Navigation = ({ 
  user, 
  onLogin, 
  onLogout,
  onUploadCards,
  onPaymentSetup,
  className = '',
  ...props 
}) => {
  const navStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${theme.spacing[4]} ${theme.spacing[6]}`,
    backgroundColor: theme.colors.white,
    borderBottom: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.sm
  }

  const leftSectionStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[8]
  }

  const logoStyles = {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary[600],
    textDecoration: 'none',
    margin: 0
  }

  const navLinksStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[6]
  }

  const rightSectionStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[4]
  }

  const userMenuStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[4]
  }

  const welcomeTextStyles = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600],
    fontWeight: theme.typography.fontWeight.medium
  }

  const myCardsDropdownTrigger = ({ isOpen, isHovered }) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[1],
      padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
      borderRadius: theme.borderRadius.md,
      backgroundColor: isHovered || isOpen ? theme.colors.neutral[50] : 'transparent',
      color: theme.colors.neutral[700],
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.easeOut}`
    }}>
      My Cards
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 20 20" 
        fill="currentColor"
        style={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: `transform ${theme.animation.duration.fast} ${theme.animation.easing.easeOut}`
        }}
      >
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </div>
  )

  const handleViewCards = () => {
    // TODO: Implement view cards functionality
    console.log('View Your Cards clicked')
  }

  const handleUploadCards = () => {
    if (onUploadCards) {
      onUploadCards()
    }
  }

  return (
    <nav style={navStyles} className={className} {...props}>
      <div style={leftSectionStyles}>
        <h1 style={logoStyles}>CrdMrkt</h1>
        
        {user && (
          <div style={navLinksStyles}>
            <Dropdown trigger={myCardsDropdownTrigger} align="left">
              <DropdownItem onClick={handleViewCards}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 3a2 2 0 00-2 2v1h16V5a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
                View Your Cards
              </DropdownItem>
              <DropdownItem onClick={handleUploadCards}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                Upload Cards
              </DropdownItem>
            </Dropdown>
          </div>
        )}
      </div>
      
      <div style={rightSectionStyles}>
        {user ? (
          <UserDropdown 
            user={user}
            onPaymentSetup={onPaymentSetup}
            onLogout={onLogout}
          />
        ) : (
          <Button variant="primary" size="sm" onClick={onLogin}>
            Log In
          </Button>
        )}
      </div>
    </nav>
  )
}

export default Navigation
