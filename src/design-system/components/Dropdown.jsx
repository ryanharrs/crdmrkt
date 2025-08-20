import { useState, useEffect, useRef } from 'react'
import { theme } from '../theme'

const Dropdown = ({ 
  trigger, 
  children, 
  align = 'left',
  disabled = false,
  onToggle = () => {},
  className = '',
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const dropdownRef = useRef(null)

  const toggleDropdown = () => {
    if (disabled) return
    const newState = !isOpen
    setIsOpen(newState)
    onToggle(newState)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        onToggle(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onToggle])

  // Close dropdown on escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        onToggle(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isOpen, onToggle])

  const triggerStyles = {
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing[2],
    userSelect: 'none'
  }

  const dropdownStyles = {
    position: 'absolute',
    top: '100%',
    [align]: '0',
    marginTop: theme.spacing[1],
    backgroundColor: theme.colors.white,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    boxShadow: theme.shadows.lg,
    zIndex: 1000,
    minWidth: '160px',
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' : 'hidden',
    transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
    transition: `opacity ${theme.animation.duration.fast} ${theme.animation.easing.easeOut}, 
                 transform ${theme.animation.duration.fast} ${theme.animation.easing.easeOut}, 
                 visibility ${theme.animation.duration.fast}`,
    overflow: 'hidden'
  }

  const containerStyles = {
    position: 'relative',
    display: 'inline-block'
  }

  return (
    <div 
      ref={dropdownRef}
      style={containerStyles}
      className={className}
      {...props}
    >
      <div 
        onClick={toggleDropdown}
        style={triggerStyles}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {typeof trigger === 'function' ? trigger({ isOpen, isHovered }) : trigger}
      </div>
      
      <div style={dropdownStyles}>
        {children}
      </div>
    </div>
  )
}

export default Dropdown
