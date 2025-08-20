import { useState } from 'react'
import { theme } from '../theme'

const DropdownItem = ({ 
  children, 
  onClick = () => {}, 
  disabled = false,
  variant = 'default',
  className = '',
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    if (disabled) return
    onClick()
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          color: isHovered ? theme.colors.white : theme.colors.error[600],
          backgroundColor: isHovered ? theme.colors.error[500] : 'transparent'
        }
      default:
        return {
          color: isHovered ? theme.colors.neutral[900] : theme.colors.neutral[700],
          backgroundColor: isHovered ? theme.colors.neutral[50] : 'transparent'
        }
    }
  }

  const itemStyles = {
    padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.easeOut}`,
    borderBottom: `1px solid ${theme.colors.neutral[100]}`,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[2],
    ...getVariantStyles()
  }

  // Remove border from last item
  const isLastItem = false // This could be enhanced with context if needed

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...itemStyles,
        borderBottom: isLastItem ? 'none' : itemStyles.borderBottom
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  )
}

export default DropdownItem
