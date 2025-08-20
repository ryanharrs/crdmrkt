require 'bcrypt'

class User
  include Mongoid::Document
  include Mongoid::Timestamps
  
  field :email, type: String
  field :password_digest, type: String
  field :first_name, type: String
  field :last_name, type: String
  
  # Relationships
  has_many :cards, class_name: 'Card', foreign_key: 'owner_id'
  
  # Validations
  validates :email, presence: true, uniqueness: true, format: { with: /\A[^@\s]+@[^@\s]+\z/ }
  validates :first_name, presence: true, length: { minimum: 2 }
  validates :last_name, presence: true, length: { minimum: 2 }
  validates :password, presence: true, length: { minimum: 6 }, on: :create
  
  # Indexes for performance
  index({ email: 1 }, { unique: true })
  
  # Password authentication using bcrypt
  def password
    @password
  end
  
  def password=(new_password)
    @password = new_password
    self.password_digest = BCrypt::Password.create(new_password) if new_password.present?
  end
  
  def authenticate(password)
    BCrypt::Password.new(password_digest) == password
  end
  
  # Helper methods
  def full_name
    "#{first_name} #{last_name}"
  end
  
  def to_json_response
    {
      id: id.to_s,
      email: email,
      first_name: first_name,
      last_name: last_name,
      full_name: full_name,
      created_at: created_at
    }
  end
end
