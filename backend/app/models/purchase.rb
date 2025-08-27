class Purchase
  include Mongoid::Document
  include Mongoid::Timestamps

  # Purchase details
  field :amount, type: BigDecimal
  field :status, type: String # 'pending', 'completed', 'failed', 'refunded'
  field :stripe_payment_intent_id, type: String

  # References
  field :card_id, type: BSON::ObjectId
  field :buyer_id, type: BSON::ObjectId
  field :seller_id, type: BSON::ObjectId

  # Relationships
  belongs_to :card, class_name: 'Card', foreign_key: 'card_id'
  belongs_to :buyer, class_name: 'User', foreign_key: 'buyer_id'
  belongs_to :seller, class_name: 'User', foreign_key: 'seller_id'

  # Validations
  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :status, presence: true, inclusion: { in: %w[pending completed failed refunded] }
  validates :stripe_payment_intent_id, presence: true
  validates :card_id, presence: true
  validates :buyer_id, presence: true
  validates :seller_id, presence: true

  # Indexes
  index({ stripe_payment_intent_id: 1 }, { unique: true })
  index({ card_id: 1 })
  index({ buyer_id: 1 })
  index({ seller_id: 1 })
  index({ created_at: -1 })

  # Scopes
  scope :completed, -> { where(status: 'completed') }
  scope :pending, -> { where(status: 'pending') }
  scope :recent, -> { order(created_at: :desc) }

  # Instance methods
  def completed?
    status == 'completed'
  end

  def pending?
    status == 'pending'
  end

  def failed?
    status == 'failed'
  end

  def platform_fee
    amount * 0.05 # 5% platform fee
  end

  def seller_amount
    amount - platform_fee
  end

  def to_json_response
    {
      id: id.to_s,
      amount: amount.to_f,
      status: status,
      card: card.to_json_response,
      buyer: buyer.to_json_response,
      seller: seller.to_json_response,
      platform_fee: platform_fee.to_f,
      seller_amount: seller_amount.to_f,
      created_at: created_at,
      updated_at: updated_at
    }
  end
end
