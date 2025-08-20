import { useState, useRef } from 'react'
import { theme } from '../theme'

const FileUpload = ({ 
  label,
  onChange,
  accept = "image/*",
  multiple = false,
  disabled = false,
  required = false,
  error = '',
  preview = true,
  className = '',
  ...props 
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const inputRef = useRef(null)

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

  const dropZoneStyles = {
    border: `2px dashed ${error ? theme.colors.error[300] : dragActive ? theme.colors.primary[400] : theme.colors.neutral[300]}`,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[8],
    textAlign: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    backgroundColor: disabled ? theme.colors.neutral[50] : dragActive ? theme.colors.primary[25] : theme.colors.neutral[25],
    transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.easeOut}`,
    position: 'relative'
  }

  const iconStyles = {
    width: '48px',
    height: '48px',
    margin: '0 auto 16px',
    color: theme.colors.neutral[400]
  }

  const textStyles = {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.neutral[600],
    marginBottom: theme.spacing[2],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const subtextStyles = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[400],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const errorStyles = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.error[600],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const previewContainerStyles = {
    display: 'flex',
    gap: theme.spacing[3],
    flexWrap: 'wrap',
    marginTop: theme.spacing[3]
  }

  const previewStyles = {
    position: 'relative',
    width: '120px',
    height: '120px'
  }

  const previewImageStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.neutral[200]}`
  }

  const removeButtonStyles = {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: theme.colors.error[500],
    color: theme.colors.white,
    border: 'none',
    borderRadius: theme.borderRadius.full,
    width: '24px',
    height: '24px',
    fontSize: theme.typography.fontSize.sm,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const requiredStyles = {
    color: theme.colors.error[500]
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled) return
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList)
    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles

    setFiles(updatedFiles)
    onChange(multiple ? updatedFiles : updatedFiles[0])

    if (preview) {
      newFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (e) => {
            setPreviews(prev => multiple ? [...prev, e.target.result] : [e.target.result])
          }
          reader.readAsDataURL(file)
        }
      })
    }
  }

  const handleInputChange = (e) => {
    handleFiles(e.target.files)
  }

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    const updatedPreviews = previews.filter((_, i) => i !== index)
    
    setFiles(updatedFiles)
    setPreviews(updatedPreviews)
    onChange(multiple ? updatedFiles : null)
  }

  return (
    <div style={containerStyles} className={className}>
      {label && (
        <label style={labelStyles}>
          {label}
          {required && <span style={requiredStyles}> *</span>}
        </label>
      )}
      
      <div
        style={dropZoneStyles}
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          style={{ display: 'none' }}
          {...props}
        />
        
        <div style={iconStyles}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 48 48" aria-hidden="true">
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        
        <div style={textStyles}>
          <span>Click to upload</span> or drag and drop
        </div>
        <div style={subtextStyles}>
          PNG, JPG, GIF up to 10MB
        </div>
      </div>

      {preview && previews.length > 0 && (
        <div style={previewContainerStyles}>
          {previews.map((src, index) => (
            <div key={index} style={previewStyles}>
              <img src={src} alt={`Preview ${index + 1}`} style={previewImageStyles} />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(index)
                }}
                style={removeButtonStyles}
                type="button"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      {error && (
        <span style={errorStyles}>
          {error}
        </span>
      )}
    </div>
  )
}

export default FileUpload
