class UserPreference
  include Mongoid::Document
  include Mongoid::Timestamps
  
  field :favorite_number, type: Integer
  field :user_name, type: String, default: "Ryan"
  
  validates :favorite_number, presence: true, numericality: { only_integer: true }
  
  # Ensure only one preference record exists
  def self.current
    first_or_create(user_name: "Ryan", favorite_number: 4)
  end
  
  def self.update_favorite_number(number)
    preference = current
    preference.update(favorite_number: number)
    preference
  end
end
