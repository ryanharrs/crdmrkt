# Railway-specific Dockerfile for Ruby on Rails backend
FROM ruby:3.3.9-alpine

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

# Copy gem files
COPY Gemfile Gemfile.lock ./

# Install gems (let Railway handle bundler version automatically)
RUN bundle config set --local without 'development test' && \
    bundle install --retry 3

# Copy the rest of the application
COPY . .

# Precompile assets (if any)
# RUN bundle exec rails assets:precompile

# Expose port
EXPOSE 3001

# Start the Rails server
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "3001"]
