#!/bin/bash

echo "🚀 Kaizen Web3 Events - Setup Script"
echo ""
echo "This script will help you set up the development environment"
echo "for Kaizen Web3 Events platform on Stellar."
echo ""

# Check Node.js
echo "✅ Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
else
    echo "✅ Node.js is installed: $(node --version)"
fi

# Check Rust
echo ""
echo "✅ Checking Rust installation..."
if ! command -v rustc &> /dev/null; then
    echo "❌ Rust is not installed. Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    source ~/.cargo/env
else
    echo "✅ Rust is installed: $(rustc --version)"
fi

# Add wasm32 target
echo ""
echo "✅ Adding WebAssembly target..."
rustup target add wasm32-unknown-unknown

# Install frontend dependencies
echo ""
echo "✅ Installing frontend dependencies..."
npm install

# Install backend dependencies
echo ""
echo "✅ Installing backend dependencies..."
cd backend
npm install
cd ..

# Set up environment file
echo ""
echo "🔧 Setting up environment file..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local from template"
    echo "⚠️  Please edit .env.local with your configuration"
else
    echo "✅ .env.local already exists"
fi

# Install Stellar CLI
echo ""
echo "✅ Installing Stellar CLI..."
if ! command -v stellar &> /dev/null; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install stellar/tap/stellar-cli
        else
            echo "❌ Homebrew not found. Please install Stellar CLI manually:"
            echo "   https://github.com/stellar/stellar-cli/releases"
        fi
    else
        # Linux
        ARCH=$(uname -m)
        if [ "$ARCH" = "x86_64" ]; then
            curl -L https://github.com/stellar/stellar-cli/releases/latest/download/stellar-cli-*-linux-amd64.tar.gz | tar -xz
            sudo mv stellar /usr/local/bin/
        else
            echo "❌ Please install Stellar CLI manually for your architecture:"
            echo "   https://github.com/stellar/stellar-cli/releases"
        fi
    fi
else
    echo "✅ Stellar CLI is already installed: $(stellar --version)"
fi

echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Configure Stellar CLI:"
echo "   stellar network add testnet --rpc-url https://soroban-testnet.stellar.org:443 --network-passphrase \"Test SDF Network ; September 2015\""
echo "   stellar keys generate kaizen-admin"
echo "   stellar account fund kaizen-admin --network testnet"
echo ""
echo "2. Set up MongoDB:"
echo "   - Install MongoDB Community: https://www.mongodb.com/try/download/community"
echo "   - Or use MongoDB Atlas cloud service"
echo "   - Update DATABASE_URL in .env.local"
echo ""
echo "3. Deploy smart contract:"
echo "   cd contracts"
echo "   stellar contract build"
echo "   ./scripts/deploy.sh"
echo ""
echo "4. Start development:"
echo "   npm run dev (frontend)"
echo "   cd backend && npm run dev (backend)"
echo ""
echo "🎉 Setup complete! Check DEPLOYMENT.md for detailed instructions."
