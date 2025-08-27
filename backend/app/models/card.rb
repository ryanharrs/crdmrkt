class Card
  include Mongoid::Document
  include Mongoid::Timestamps
  
  # Core Card Information
  field :player_name, type: String
  field :team, type: String
  field :position, type: String
  field :jersey_number, type: Integer
  
  # Card Details
  field :manufacturer, type: String  # e.g., "Upper Deck", "Topps", "Panini"
  field :set_name, type: String      # e.g., "2023-24 Upper Deck Series 1"
  field :card_number, type: String   # Can be "123" or "123/999" for numbered cards
  field :year, type: Integer         # Card year/season
  field :series, type: String        # Specific series within a set
  
  # Special Features & Variants
  field :parallel_variant, type: String    # e.g., "Gold", "Rainbow", "Black Diamond"
  field :serial_number, type: String       # For numbered cards like "123/999"
  field :rookie_card, type: Boolean, default: false
  field :autographed, type: Boolean, default: false
  field :memorabilia, type: Boolean, default: false
  field :memorabilia_type, type: String    # e.g., "Game-Used Jersey", "Stick"
  field :short_print, type: Boolean, default: false
  
  # Condition & Grading
  field :condition, type: String           # "Mint", "Near Mint", "Excellent", "Good", "Fair", "Poor"
  field :graded, type: Boolean, default: false
  field :grading_company, type: String     # "PSA", "BGS", "SGC", "KSA"
  field :grade, type: String              # "10", "9.5", "BGS 9.5"
  field :grade_details, type: Hash        # For detailed grading (centering, corners, edges, surface)
  
  # Rarity & Value
  field :rarity, type: String             # "Common", "Uncommon", "Rare", "Ultra Rare", "Legendary"
  field :estimated_value, type: BigDecimal # Current market estimate
  field :purchase_price, type: BigDecimal # What owner paid
  field :last_sold_price, type: BigDecimal # Most recent sale price
  field :price_trend, type: String        # "Rising", "Falling", "Stable"
  
  # Physical Attributes
  field :card_size, type: String, default: "Standard" # "Standard", "Mini", "Jumbo"
  field :card_stock, type: String         # "Base", "Chrome", "Refractor"
  field :foil_treatment, type: String     # "None", "Holofoil", "Prizm"
  
  # Images & Media (Cloudinary URLs)
  field :front_image_url, type: String
  field :back_image_url, type: String
  field :detail_image_urls, type: Array, default: [] # Array of additional image URLs
  
  # Ownership & Marketplace
  field :owner_id, type: BSON::ObjectId   # Reference to User who owns the card
  field :for_sale, type: Boolean, default: false
  field :asking_price, type: BigDecimal
  field :price_negotiable, type: Boolean, default: true
  field :trade_only, type: Boolean, default: false
  field :wishlist_count, type: Integer, default: 0 # How many users have this on wishlist
  
  # Acquisition Details
  field :acquired_date, type: Date
  field :acquired_from, type: String      # "Pack", "Trade", "Purchase", "Gift"
  field :pack_details, type: String       # If pulled from pack
  
  # Additional Information
  field :description, type: String        # Owner's notes/description
  field :tags, type: Array, default: []   # Custom tags for organization
  field :featured, type: Boolean, default: false # For marketplace featuring
  field :verified, type: Boolean, default: false # Admin verification
  
  # Statistics (if relevant for the player/card)
  field :player_stats, type: Hash         # Career stats at time of card issue
  field :card_popularity, type: Integer, default: 0 # View count or popularity metric
  
  # Relationships
  belongs_to :owner, class_name: 'User', foreign_key: 'owner_id', optional: true
  
  # Validations
  validates :player_name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :manufacturer, presence: true
  validates :set_name, presence: true
  validates :card_number, presence: true
  validates :year, presence: true, numericality: { 
    greater_than: 1900, 
    less_than_or_equal_to: Date.current.year + 1 
  }
  validates :condition, inclusion: { 
    in: ["Mint", "Near Mint", "Excellent", "Good", "Fair", "Poor"],
    message: "must be a valid condition"
  }
  validates :rarity, inclusion: {
    in: ["Common", "Uncommon", "Rare", "Ultra Rare", "Legendary"],
    allow_blank: true
  }
  validates :grading_company, inclusion: {
    in: ["PSA", "BGS", "SGC", "KSA", "CSG"],
    allow_blank: true
  }
  validates :front_image_url, presence: true, format: { with: URI::regexp(%w[http https]) }
  validates :estimated_value, :purchase_price, :asking_price, numericality: { greater_than_or_equal_to: 0 }, allow_blank: true
  validates :owner_id, presence: true
  
  # Custom validations
  validate :grading_consistency
  validate :price_logic
  
  # Indexes for performance
  index({ player_name: 1 })
  index({ team: 1 })
  index({ manufacturer: 1, set_name: 1 })
  index({ year: 1 })
  index({ owner_id: 1 })
  index({ for_sale: 1, asking_price: 1 })
  index({ rookie_card: 1 })
  index({ autographed: 1 })
  index({ graded: 1, grading_company: 1, grade: 1 })
  index({ rarity: 1 })
  index({ created_at: -1 })  # For recent listings
  index({ card_popularity: -1 })  # For popular cards
  
  # Compound indexes for common queries
  index({ manufacturer: 1, set_name: 1, card_number: 1 })  # Unique card identification
  index({ for_sale: 1, player_name: 1 })  # Market browsing
  index({ owner_id: 1, for_sale: 1 })  # Owner's sale items
  
  # Scopes for common queries
  scope :for_sale, -> { where(for_sale: true) }
  scope :sold, -> { where(for_sale: false) }
  scope :rookie_cards, -> { where(rookie_card: true) }
  scope :autographed, -> { where(autographed: true) }
  scope :graded, -> { where(graded: true) }
  scope :by_player, ->(name) { where(player_name: /#{Regexp.escape(name)}/i) }
  scope :by_team, ->(team) { where(team: team) }
  scope :by_year, ->(year) { where(year: year) }
  scope :by_manufacturer, ->(mfg) { where(manufacturer: mfg) }
  scope :recent, -> { order(created_at: :desc) }
  scope :popular, -> { order(card_popularity: :desc) }
  scope :price_range, ->(min, max) { 
    where(:asking_price.gte => min, :asking_price.lte => max) 
  }
  
  # Instance methods
  def display_name
    name_parts = [player_name]
    name_parts << "(#{team})" if team.present?
    name_parts << year.to_s if year.present?
    name_parts.join(' ')
  end
  
  def full_card_name
    parts = []
    parts << year.to_s if year.present?
    parts << manufacturer if manufacturer.present?
    parts << set_name if set_name.present?
    parts << "##{card_number}" if card_number.present?
    parts << player_name if player_name.present?
    parts.join(' ')
  end
  
  def graded?
    graded && grading_company.present? && grade.present?
  end
  
  def numbered?
    serial_number.present? && serial_number.include?('/')
  end
  
  def print_run
    return nil unless numbered?
    serial_number.split('/').last.to_i
  end
  
  def card_serial
    return nil unless numbered?
    serial_number.split('/').first.to_i
  end
  
  def estimated_value_formatted
    return "N/A" unless estimated_value.present?
    "$#{estimated_value.to_f}"
  end
  
  def condition_grade_display
    if graded?
      "#{grading_company} #{grade}"
    else
      condition
    end
  end
  
  def increment_popularity!
    inc(card_popularity: 1)
  end

  # Image helper methods
  def front_image_thumbnail_url
    # For now, just return the main URL - we'll implement Cloudinary transformations later
    front_image_url
  end

  def front_image_medium_url
    front_image_url
  end

  def front_image_large_url
    front_image_url
  end

  def back_image_thumbnail_url
    back_image_url
  end

  def has_images?
    front_image_url.present?
  end
  
  def to_json_response(include_owner: false)
    response = {
      id: id.to_s,
      player_name: player_name,
      team: team,
      position: position,
      jersey_number: jersey_number,
      manufacturer: manufacturer,
      set_name: set_name,
      card_number: card_number,
      year: year,
      rookie_card: rookie_card,
      autographed: autographed,
      memorabilia: memorabilia,
      condition: condition,
      graded: graded,
      grading_company: grading_company,
      grade: grade,
      rarity: rarity,
      estimated_value: estimated_value&.to_f,
      front_image_url: front_image_url,
      back_image_url: back_image_url,
      front_image_thumbnail_url: front_image_thumbnail_url,
      front_image_medium_url: front_image_medium_url,
      front_image_large_url: front_image_large_url,
      back_image_thumbnail_url: back_image_thumbnail_url,
      for_sale: for_sale,
      asking_price: asking_price&.to_f,
      display_name: display_name,
      full_card_name: full_card_name,
      condition_grade_display: condition_grade_display,
      created_at: created_at,
      updated_at: updated_at
    }
    
    if include_owner && owner.present?
      response[:owner] = owner.to_json_response
    end
    
    response
  end
  
  private
  
  def grading_consistency
    if graded && (grading_company.blank? || grade.blank?)
      errors.add(:graded, "must have both grading company and grade when marked as graded")
    end
    
    if !graded && (grading_company.present? || grade.present?)
      errors.add(:graded, "should be true when grading company or grade is specified")
    end
  end
  
  def price_logic
    if for_sale && asking_price.blank?
      errors.add(:asking_price, "must be specified when card is for sale")
    end
    
    if asking_price.present? && purchase_price.present? && asking_price < purchase_price * 0.1
      errors.add(:asking_price, "seems unusually low compared to purchase price")
    end
  end
  

end
