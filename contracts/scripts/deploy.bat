@echo off
REM Kaizen Event Contract Deployment Script for Windows

echo 🚀 Building Kaizen Event Contract...

REM Build the contract
stellar contract build

if %ERRORLEVEL% neq 0 (
    echo ❌ Contract build failed
    exit /b 1
)

echo ✅ Contract built successfully!

REM Check if we have testnet configured
stellar network ls | findstr testnet >nul
if %ERRORLEVEL% neq 0 (
    echo 📡 Configuring Testnet...
    stellar network add testnet --rpc-url https://soroban-testnet.stellar.org:443 --network-passphrase "Test SDF Network ; September 2015"
)

REM Check if we have admin key
stellar keys ls | findstr kaizen-admin >nul
if %ERRORLEVEL% neq 0 (
    echo 🔑 Generating admin keypair...
    stellar keys generate kaizen-admin
    echo 💰 Funding admin account...
    stellar account fund kaizen-admin --network testnet
)

REM Deploy the contract
echo 📦 Deploying contract to Testnet...
set WASM=target\wasm32-unknown-unknown\release\kaizen_event.wasm

if not exist "%WASM%" (
    echo ❌ WASM file not found at %WASM%
    echo Please run 'stellar contract build' first
    exit /b 1
)

for /f %%i in ('stellar contract deploy --wasm %WASM% --network testnet --source kaizen-admin') do set CONTRACT_ID=%%i

echo ✅ Contract deployed!
echo 📝 Contract ID: %CONTRACT_ID%

REM Save contract ID to environment file
echo NEXT_PUBLIC_KAIZEN_EVENT_CONTRACT=%CONTRACT_ID% > ..\.env.contract

echo 🎉 Deployment complete!
echo.
echo Next steps:
echo 1. Add the contract ID to your .env file:
echo    NEXT_PUBLIC_KAIZEN_EVENT_CONTRACT=%CONTRACT_ID%
echo.
echo 2. Initialize an event with:
for /f %%j in ('stellar keys address kaizen-admin') do set ADMIN_ADDR=%%j
echo    stellar contract invoke --id %CONTRACT_ID% --source kaizen-admin --network testnet -- init --organizer %ADMIN_ADDR% --name "Test Event" --token "none"
