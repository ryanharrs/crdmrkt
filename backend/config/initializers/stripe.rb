# Stripe configuration
Stripe.api_key = ENV['STRIPE_SECRET_KEY']

# Stripe Connect configuration for marketplace
Stripe.api_version = '2023-10-16'

Rails.logger.info "Stripe initialized with API version: #{Stripe.api_version}"
