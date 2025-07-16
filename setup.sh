#!/bin/bash

echo "🚀 Setting up LangGraph AI Agent Template..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js version: $(node -v)"

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd backend

if [ ! -f "package.json" ]; then
    print_error "Backend package.json not found!"
    exit 1
fi

# Install backend dependencies
print_status "Installing backend dependencies..."
npm install

if [ $? -ne 0 ]; then
    print_error "Failed to install backend dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating .env file..."
    cp env.example .env
    print_warning "Please edit .env file and add your API keys"
else
    print_status ".env file already exists"
fi

cd ..

# Setup Frontend
echo ""
echo "🎨 Setting up Frontend..."
cd frontend

if [ ! -f "package.json" ]; then
    print_error "Frontend package.json not found!"
    exit 1
fi

# Install frontend dependencies
print_status "Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    print_error "Failed to install frontend dependencies"
    exit 1
fi

cd ..

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env and add your API keys"
echo "2. Start the backend: cd backend && npm run dev"
echo "3. Start the frontend: cd frontend && npm run dev"
echo "4. Open http://localhost:5173 in your browser"
echo ""
echo "📚 For more information, see README.md" 