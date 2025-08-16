FROM ruby:3.3.1

WORKDIR /app

# Install dependencies
RUN apt-get update -qq && apt-get install -y nodejs npm

# Install Rails first
RUN gem install rails -v '~> 7.1.0'

# Copy Gemfile and generate new Gemfile.lock
COPY Gemfile ./
RUN bundle install

# Copy the rest of the application
COPY . .

# Create Rails app structure if it doesn't exist, then start server
CMD ["sh", "-c", "if [ ! -f config/application.rb ]; then rails new . --api --skip-git --force; fi && bundle install && rails server -b 0.0.0.0 -p 3001"]
