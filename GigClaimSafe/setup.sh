#!/bin/bash

# GigClaimSafe Setup Script

echo "🛡️  GigClaimSafe - Setup Script"
echo "================================"

# Backend setup
echo ""
echo "📦 Setting up backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing backend dependencies..."
pip install -r requirements.txt

echo "✅ Backend setup complete!"

# Frontend setup
echo ""
echo "📦 Setting up frontend..."
cd ../frontend

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Create .env.local
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
fi

echo "✅ Frontend setup complete!"

echo ""
echo "================================"
echo "🚀 Setup complete! Run this to start:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python main.py"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000"
echo "================================"
