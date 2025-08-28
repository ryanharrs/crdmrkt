#!/bin/bash
# Railway deployment script to ensure fresh gems

echo "🚀 Preparing Railway deployment..."

# Check if Gemfile changed
if git diff --name-only HEAD~1 HEAD | grep -q "backend/Gemfile"; then
    echo "📦 Gemfile changed - regenerating Gemfile.lock..."
    
    # Remove old Gemfile.lock
    rm -f backend/Gemfile.lock
    
    # Regenerate with Docker
    docker compose exec backend bundle install
    
    # Add to git
    git add backend/Gemfile.lock
    git commit -m "Update Gemfile.lock for Railway deployment"
    
    echo "✅ Gemfile.lock updated for Railway"
else
    echo "📝 No Gemfile changes detected"
fi

echo "🚢 Ready for Railway deployment!"
