class Api::V1::PaymentsController < ApplicationController
  before_action :authenticate_request, except: [:webhook]
  protect_from_forgery except: [:webhook]

  # POST /api/v1/payments/create_intent
  def create_intent
    begin
      card = Card.find(params[:card_id])
      amount = params[:amount].to_i # Amount in cents
      
      # Validate card is for sale
      unless card.for_sale
        return render json: { error: 'Card is not for sale' }, status: :bad_request
      end

      # Calculate fees
      card_price_cents = (card.asking_price * 100).to_i
      platform_fee_cents = (card_price_cents * 0.05).to_i # 5% platform fee
      
      # Create payment intent with application fee for marketplace
      payment_intent = Stripe::PaymentIntent.create({
        amount: amount,
        currency: 'usd',
        application_fee_amount: platform_fee_cents,
        transfer_data: {
          destination: card.owner.stripe_account_id # We'll add this field to User model
        },
        metadata: {
          card_id: card.id.to_s,
          buyer_id: current_user.id.to_s,
          seller_id: card.owner_id.to_s
        }
      })

      render json: {
        client_secret: payment_intent.client_secret
      }

    rescue Stripe::StripeError => e
      render json: { error: e.message }, status: :bad_request
    rescue => e
      render json: { error: 'Payment processing error' }, status: :internal_server_error
    end
  end

  # POST /api/v1/payments/webhook
  def webhook
    payload = request.body.read
    sig_header = request.env['HTTP_STRIPE_SIGNATURE']
    endpoint_secret = ENV['STRIPE_WEBHOOK_SECRET']

    begin
      event = Stripe::Webhook.construct_event(payload, sig_header, endpoint_secret)
    rescue JSON::ParserError
      render json: { error: 'Invalid payload' }, status: :bad_request
      return
    rescue Stripe::SignatureVerificationError
      render json: { error: 'Invalid signature' }, status: :bad_request
      return
    end

    # Handle the event
    case event['type']
    when 'payment_intent.succeeded'
      handle_payment_success(event['data']['object'])
    when 'payment_intent.payment_failed'
      handle_payment_failed(event['data']['object'])
    else
      Rails.logger.info "Unhandled event type: #{event['type']}"
    end

    render json: { received: true }
  end

  # POST /api/v1/payments/create_connect_account
  def create_connect_account
    begin
      # Create Stripe Connect account for seller
      account = Stripe::Account.create({
        type: 'express',
        country: 'US',
        email: current_user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true }
        }
      })

      # Save Stripe account ID to user
      current_user.update!(stripe_account_id: account.id)

      # Create account link for onboarding
      account_link = Stripe::AccountLink.create({
        account: account.id,
        refresh_url: "#{ENV['FRONTEND_URL']}/seller/stripe/refresh",
        return_url: "#{ENV['FRONTEND_URL']}/seller/stripe/return",
        type: 'account_onboarding'
      })

      render json: {
        account_id: account.id,
        onboarding_url: account_link.url
      }

    rescue Stripe::StripeError => e
      render json: { error: e.message }, status: :bad_request
    end
  end

  # GET /api/v1/payments/connect_status
  def connect_status
    if current_user.stripe_account_id.blank?
      render json: { status: 'not_connected' }
      return
    end

    begin
      account = Stripe::Account.retrieve(current_user.stripe_account_id)
      
      render json: {
        status: account.charges_enabled ? 'active' : 'pending',
        account_id: account.id,
        charges_enabled: account.charges_enabled,
        details_submitted: account.details_submitted
      }

    rescue Stripe::StripeError => e
      render json: { error: e.message }, status: :bad_request
    end
  end

  private

  def handle_payment_success(payment_intent)
    card_id = payment_intent['metadata']['card_id']
    buyer_id = payment_intent['metadata']['buyer_id']
    seller_id = payment_intent['metadata']['seller_id']

    # Create purchase record
    Purchase.create!(
      card_id: card_id,
      buyer_id: buyer_id,
      seller_id: seller_id,
      amount: payment_intent['amount'] / 100.0, # Convert from cents
      stripe_payment_intent_id: payment_intent['id'],
      status: 'completed'
    )

    # Mark card as sold
    card = Card.find(card_id)
    card.update!(for_sale: false)

    Rails.logger.info "Payment succeeded for card #{card_id}"
  end

  def handle_payment_failed(payment_intent)
    card_id = payment_intent['metadata']['card_id']
    
    Rails.logger.error "Payment failed for card #{card_id}: #{payment_intent['last_payment_error']}"
  end
end
