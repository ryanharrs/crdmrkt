# CrdMrkt

A full-stack web application with React frontend and Ruby on Rails backend.

## Architecture

- **Frontend**: React with Vite
- **Backend**: Ruby on Rails API
- **Database**: MongoDB
- **Containerization**: Docker & Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Ruby 3.2.0 (for local development)

### Running with Docker (Recommended)

1. Clone the repository
2. Run the entire stack:
   ```bash
   docker-compose up
   ```

This will start:
- MongoDB on port 27017
- Rails API backend on port 3001
- React frontend on port 3000

The frontend will automatically connect to the backend and display Ryan's favorite number!

### API Endpoints

- `GET /api/v1/ryan/favorite_number` - Returns Ryan's favorite number (6)

### Local Development

#### Frontend
```bash
npm install
npm run dev
```

#### Backend
```bash
cd backend
bundle install
rails server -p 3001
```

Make sure MongoDB is running locally or update the connection string in `backend/config/mongoid.yml`.

## Docker Services

- **mongodb**: MongoDB database
- **backend**: Rails API server
- **frontend**: React development server

## Environment Variables

- `VITE_API_URL`: Backend API URL (default: http://localhost:3001)
- `MONGODB_URI`: MongoDB connection string
