class Api::V1::HealthController < ApplicationController
  def check
    render json: { 
      status: 'ok',
      timestamp: Time.current.iso8601,
      environment: Rails.env
    }
  end
end
