import { useNavigate } from 'react-router-dom'
import { CardGallery } from '../design-system'

const HomePage = () => {
  const navigate = useNavigate()

  const handleCardClick = (card) => {
    navigate(`/card/${card.id}`)
  }

  return (
    <CardGallery 
      title="Hockey Card Marketplace"
      subtitle="Discover and collect amazing hockey cards from sellers around the world"
      onCardClick={handleCardClick}
      showFilters={true}
    />
  )
}

export default HomePage
