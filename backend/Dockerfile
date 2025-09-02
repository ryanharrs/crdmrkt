# Railway-specific Dockerfile for Ruby on Rails backend
FROM ruby:3.3-alpine

# Install system dependencies
RUN apk add --no-cache \
    build-base \
    postgresql-dev \
    git \
    curl \
    vips-dev \
    vips-tools \
    tzdata

# Set working directory
WORKDIR /app

# Copy gem files first (for better Docker layer caching)
COPY Gemfile Gemfile.lock ./

# Update Bundler and clear cache to prevent version conflicts
RUN gem update --system && \
    gem install bundler && \
    bundle config set --local deployment 'false' && \
    bundle config set --local without 'development test' && \
    rm -rf vendor/bundle .bundle Gemfile.lock && \
    bundle install --jobs 4 --retry 3

# Copy the rest of the application
COPY . .

# Precompile assets (if any)
# RUN bundle exec rails assets:precompile

# Expose port
EXPOSE 3001

# Start the Rails server
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "3001"]
