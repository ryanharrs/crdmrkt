class Api::V1::RyanController < ApplicationController
  def favorite_number
    preference = ::UserPreference.current
    render json: { 
      favorite_number: preference.favorite_number,
      message: "Ryan's favorite number is #{preference.favorite_number}!",
      last_updated: preference.updated_at
    }
  end
  
  def update_favorite_number
    number = params[:favorite_number].to_i
    
    if number <= 0
      render json: { error: "Please enter a valid positive number" }, status: 422
      return
    end
    
    preference = ::UserPreference.update_favorite_number(number)
    
    if preference.valid?
      render json: { 
        favorite_number: preference.favorite_number,
        message: "Updated Ryan's favorite number to #{preference.favorite_number}!",
        last_updated: preference.updated_at
      }
    else
      render json: { error: preference.errors.full_messages }, status: 422
    end
  end
end
