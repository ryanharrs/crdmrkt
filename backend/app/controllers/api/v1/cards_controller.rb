class Api::V1::CardsController < ApplicationController
  before_action :authenticate_request, except: [:index, :show, :marketplace, :search, :upload_image]
  before_action :set_card, only: [:show, :update, :destroy]
  before_action :verify_card_owner, only: [:update, :destroy]
  
  # GET /api/v1/cards
  def index
    @cards = Card.all
    
    # Apply filters
    @cards = apply_filters(@cards)
    
    # Apply sorting
    @cards = apply_sorting(@cards)
    
    # Apply pagination manually
    page = params[:page].to_i > 0 ? params[:page].to_i : 1
    per_page = [params[:per_page].to_i, 50].min
    per_page = 20 if per_page <= 0
    
    total_count = @cards.count
    total_pages = (total_count / per_page.to_f).ceil
    offset = (page - 1) * per_page
    
    @cards = @cards.skip(offset).limit(per_page)
    
    render json: {
      cards: @cards.map { |card| card.to_json_response },
      pagination: {
        current_page: page,
        per_page: per_page,
        total_pages: total_pages,
        total_count: total_count
      }
    }
  end
  
  # GET /api/v1/cards/:id
  def show
    # Increment popularity when someone views the card
    @card.increment_popularity!
    
    render json: {
      card: @card.to_json_response(include_owner: true)
    }
  end
  
  # POST /api/v1/cards
  def create
    @card = Card.new(card_params)
    @card.owner_id = current_user.id
    
    if @card.save
      render json: {
        message: 'Card created successfully',
        card: @card.to_json_response
      }, status: :created
    else
      render json: {
        error: 'Failed to create card',
        details: @card.errors.full_messages
      }, status: :unprocessable_entity
    end
  end
  
  # PATCH/PUT /api/v1/cards/:id
  def update
    if @card.update(card_params)
      render json: {
        message: 'Card updated successfully',
        card: @card.to_json_response
      }
    else
      render json: {
        error: 'Failed to update card',
        details: @card.errors.full_messages
      }, status: :unprocessable_entity
    end
  end
  
  # DELETE /api/v1/cards/:id
  def destroy
    @card.destroy
    render json: {
      message: 'Card deleted successfully'
    }
  end
  
  # GET /api/v1/cards/my_cards
  def my_cards
    @cards = current_user ? Card.where(owner_id: current_user.id) : Card.none
    
    # Apply filters and sorting
    @cards = apply_filters(@cards)
    @cards = apply_sorting(@cards)
    
    render json: {
      cards: @cards.map { |card| card.to_json_response }
    }
  end
  
  # GET /api/v1/cards/marketplace
  def marketplace
    @cards = Card.for_sale
    
    # Apply filters and sorting
    @cards = apply_filters(@cards)
    @cards = apply_sorting(@cards)
    
    # Apply pagination manually
    page = params[:page].to_i > 0 ? params[:page].to_i : 1
    per_page = [params[:per_page].to_i, 50].min
    per_page = 20 if per_page <= 0
    
    total_count = @cards.count
    total_pages = (total_count / per_page.to_f).ceil
    offset = (page - 1) * per_page
    
    @cards = @cards.skip(offset).limit(per_page)
    
    render json: {
      cards: @cards.map { |card| card.to_json_response },
      pagination: {
        current_page: page,
        per_page: per_page,
        total_pages: total_pages,
        total_count: total_count
      }
    }
  end
  
  # POST /api/v1/cards/:id/toggle_sale
  def toggle_sale
    @card = Card.find(params[:id])
    
    unless @card.owner_id == current_user.id
      return render json: { error: 'Unauthorized' }, status: :unauthorized
    end
    
    @card.for_sale = !@card.for_sale
    
    if @card.for_sale && params[:asking_price].present?
      @card.asking_price = params[:asking_price]
    elsif !@card.for_sale
      @card.asking_price = nil
    end
    
    if @card.save
      render json: {
        message: @card.for_sale ? 'Card listed for sale' : 'Card removed from sale',
        card: @card.to_json_response
      }
    else
      render json: {
        error: 'Failed to update sale status',
        details: @card.errors.full_messages
      }, status: :unprocessable_entity
    end
  end
  
  # GET /api/v1/cards/search
  def search
    query = params[:q]
    
    if query.blank?
      return render json: { cards: [] }
    end
    
    # Search across multiple fields
    @cards = Card.any_of(
      { player_name: /#{Regexp.escape(query)}/i },
      { team: /#{Regexp.escape(query)}/i },
      { manufacturer: /#{Regexp.escape(query)}/i },
      { set_name: /#{Regexp.escape(query)}/i }
    )
    
    # Apply additional filters
    @cards = apply_filters(@cards)
    @cards = apply_sorting(@cards)
    
    render json: {
      cards: @cards.limit(50).map { |card| card.to_json_response },
      query: query
    }
  end

  # POST /api/v1/cards/upload_image - Upload image to Cloudinary and return URL
  def upload_image
    image_file = params[:image]
    
    if image_file.blank?
      return render json: { error: 'No image file provided' }, status: :bad_request
    end
    
    begin
      # Debug: Check if Cloudinary config is available
      puts "=== CLOUDINARY DEBUG ==="
      puts "CLOUDINARY_CLOUD_NAME: #{ENV['CLOUDINARY_CLOUD_NAME'].present? ? 'SET' : 'MISSING'}"
      puts "CLOUDINARY_API_KEY: #{ENV['CLOUDINARY_API_KEY'].present? ? 'SET' : 'MISSING'}"
      puts "CLOUDINARY_API_SECRET: #{ENV['CLOUDINARY_API_SECRET'].present? ? 'SET' : 'MISSING'}"
      puts "========================"
      
      # Upload directly to Cloudinary with explicit config
      result = Cloudinary::Uploader.upload(
        image_file.tempfile,
        {
          folder: "hockey_cards",
          resource_type: "image",
          transformation: [
            { quality: "auto", fetch_format: "auto" },
            { width: 800, height: 600, crop: "limit" }
          ],
          # Explicitly pass config in case env vars aren't working
          cloud_name: ENV['CLOUDINARY_CLOUD_NAME'],
          api_key: ENV['CLOUDINARY_API_KEY'],
          api_secret: ENV['CLOUDINARY_API_SECRET']
        }
      )
      
      render json: {
        message: 'Image uploaded successfully',
        image_url: result['secure_url'],
        public_id: result['public_id']
      }
    rescue => e
      render json: {
        error: 'Failed to upload image',
        details: [e.message]
      }, status: :internal_server_error
    end
  end
  
  private
  
  def set_card
    @card = Card.find(params[:id])
  rescue Mongoid::Errors::DocumentNotFound
    render json: { error: 'Card not found' }, status: :not_found
  end
  
  def verify_card_owner
    unless @card.owner_id == current_user.id
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end
  
  def card_params
    params.require(:card).permit(
      :player_name, :team, :position, :jersey_number,
      :manufacturer, :set_name, :card_number, :year, :series,
      :parallel_variant, :serial_number, :rookie_card, :autographed,
      :memorabilia, :memorabilia_type, :short_print,
      :condition, :graded, :grading_company, :grade,
      :rarity, :estimated_value, :purchase_price, :last_sold_price,
      :card_size, :card_stock, :foil_treatment,
      :front_image_url, :back_image_url, 
      :for_sale, :asking_price, :price_negotiable, :trade_only,
      :acquired_date, :acquired_from, :pack_details,
      :description, :tags,
      detail_image_urls: [], grade_details: {}
    )
  end
  
  def apply_filters(cards)
    # Player name filter
    if params[:player].present?
      cards = cards.where(player_name: /#{Regexp.escape(params[:player])}/i)
    end
    
    # Team filter
    if params[:team].present?
      cards = cards.where(team: params[:team])
    end
    
    # Year filter
    if params[:year].present?
      cards = cards.where(year: params[:year].to_i)
    end
    
    # Manufacturer filter
    if params[:manufacturer].present?
      cards = cards.where(manufacturer: params[:manufacturer])
    end
    
    # Set filter
    if params[:set].present?
      cards = cards.where(set_name: /#{Regexp.escape(params[:set])}/i)
    end
    
    # Rookie cards filter
    if params[:rookie] == 'true'
      cards = cards.where(rookie_card: true)
    end
    
    # Autographed filter
    if params[:autographed] == 'true'
      cards = cards.where(autographed: true)
    end
    
    # Graded filter
    if params[:graded] == 'true'
      cards = cards.where(graded: true)
    end
    
    # Grading company filter
    if params[:grading_company].present?
      cards = cards.where(grading_company: params[:grading_company])
    end
    
    # Condition filter
    if params[:condition].present?
      cards = cards.where(condition: params[:condition])
    end
    
    # Price range filter
    if params[:min_price].present?
      cards = cards.where(:asking_price.gte => params[:min_price].to_f)
    end
    
    if params[:max_price].present?
      cards = cards.where(:asking_price.lte => params[:max_price].to_f)
    end
    
    # Rarity filter
    if params[:rarity].present?
      cards = cards.where(rarity: params[:rarity])
    end
    
    # For sale filter
    if params[:for_sale] == 'true'
      cards = cards.where(for_sale: true)
    end
    
    cards
  end
  
  def apply_sorting(cards)
    case params[:sort]
    when 'price_asc'
      cards.asc(:asking_price)
    when 'price_desc'
      cards.desc(:asking_price)
    when 'year_asc'
      cards.asc(:year)
    when 'year_desc'
      cards.desc(:year)
    when 'player_name'
      cards.asc(:player_name)
    when 'popular'
      cards.desc(:card_popularity)
    when 'recent'
      cards.desc(:created_at)
    else
      cards.desc(:created_at) # Default sort
    end
  end
end
