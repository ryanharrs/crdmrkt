import { useState, useEffect } from 'react'
import { theme } from '../theme'
import Card from './Card'
import Button from './Button'
import Input from './Input'
import Select from './Select'

const CardGallery = ({ 
  title = "Marketplace",
  subtitle = "Browse hockey cards for sale",
  onCardClick,
  showFilters = true,
  className = '',
  ...props 
}) => {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    player: '',
    team: '',
    manufacturer: '',
    year: '',
    condition: '',
    rookie: false,
    autographed: false,
    graded: false,
    minPrice: '',
    maxPrice: '',
    sort: 'recent'
  })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const containerStyles = {
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: theme.spacing[6]
  }

  const headerStyles = {
    textAlign: 'center',
    marginBottom: theme.spacing[8]
  }

  const titleStyles = {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing[3],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const subtitleStyles = {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.neutral[600],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const filtersContainerStyles = {
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[6],
    marginBottom: theme.spacing[8],
    border: `1px solid ${theme.colors.neutral[200]}`
  }

  const filtersGridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing[4],
    marginBottom: theme.spacing[4]
  }

  const checkboxRowStyles = {
    display: 'flex',
    gap: theme.spacing[6],
    marginBottom: theme.spacing[4]
  }

  const checkboxContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing[2]
  }

  const checkboxStyles = {
    width: '18px',
    height: '18px',
    accentColor: theme.colors.primary[500]
  }

  const checkboxLabelStyles = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[700],
    fontFamily: theme.typography.fontFamily.sans.join(', ')
  }

  const galleryStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: theme.spacing[6],
    marginBottom: theme.spacing[8]
  }

  const loadingStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[12],
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.neutral[600]
  }

  const errorStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[12],
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.error[600],
    backgroundColor: theme.colors.error[50],
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.error[200]}`
  }

  const noResultsStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[12],
    textAlign: 'center'
  }

  const paginationStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing[4]
  }

  const statsStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[6],
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral[600]
  }

  // Filter options
  const manufacturerOptions = [
    { value: 'Upper Deck', label: 'Upper Deck' },
    { value: 'Topps', label: 'Topps' },
    { value: 'Panini', label: 'Panini' },
    { value: 'O-Pee-Chee', label: 'O-Pee-Chee' }
  ]

  const conditionOptions = [
    { value: 'Mint', label: 'Mint' },
    { value: 'Near Mint', label: 'Near Mint' },
    { value: 'Excellent', label: 'Excellent' },
    { value: 'Good', label: 'Good' }
  ]

  const sortOptions = [
    { value: 'recent', label: 'Recently Listed' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'player_name', label: 'Player Name' }
  ]

  const fetchCards = async (resetPage = false) => {
    setLoading(true)
    setError(null)

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const currentPage = resetPage ? 1 : page
      
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage,
        per_page: 20,
        sort: filters.sort
      })

      // Add filters
      if (filters.search) params.append('q', filters.search)
      if (filters.player) params.append('player', filters.player)
      if (filters.team) params.append('team', filters.team)
      if (filters.manufacturer) params.append('manufacturer', filters.manufacturer)
      if (filters.year) params.append('year', filters.year)
      if (filters.condition) params.append('condition', filters.condition)
      if (filters.rookie) params.append('rookie', 'true')
      if (filters.autographed) params.append('autographed', 'true')
      if (filters.graded) params.append('graded', 'true')
      if (filters.minPrice) params.append('min_price', filters.minPrice)
      if (filters.maxPrice) params.append('max_price', filters.maxPrice)

      const response = await fetch(`${apiUrl}/api/v1/cards/marketplace?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch cards')
      }
      
      const data = await response.json()
      
      if (resetPage) {
        setCards(data.cards)
        setPage(1)
      } else {
        setCards(prev => currentPage === 1 ? data.cards : [...prev, ...data.cards])
      }
      
      setTotalPages(data.pagination.total_pages)
      setHasMore(currentPage < data.pagination.total_pages)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchCards(true)
  }, [])

  // Reload when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCards(true)
    }, 300) // Debounce

    return () => clearTimeout(timeoutId)
  }, [filters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleLoadMore = () => {
    setPage(prev => {
      const nextPage = prev + 1
      fetchCards(false)
      return nextPage
    })
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      player: '',
      team: '',
      manufacturer: '',
      year: '',
      condition: '',
      rookie: false,
      autographed: false,
      graded: false,
      minPrice: '',
      maxPrice: '',
      sort: 'recent'
    })
  }

  return (
    <div style={containerStyles} className={className} {...props}>
      {/* Header */}
      <div style={headerStyles}>
        <h1 style={titleStyles}>{title}</h1>
        <p style={subtitleStyles}>{subtitle}</p>
      </div>

      {/* Filters */}
      {showFilters && (
        <div style={filtersContainerStyles}>
          <div style={filtersGridStyles}>
            <Input
              placeholder="Search cards..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            <Input
              placeholder="Player name"
              value={filters.player}
              onChange={(e) => handleFilterChange('player', e.target.value)}
            />
            <Input
              placeholder="Team"
              value={filters.team}
              onChange={(e) => handleFilterChange('team', e.target.value)}
            />
            <Select
              placeholder="Manufacturer"
              value={filters.manufacturer}
              onChange={(value) => handleFilterChange('manufacturer', value)}
              options={manufacturerOptions}
            />
            <Input
              placeholder="Year"
              type="number"
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
            />
            <Select
              placeholder="Condition"
              value={filters.condition}
              onChange={(value) => handleFilterChange('condition', value)}
              options={conditionOptions}
            />
            <Input
              placeholder="Min price"
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
            <Input
              placeholder="Max price"
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
            <Select
              value={filters.sort}
              onChange={(value) => handleFilterChange('sort', value)}
              options={sortOptions}
            />
          </div>

          <div style={checkboxRowStyles}>
            <div style={checkboxContainerStyles}>
              <input
                type="checkbox"
                id="rookie"
                checked={filters.rookie}
                onChange={(e) => handleFilterChange('rookie', e.target.checked)}
                style={checkboxStyles}
              />
              <label htmlFor="rookie" style={checkboxLabelStyles}>Rookie Cards</label>
            </div>
            
            <div style={checkboxContainerStyles}>
              <input
                type="checkbox"
                id="autographed"
                checked={filters.autographed}
                onChange={(e) => handleFilterChange('autographed', e.target.checked)}
                style={checkboxStyles}
              />
              <label htmlFor="autographed" style={checkboxLabelStyles}>Autographed</label>
            </div>
            
            <div style={checkboxContainerStyles}>
              <input
                type="checkbox"
                id="graded"
                checked={filters.graded}
                onChange={(e) => handleFilterChange('graded', e.target.checked)}
                style={checkboxStyles}
              />
              <label htmlFor="graded" style={checkboxLabelStyles}>Graded</label>
            </div>
          </div>

          <Button variant="secondary" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Stats */}
      {!loading && !error && (
        <div style={statsStyles}>
          <span>{cards.length} cards found</span>
          <span>Page {page} of {totalPages}</span>
        </div>
      )}

      {/* Content */}
      {loading && page === 1 ? (
        <div style={loadingStyles}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ animation: 'spin 1s linear infinite' }}>
            <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"/>
          </svg>
          <span style={{ marginLeft: theme.spacing[3] }}>Loading cards...</span>
        </div>
      ) : error ? (
        <div style={errorStyles}>
          Error loading cards: {error}
        </div>
      ) : cards.length === 0 ? (
        <div style={noResultsStyles}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" style={{ color: theme.colors.neutral[400] }}>
            <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
          </svg>
          <h3 style={{ 
            fontSize: theme.typography.fontSize.xl, 
            color: theme.colors.neutral[600],
            margin: `${theme.spacing[4]} 0 ${theme.spacing[2]}`,
            fontFamily: theme.typography.fontFamily.sans.join(', ')
          }}>
            No cards found
          </h3>
          <p style={{ 
            color: theme.colors.neutral[500],
            fontFamily: theme.typography.fontFamily.sans.join(', ')
          }}>
            Try adjusting your filters or check back later for new listings
          </p>
        </div>
      ) : (
        <>
          <div style={galleryStyles}>
            {cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                onClick={onCardClick}
                showPrice={true}
                showOwner={false}
                size="md"
              />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div style={paginationStyles}>
              <Button 
                variant="primary" 
                onClick={handleLoadMore}
                disabled={loading}
                loading={loading && page > 1}
              >
                Load More Cards
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CardGallery
