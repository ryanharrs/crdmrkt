class Api::V1::RyanController < ApplicationController
  def favorite_number
    render json: { 
      favorite_number: 4,
      message: "Ryan's favorite number is 4!"
    }
  end
end
