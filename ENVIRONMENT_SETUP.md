# Environment Variables Setup

## 🔐 Local Development Setup

### Step 1: Create your .env file
```bash
cp env.template .env
```

### Step 2: Fill in your actual values

Edit `.env` with your real API keys:

**Stripe Keys** (from https://dashboard.stripe.com/apikeys):
```
STRIPE_SECRET_KEY=sk_test_51Abc123...your_actual_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_51Abc123...your_actual_publishable_key
```

**Cloudinary Keys** (from https://cloudinary.com/console):
```
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key  
CLOUDINARY_API_SECRET=your_actual_api_secret
```

### Step 3: Start your development environment
```bash
docker compose up
```

## 🚀 Railway Production Setup

### Backend Service Environment Variables:
```
STRIPE_SECRET_KEY = sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET = whsec_your_webhook_secret
FRONTEND_URL = https://your-frontend-url.railway.app
CLOUDINARY_CLOUD_NAME = your_cloud_name
CLOUDINARY_API_KEY = your_api_key
CLOUDINARY_API_SECRET = your_api_secret
```

### Frontend Service Environment Variables:
```
VITE_STRIPE_PUBLISHABLE_KEY = pk_test_your_publishable_key
VITE_API_URL = https://your-backend-url.railway.app
```

## ⚠️ Security Notes

- ✅ `.env` is in `.gitignore` - your keys will never be committed to git
- ✅ Use TEST keys for development (`sk_test_` and `pk_test_`)
- ✅ Use LIVE keys for production (`sk_live_` and `pk_live_`)
- ❌ Never put real keys directly in `docker-compose.yml` or any tracked files

## 🧪 Testing

1. Add your keys to `.env`
2. Run `docker compose up`
3. Navigate to a card detail page
4. Click "Purchase Card"
5. You should see the Stripe payment form!
