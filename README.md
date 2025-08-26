# Kaizen - Web3 Events on Stellar 🌟

**Live events, on-chain tickets, and POAP rewards powered by Stellar blockchain**

![Kaizen Banner](/public/placeholder-logo.png)

## 🎯 Project Overview

Kaizen is a decentralized event platform that allows organizers to list events, sell blockchain-based tickets, and automatically airdrop NFTs/POAPs to attendees. Built on the Stellar network for fast, low-cost transactions.

### ✨ Key Features

- **📅 Event Discovery**: Browse events with filtering by Live Shows, Tourism, Workshops, etc.
- **🎫 On-Chain Tickets**: Secure, transparent ticket sales via Stellar blockchain
- **🏆 POAP Rewards**: Automatic NFT minting for event attendees as proof of attendance
- **💎 Collectibles**: View and manage your earned NFTs and POAPs
- **💱 Stellar Integration**: Freighter wallet support with XLM payments
- **📱 Mobile-First**: Responsive design optimized for mobile experiences

### 🎨 Design System

- **Visual Language**: Dark UI with Urbanist typography, rounded cards, subtle glass effects
- **Color Palette**: 
  - Background: `#000000`
  - Surfaces: `#404040`, `#C1C1C1` 
  - Text: `#FEFEFE`
  - Accent: `#F2F862` (Kaizen Yellow)

## 🏗️ Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Stellar SDK** - Blockchain integration
- **Freighter** - Wallet connection

### Backend
- **Node.js + Express** - API server
- **MongoDB** - Off-chain data storage
- **JWT** - Authentication

### Blockchain
- **Soroban** - Smart contracts (Rust)
- **Stellar Testnet** - Deployment network

## � Quick Start

### Prerequisites
- Node.js 18+
- Rust toolchain
- Stellar CLI
- MongoDB connection

### 1. Clone & Install

```bash
git clone https://github.com/somewherelostt/KaizenX.git
cd kaizen-web3-app

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Environment Setup

Create `.env.local` in the root:

```env
# Database
DATABASE_URL=mongodb://your-mongo-connection-string

# JWT Secret
JWT_SECRET=your-jwt-secret-key

# Stellar Contracts (will be set after deployment)
NEXT_PUBLIC_KAIZEN_EVENT_CONTRACT=CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 3. Deploy Smart Contract

```bash
cd contracts

# Build the contract
stellar contract build

# Deploy (Windows)
./scripts/deploy.bat

# Or deploy (Linux/Mac)
./scripts/deploy.sh
```

Copy the returned contract address to your `.env.local` file.

### 4. Start Development

```bash
# Start backend
cd backend
npm run dev

# Start frontend (new terminal)
npm run dev
```

Visit `http://localhost:3000` 🎉

## 📱 Core User Flows

### For Event Organizers
1. Create account and connect Stellar wallet
2. List new event with details and pricing
3. Contract automatically deployed for the event
4. Optionally configure NFT/POAP rewards
5. Receive XLM payments when users join

### For Event Attendees  
1. Browse events by category
2. Connect Freighter wallet
3. Click "Join" to purchase ticket + join blockchain event
4. Automatic POAP minting upon successful join
5. View collected NFTs in profile

## � Smart Contract Architecture

### Kaizen Event Contract (`kaizen_event`)

Each event gets its own contract instance for security and simplicity.

**Key Functions:**
- `init(organizer, name, token?)` - Initialize event with optional POAP contract
- `join(attendee)` - User joins event, mints POAP if configured  
- `has_joined(addr)` - Check if address joined
- `info()` - Get event details (name, organizer, join count)

**Security Features:**
- Host-managed authentication via `require_auth()`
- Prevents double-joining
- Only organizer can modify settings

## 🎨 UI Components

### Key Screens
- **Home/Discover**: Event feed with category filters and search
- **Event Detail**: Full event info with join CTA and attendee previews  
- **Calendar**: Date-based event browsing
- **Profile**: User's collected POAPs and event history
- **Transaction Drawer**: Real-time transaction status with explorer links

### Design Patterns
- 44px minimum touch targets
- Optimistic UI with loading states
- Toast notifications for actions
- Glass morphism effects with subtle glows

## � Wallet Integration

### Supported Wallets
- **Freighter** (Primary)
- Wallet Standard support planned

### Transaction Flow
1. User clicks "Join Event" 
2. Payment transaction (if event has cost)
3. Smart contract `join()` call with user auth
4. POAP minting (if configured)
5. Success confirmation with tx hash

## 📊 Database Schema

### Events (MongoDB)
```javascript
{
  title: String,
  description: String,  
  date: Date,
  location: String,
  price: Number,
  seats: Number,
  category: String,
  imageUrl: String,
  createdBy: ObjectId, // User reference
  contractAddress: String // Deployed contract
}
```

### Users (MongoDB)
```javascript
{
  username: String,
  email: String,
  walletAddress: String,
  imageUrl: String
}
```

## 🌐 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy build folder
```

### Backend (Railway/Heroku)
```bash
cd backend
# Set environment variables
# Deploy via platform
```

### Contracts (Stellar Testnet)
```bash
cd contracts
stellar contract deploy --wasm target/wasm32-unknown-unknown/release/kaizen_event.wasm --network testnet --source your-key
```

## 🧪 Testing

```bash
# Frontend tests
npm test

# Contract tests  
cd contracts
cargo test

# E2E tests
npm run test:e2e
```

## 🏆 Hackathon Focus

Kaizen showcases the power of Stellar for:

### ✅ Cross-border Event Ticketing
- Global XLM payments without traditional payment processors
- Instant settlement and low fees
- Universal access regardless of banking infrastructure

### ✅ Decentralized Asset Distribution  
- Automatic POAP minting through smart contracts
- Verifiable proof of attendance on blockchain
- Composable NFT metadata and utilities

### ✅ Real-World Web3 UX
- Modern mobile-first interface
- Seamless wallet integration
- Transaction status tracking with explorer links

### ✅ Smart Contract Innovation
- One-contract-per-event architecture for security
- Host-managed authentication with Stellar
- Optional token/NFT reward configuration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## � Links

- **Live Demo**: [https://kaizen-web3.vercel.app](https://kaizen-web3.vercel.app)
- **Contract Explorer**: [https://stellar.expert/explorer/testnet](https://stellar.expert/explorer/testnet)
- **Documentation**: [Stellar Developer Docs](https://developers.stellar.org)

## 💡 Roadmap

- [ ] Multi-wallet support (Lobstr, Rabet)  
- [ ] Event ticket resale marketplace
- [ ] Advanced POAP metadata and rarity
- [ ] DAO governance for platform decisions
- [ ] Mainnet deployment
- [ ] Mobile apps (React Native)

---

**Built with ❤️ for the Stellar ecosystem**

For questions or support, reach out to [@somewherelostt](https://github.com/somewherelostt)
