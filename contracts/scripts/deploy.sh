#!/bin/bash

# Kaizen Event Contract Deployment Script

echo "🚀 Building Kaizen Event Contract..."

# Build the contract
stellar contract build

echo "✅ Contract built successfully!"

# Check if we have testnet configured
if ! stellar network ls | grep -q testnet; then
    echo "📡 Configuring Testnet..."
    stellar network add testnet \
        --rpc-url https://soroban-testnet.stellar.org:443 \
        --network-passphrase "Test SDF Network ; September 2015"
fi

# Check if we have admin key
if ! stellar keys ls | grep -q kaizen-admin; then
    echo "🔑 Generating admin keypair..."
    stellar keys generate kaizen-admin
    echo "💰 Funding admin account..."
    stellar account fund kaizen-admin --network testnet
fi

# Deploy the contract
echo "📦 Deploying contract to Testnet..."
WASM=target/wasm32-unknown-unknown/release/kaizen_event.wasm

if [ ! -f "$WASM" ]; then
    echo "❌ WASM file not found at $WASM"
    echo "Please run 'stellar contract build' first"
    exit 1
fi

CONTRACT_ID=$(stellar contract deploy \
    --wasm $WASM \
    --network testnet \
    --source kaizen-admin)

echo "✅ Contract deployed!"
echo "📝 Contract ID: $CONTRACT_ID"

# Save contract ID to environment file
echo "NEXT_PUBLIC_KAIZEN_EVENT_CONTRACT=$CONTRACT_ID" > ../.env.contract

echo "🎉 Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Add the contract ID to your .env file:"
echo "   NEXT_PUBLIC_KAIZEN_EVENT_CONTRACT=$CONTRACT_ID"
echo ""
echo "2. Initialize an event with:"
echo "   stellar contract invoke --id $CONTRACT_ID --source kaizen-admin --network testnet -- init --organizer \$(stellar keys address kaizen-admin) --name \"Test Event\" --token \"none\""
