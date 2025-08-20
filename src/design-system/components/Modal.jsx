import { theme } from '../theme'
import Button from './Button'

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  className = '' 
}) => {
  
  if (!isOpen) return null
  
  const getSizeStyles = () => {
    const sizes = {
      sm: {
        maxWidth: '24rem', // 384px
        margin: theme.spacing[4]
      },
      md: {
        maxWidth: '32rem', // 512px
        margin: theme.spacing[6]
      },
      lg: {
        maxWidth: '48rem', // 768px
        margin: theme.spacing[8]
      },
      xl: {
        maxWidth: '64rem', // 1024px
        margin: theme.spacing[10]
      }
    }
    return sizes[size] || sizes.md
  }
  
  const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: theme.spacing[4]
  }
  
  const modalStyles = {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    boxShadow: theme.shadows.xl,
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    animation: 'modalSlideIn 0.2s ease-out',
    ...getSizeStyles()
  }
  
  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing[6],
    borderBottom: `1px solid ${theme.colors.neutral[200]}`
  }
  
  const titleStyles = {
    margin: 0,
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.neutral[900],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }
  
  const closeButtonStyles = {
    background: 'none',
    border: 'none',
    fontSize: theme.typography.fontSize['2xl'],
    cursor: 'pointer',
    color: theme.colors.neutral[400],
    padding: theme.spacing[1],
    borderRadius: theme.borderRadius.base,
    transition: `color ${theme.animation.duration.normal}`,
    ':hover': {
      color: theme.colors.neutral[600]
    }
  }
  
  const contentStyles = {
    padding: theme.spacing[6]
  }
  
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }
  
  return (
    <div 
      style={overlayStyles} 
      className="ds-modal-overlay"
      onClick={handleOverlayClick}
    >
      <div 
        style={modalStyles}
        className={`ds-modal ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div style={headerStyles} className="ds-modal-header">
            {title && (
              <h2 style={titleStyles} className="ds-modal-title">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                style={closeButtonStyles}
                className="ds-modal-close"
                onClick={onClose}
                aria-label="Close modal"
              >
                ×
              </button>
            )}
          </div>
        )}
        
        <div style={contentStyles} className="ds-modal-content">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
