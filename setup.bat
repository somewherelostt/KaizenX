@echo off
echo 🚀 Kaizen Web3 Events - Setup Script
echo.
echo This script will help you set up the development environment
echo for Kaizen Web3 Events platform on Stellar.
echo.

echo ✅ Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org
    exit /b 1
) else (
    echo ✅ Node.js is installed
)

echo.
echo ✅ Checking Rust installation...
rustc --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Rust is not installed. Please install from https://rustup.rs/
    echo    Run: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    exit /b 1
) else (
    echo ✅ Rust is installed
)

echo.
echo ✅ Installing frontend dependencies...
npm install

echo.
echo ✅ Installing backend dependencies...
cd backend
npm install
cd ..

echo.
echo 🔧 Setting up environment file...
if not exist .env.local (
    copy .env.example .env.local
    echo ✅ Created .env.local from template
    echo ⚠️  Please edit .env.local with your configuration
) else (
    echo ✅ .env.local already exists
)

echo.
echo 📋 Next Steps:
echo.
echo 1. Install Stellar CLI:
echo    - Download from: https://github.com/stellar/stellar-cli/releases
echo    - Or use winget: winget install --id Stellar.StellarCLI
echo    - Add to PATH environment variable
echo.
echo 2. Set up MongoDB:
echo    - Install MongoDB Community: https://www.mongodb.com/try/download/community
echo    - Or use MongoDB Atlas cloud service
echo    - Update DATABASE_URL in .env.local
echo.
echo 3. Configure Stellar CLI:
echo    stellar network add testnet --rpc-url https://soroban-testnet.stellar.org:443 --network-passphrase "Test SDF Network ; September 2015"
echo    stellar keys generate kaizen-admin
echo    stellar account fund kaizen-admin --network testnet
echo.
echo 4. Deploy smart contract:
echo    cd contracts
echo    stellar contract build
echo    scripts\deploy.bat
echo.
echo 5. Start development:
echo    npm run dev (frontend)
echo    cd backend && npm run dev (backend)
echo.
echo 🎉 Setup complete! Check DEPLOYMENT.md for detailed instructions.
pause
