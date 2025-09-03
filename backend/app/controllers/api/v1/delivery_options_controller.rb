class Api::V1::DeliveryOptionsController < ApplicationController
  before_action :authenticate_request, except: [:for_seller]
  before_action :set_delivery_option, only: [:show, :update, :destroy]

  # GET /api/v1/delivery_options - Get current user's delivery options
  def index
    @delivery_options = current_user.delivery_options.order(created_at: :asc)
    
    render json: {
      delivery_options: @delivery_options.map(&:to_json_response)
    }
  end

  # GET /api/v1/delivery_options/:id - Get specific delivery option
  def show
    render json: {
      delivery_option: @delivery_option.to_json_response
    }
  end

  # POST /api/v1/delivery_options - Create new delivery option
  def create
    @delivery_option = current_user.delivery_options.build(delivery_option_params)

    if @delivery_option.save
      render json: {
        message: 'Delivery option created successfully',
        delivery_option: @delivery_option.to_json_response
      }, status: :created
    else
      render json: {
        error: 'Failed to create delivery option',
        details: @delivery_option.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/delivery_options/:id - Update delivery option
  def update
    if @delivery_option.update(delivery_option_params)
      render json: {
        message: 'Delivery option updated successfully',
        delivery_option: @delivery_option.to_json_response
      }
    else
      render json: {
        error: 'Failed to update delivery option',
        details: @delivery_option.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/delivery_options/:id - Delete delivery option
  def destroy
    @delivery_option.destroy
    render json: {
      message: 'Delivery option deleted successfully'
    }
  end

  # GET /api/v1/delivery_options/for_seller/:seller_id - Get delivery options for a specific seller (public)
  def for_seller
    seller_id = params[:seller_id]
    @delivery_options = DeliveryOption.for_seller(seller_id).order(price: :asc)
    
    render json: {
      delivery_options: @delivery_options.map(&:to_json_response)
    }
  end

  private

  def set_delivery_option
    @delivery_option = current_user.delivery_options.find(params[:id])
  rescue Mongoid::Errors::DocumentNotFound
    render json: { error: 'Delivery option not found' }, status: :not_found
  end

  def delivery_option_params
    params.require(:delivery_option).permit(:name, :duration, :price)
  end
end
