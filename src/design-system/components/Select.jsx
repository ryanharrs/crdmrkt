import { useState } from 'react'
import { theme } from '../theme'

const Select = ({ 
  label, 
  value, 
  onChange, 
  options = [],
  placeholder = "Select an option",
  disabled = false,
  required = false,
  error = '',
  className = '',
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[2],
    width: '100%'
  }

  const labelStyles = {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.neutral[700],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const selectStyles = {
    padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
    border: `1px solid ${error ? theme.colors.error[300] : isFocused ? theme.colors.primary[500] : theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.sans.join(', '),
    backgroundColor: disabled ? theme.colors.neutral[50] : theme.colors.white,
    color: disabled ? theme.colors.neutral[400] : theme.colors.neutral[900],
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.easeOut}`,
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 0.75rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5em 1.5em',
    paddingRight: '3rem',
    outline: 'none'
  }

  const errorStyles = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.error[600],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const requiredStyles = {
    color: theme.colors.error[500]
  }

  return (
    <div style={containerStyles} className={className}>
      {label && (
        <label style={labelStyles}>
          {label}
          {required && <span style={requiredStyles}> *</span>}
        </label>
      )}
      
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={selectStyles}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <span style={errorStyles}>
          {error}
        </span>
      )}
    </div>
  )
}

export default Select
