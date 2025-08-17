class Api::V1::AuthController < ApplicationController
  def signup
    user = ::User.new(user_params)
    
    if user.save
      token = generate_jwt_token(user)
      render json: {
        message: 'Account created successfully!',
        user: user.to_json_response,
        token: token
      }, status: :created
    else
      render json: {
        error: 'Failed to create account',
        details: user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end
  
  def login
    user = ::User.find_by(email: params[:email]&.downcase)
    
    if user && user.authenticate(params[:password])
      token = generate_jwt_token(user)
      render json: {
        message: 'Login successful!',
        user: user.to_json_response,
        token: token
      }
    else
      render json: {
        error: 'Invalid email or password'
      }, status: :unauthorized
    end
  end
  
  def me
    if current_user
      render json: {
        user: current_user.to_json_response
      }
    else
      render json: {
        error: 'Not authenticated'
      }, status: :unauthorized
    end
  end
  
  private
  
  def user_params
    params.require(:user).permit(:email, :password, :first_name, :last_name)
  end
  
  def generate_jwt_token(user)
    payload = {
      user_id: user.id.to_s,
      exp: 24.hours.from_now.to_i
    }
    JWT.encode(payload, Rails.application.secret_key_base)
  end
end
