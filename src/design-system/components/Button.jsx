import React, { useState } from 'react';
import { theme } from '../theme';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary', 'secondary', 'outline', 'ghost', 'error'
  size = 'md', // 'sm', 'md', 'lg'
  disabled = false,
  loading = false,
  style = {},
  className = '',
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const getVariantStyles = (hovered, pressed) => {
    const variants = {
      primary: {
        normal: {
          background: `linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[600]} 100%)`,
          color: theme.colors.white,
          border: 'none',
          boxShadow: theme.shadows.md,
          transform: 'translateY(0)',
        },
        hover: {
          background: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%)`,
          boxShadow: theme.shadows.lg,
          transform: 'translateY(-1px)',
        },
        pressed: {
          transform: 'translateY(0)',
          boxShadow: theme.shadows.base,
        }
      },
      secondary: {
        normal: {
          backgroundColor: theme.colors.white,
          color: theme.colors.neutral[700],
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: theme.colors.border,
          boxShadow: theme.shadows.sm,
          transform: 'translateY(0)',
        },
        hover: {
          backgroundColor: theme.colors.neutral[50],
          borderColor: theme.colors.neutral[400],
          boxShadow: theme.shadows.base,
          transform: 'translateY(-1px)',
        }
      },
      outline: {
        normal: {
          backgroundColor: 'transparent',
          color: theme.colors.primary[600],
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: theme.colors.primary[300],
          transform: 'translateY(0)',
        },
        hover: {
          backgroundColor: theme.colors.primary[50],
          borderColor: theme.colors.primary[500],
          color: theme.colors.primary[700],
          boxShadow: theme.shadows.sm,
          transform: 'translateY(-1px)',
        }
      },
      ghost: {
        normal: {
          backgroundColor: 'transparent',
          color: theme.colors.neutral[600],
          border: 'none',
          transform: 'translateY(0)',
        },
        hover: {
          backgroundColor: theme.colors.neutral[100],
          color: theme.colors.neutral[700],
        }
      },
      error: {
        normal: {
          background: `linear-gradient(135deg, ${theme.colors.error[500]} 0%, ${theme.colors.error[600]} 100%)`,
          color: theme.colors.white,
          border: 'none',
          boxShadow: theme.shadows.md,
          transform: 'translateY(0)',
        },
        hover: {
          background: `linear-gradient(135deg, ${theme.colors.error[600]} 0%, ${theme.colors.error[700]} 100%)`,
          boxShadow: theme.shadows.lg,
          transform: 'translateY(-1px)',
        }
      }
    };

    const variantStyle = variants[variant] || variants.primary;
    let finalStyle = { ...variantStyle.normal };

    if (!disabled && !loading) {
      if (pressed && variantStyle.pressed) {
        finalStyle = { ...finalStyle, ...variantStyle.pressed };
      } else if (hovered && variantStyle.hover) {
        finalStyle = { ...finalStyle, ...variantStyle.hover };
      }
    }

    return finalStyle;
  };

  const getSizeStyles = () => {
    const sizes = {
      sm: {
        padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
        fontSize: theme.typography.fontSize.sm,
        minHeight: '2.25rem',
        letterSpacing: '0.025em',
        fontWeight: theme.typography.fontWeight.medium,
      },
      md: {
        padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
        fontSize: theme.typography.fontSize.base,
        minHeight: '2.75rem',
        letterSpacing: '0.025em',
        fontWeight: theme.typography.fontWeight.medium,
      },
      lg: {
        padding: `${theme.spacing[4]} ${theme.spacing[8]}`,
        fontSize: theme.typography.fontSize.lg,
        minHeight: '3.25rem',
        letterSpacing: '0.025em',
        fontWeight: theme.typography.fontWeight.semibold,
      }
    };
    return sizes[size] || sizes.md;
  };

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    borderRadius: theme.borderRadius.lg,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    fontFamily: theme.typography.fontFamily.sans.join(', '),
    textDecoration: 'none',
    outline: 'none',
    userSelect: 'none',
    transition: `all ${theme.animation.duration.normal} ${theme.animation.easing.easeInOut}`,
    opacity: disabled || loading ? 0.6 : 1,
    position: 'relative',
    overflow: 'hidden',
  };

  const variantStyles = getVariantStyles(isHovered, isPressed);
  const sizeStyles = getSizeStyles();

  const combinedStyles = {
    ...baseStyles,
    ...sizeStyles,
    ...variantStyles,
    ...style,
  };

  const handleMouseEnter = () => {
    if (!disabled && !loading) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
  };

  const handleMouseDown = () => {
    if (!disabled && !loading) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={combinedStyles}
      disabled={disabled || loading}
      className={className}
      {...props}
    >
      {loading && (
        <div
          style={{
            width: '1em',
            height: '1em',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: children ? theme.spacing[1] : 0,
          }}
        />
      )}
      {children}
    </button>
  );
};

export default Button;