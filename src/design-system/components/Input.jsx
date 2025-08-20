import { theme } from '../theme'

const Input = ({ 
  label,
  error,
  hint,
  size = 'md',
  variant = 'default',
  disabled = false,
  required = false,
  multiline = false,
  rows = 3,
  className = '',
  ...props 
}) => {
  
  const getSizeStyles = () => {
    const sizes = {
      sm: {
        padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
        fontSize: theme.typography.fontSize.sm,
        minHeight: '2rem'
      },
      md: {
        padding: `${theme.spacing[3]} ${theme.spacing[3]}`,
        fontSize: theme.typography.fontSize.base,
        minHeight: '2.5rem'
      },
      lg: {
        padding: `${theme.spacing[4]} ${theme.spacing[4]}`,
        fontSize: theme.typography.fontSize.lg,
        minHeight: '3rem'
      }
    }
    return sizes[size] || sizes.md
  }
  
  const getVariantStyles = () => {
    const variants = {
      default: {
        borderColor: error ? theme.colors.error[300] : theme.colors.neutral[300],
        backgroundColor: disabled ? theme.colors.neutral[50] : theme.colors.white,
        ':focus': {
          borderColor: error ? theme.colors.error[500] : theme.colors.primary[500],
          boxShadow: `0 0 0 3px ${error ? theme.colors.error[100] : theme.colors.primary[100]}`
        }
      }
    }
    return variants[variant] || variants.default
  }
  
  const inputStyles = {
    width: '100%',
    border: '1px solid',
    borderRadius: theme.borderRadius.md,
    fontFamily: theme.typography.fontFamily.sans.join(', '),
    transition: `all ${theme.animation.duration.normal} ${theme.animation.easing.easeInOut}`,
    outline: 'none',
    color: disabled ? theme.colors.neutral[500] : theme.colors.neutral[900],
    ...getSizeStyles(),
    ...getVariantStyles()
  }
  
  const labelStyles = {
    display: 'block',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.neutral[700],
    marginBottom: theme.spacing[1],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }
  
  const errorStyles = {
    display: 'block',
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.error[600],
    marginTop: theme.spacing[1],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }
  
  const hintStyles = {
    display: 'block',
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[500],
    marginTop: theme.spacing[1],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }
  
  const containerStyles = {
    marginBottom: theme.spacing[4]
  }
  
  return (
    <div style={containerStyles} className={`ds-input-container ${className}`}>
      {label && (
        <label style={labelStyles} className="ds-input-label">
          {label}
          {required && <span style={{ color: theme.colors.error[500] }}>*</span>}
        </label>
      )}
      
      {multiline ? (
        <textarea
          style={inputStyles}
          className="ds-input"
          disabled={disabled}
          rows={rows}
          {...props}
        />
      ) : (
        <input
          style={inputStyles}
          className="ds-input"
          disabled={disabled}
          {...props}
        />
      )}
      
      {error && (
        <span style={errorStyles} className="ds-input-error">
          {error}
        </span>
      )}
      
      {hint && !error && (
        <span style={hintStyles} className="ds-input-hint">
          {hint}
        </span>
      )}
    </div>
  )
}

export default Input

