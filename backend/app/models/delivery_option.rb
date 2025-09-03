class DeliveryOption
  include Mongoid::Document
  include Mongoid::Timestamps

  # Fields
  field :name, type: String # e.g., "Standard Shipping", "Express Overnight"
  field :duration, type: String # e.g., "3-5 business days", "Next day"
  field :price, type: BigDecimal # Delivery cost in dollars

  # Relationships
  field :seller_id, type: BSON::ObjectId
  belongs_to :seller, class_name: 'User', foreign_key: 'seller_id'

  # Validations
  validates :name, presence: true, length: { maximum: 100 }
  validates :duration, presence: true, length: { maximum: 50 }
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :seller_id, presence: true

  # Indexes
  index({ seller_id: 1 })
  index({ seller_id: 1, name: 1 }, { unique: true }) # Unique delivery option names per seller

  # Scopes
  scope :active, -> { where(active: true) }
  scope :for_seller, ->(seller_id) { where(seller_id: seller_id) }

  # Instance methods
  def formatted_price
    "$#{'%.2f' % price}"
  end

  def formatted_duration
    duration
  end

  def to_json_response
    {
      id: id.to_s,
      name: name,
      duration: duration,
      price: price.to_f,
      formatted_price: formatted_price,
      seller_id: seller_id.to_s,
      created_at: created_at,
      updated_at: updated_at
    }
  end
end
