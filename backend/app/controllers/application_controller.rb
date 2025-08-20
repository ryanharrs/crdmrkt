require 'jwt'

class ApplicationController < ActionController::API
  def current_user
    return nil unless auth_header = request.headers['Authorization']
    return nil unless token = auth_header.split(' ').last
    
    begin
      decoded = JWT.decode(token, Rails.application.secret_key_base).first
      @current_user ||= ::User.find(decoded['user_id'])
    rescue JWT::DecodeError, Mongoid::Errors::DocumentNotFound
      nil
    end
  end
  
  def require_authentication
    unless current_user
      render json: { error: 'Authentication required' }, status: :unauthorized
    end
  end
  
  # Alias for compatibility
  alias_method :authenticate_request, :require_authentication
end
