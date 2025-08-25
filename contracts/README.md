# Kaizen Smart Contracts

This directory contains the Soroban smart contracts for the Kaizen Web3 Event Platform.

## Contracts Overview

### 1. Event Manager (`event_manager.rs`)
- **Purpose**: Core contract for managing events on-chain
- **Key Functions**:
  - `create_event()` - Create new events
  - `purchase_ticket()` - Buy tickets with XLM
  - `get_event()` - Retrieve event details
  - `get_user_tickets()` - Get user's purchased tickets
  - `update_event_status()` - Enable/disable events (organizer only)

### 2. NFT Minter (`nft_minter.rs`)
- **Purpose**: Mint commemorative NFTs for event attendees
- **Key Functions**:
  - `mint_event_nft()` - Mint individual NFT
  - `batch_mint_event_nfts()` - Mint multiple NFTs at once
  - `tokens_of_owner()` - Get user's NFT collection
  - `transfer()` - Transfer NFT ownership

### 3. Token Rewards (`token_rewards.rs`)
- **Purpose**: Distribute reward tokens to event participants
- **Key Functions**:
  - `claim_event_reward()` - Claim tokens for attending events
  - `set_event_reward()` - Configure reward amounts per event
  - `batch_distribute_rewards()` - Distribute to multiple users
  - `transfer()` - Transfer tokens between users

## Prerequisites

1. **Rust & Soroban CLI**:
   ```bash
   # Install Rust
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   
   # Install Soroban CLI
   curl --proto '=https' --tlsv1.2 -sSf https://soroban.stellar.org/api/install | sh
   ```

2. **Stellar Account**:
   - Create a testnet account using [Stellar Laboratory](https://laboratory.stellar.org/)
   - Fund it with testnet XLM using Friendbot

## Building Contracts

```bash
# Build all contracts
cargo build --target wasm32-unknown-unknown --release

# Check build output
ls -la target/wasm32-unknown-unknown/release/
```

## Deployment

### Using Scripts (Recommended)

**Linux/Mac:**
```bash
cd scripts
chmod +x deploy.sh
./deploy.sh
```

**Windows:**
```bash
cd scripts
deploy.bat
```

### Manual Deployment

1. **Install Contract**:
   ```bash
   soroban contract install \
     --wasm target/wasm32-unknown-unknown/release/kaizen_contracts.wasm
   ```

2. **Deploy Contract**:
   ```bash
   soroban contract deploy \
     --wasm-hash <WASM_HASH> \
     --source alice
   ```

3. **Initialize Contract**:
   ```bash
   # Event Manager
   soroban contract invoke \
     --id <CONTRACT_ADDRESS> \
     --source alice \
     --fn init

   # NFT Minter
   soroban contract invoke \
     --id <CONTRACT_ADDRESS> \
     --source alice \
     --fn init \
     -- \
     --admin <ADMIN_ADDRESS>

   # Token Rewards
   soroban contract invoke \
     --id <CONTRACT_ADDRESS> \
     --source alice \
     --fn init \
     -- \
     --admin <ADMIN_ADDRESS> \
     --name "KaizenReward" \
     --symbol "KZR" \
     --decimals 7 \
     --total_supply 1000000000000000
   ```

## Testing Contracts

### Unit Tests
```bash
cargo test
```

### Integration Testing
```bash
# Test event creation
soroban contract invoke \
  --id <EVENT_MANAGER_ADDRESS> \
  --source alice \
  --fn create_event \
  -- \
  --organizer <ORGANIZER_ADDRESS> \
  --title "Test Event" \
  --description "Test Description" \
  --date $(date +%s) \
  --location "Test Location" \
  --price 50000000 \
  --max_attendees 100 \
  --token_reward_amount 1000000000

# Test ticket purchase
soroban contract invoke \
  --id <EVENT_MANAGER_ADDRESS> \
  --source bob \
  --fn purchase_ticket \
  -- \
  --attendee <BOB_ADDRESS> \
  --event_id 1
```

## Contract Interactions

### From Frontend (TypeScript)
```typescript
import { createEventOnChain, purchaseTicketOnChain } from '@/lib/stellar'

// Create event
const result = await createEventOnChain(
  organizerAddress,
  "Concert",
  "Amazing concert",
  eventDate,
  "New York",
  50,
  1000,
  100
)

// Purchase ticket
const ticketResult = await purchaseTicketOnChain(1, userAddress)
```

## Environment Setup

Update your `.env.local` with deployed contract addresses:

```env
NEXT_PUBLIC_EVENT_MANAGER_CONTRACT=CDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_NFT_MINTER_CONTRACT=CDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_TOKEN_REWARDS_CONTRACT=CDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Security Considerations

1. **Authentication**: All state-changing functions require proper authentication
2. **Input Validation**: Contract validates all input parameters
3. **Access Control**: Admin-only functions are properly protected
4. **Overflow Protection**: Safe arithmetic operations used throughout

## Gas & Fees

- Event creation: ~0.1 XLM
- Ticket purchase: ~0.05 XLM
- NFT minting: ~0.1 XLM
- Token claims: ~0.05 XLM

## Troubleshooting

### Common Issues

1. **Build Errors**:
   ```bash
   # Clean and rebuild
   cargo clean
   cargo build --target wasm32-unknown-unknown --release
   ```

2. **Deployment Issues**:
   - Ensure sufficient XLM balance
   - Check network configuration
   - Verify account exists on testnet

3. **Contract Invoke Errors**:
   - Check function signatures
   - Verify parameter types
   - Ensure proper authentication

### Debug Mode

Enable contract logging:
```bash
export RUST_LOG=soroban_sdk=debug
```

## Documentation

- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Stellar SDK](https://stellar.github.io/stellar-sdk/docs/)
- [Rust Book](https://doc.rust-lang.org/book/)

## Contributing

1. Follow Rust naming conventions
2. Add comprehensive tests for new features
3. Update documentation for any changes
4. Ensure security best practices
