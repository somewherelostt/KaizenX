# Kaizen Web3 Event Platform

Kaizen is a full-stack web3 application built for the Stellar blockchain hackathon. It empowers event organizers to list events, create NFTs and tokens, and enables attendees to join events and claim on-chain rewards. All core actions—event creation, attendance, NFT minting, and token distribution—are performed on the Stellar blockchain, leveraging wallet integrations and Soroban smart contracts.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- MongoDB or PostgreSQL
- Git
- Rust (for smart contracts)

### Setup
```bash
# Clone and setup
git clone <your-repo>
cd kaizen-web3-app

# Auto setup (Windows)
setup.bat

# Auto setup (Linux/Mac)
chmod +x setup.sh
./setup.sh

# Manual setup
pnpm install
cd backend && npm install
```

### Running the Application
```bash
# Terminal 1: Start frontend
pnpm run dev

# Terminal 2: Start backend
cd backend
npm run dev

# Terminal 3: Start MongoDB (if using MongoDB)
mongod
```

Visit: http://localhost:3000

## 📋 Features

### Core Features
- **Event Management**: Create, list, and manage events
- **Web3 Wallet Integration**: Freighter, Albedo, Lobstr support
- **Ticket Purchasing**: Buy tickets with XLM cryptocurrency
- **NFT Rewards**: Commemorative NFTs for event attendees
- **Token Rewards**: Earn KZR tokens for event participation
- **User Profiles**: Track events, NFTs, and token balance

### Blockchain Features
- **Smart Contracts**: Soroban contracts on Stellar testnet
- **Decentralized Storage**: On-chain event and ticket data
- **Cross-border Payments**: Instant XLM transactions
- **Asset Tokenization**: Custom NFTs and reward tokens

## 🏗️ Architecture

### Frontend (Next.js)
```
app/
├── page.tsx              # Home page with event listings
├── event/[id]/page.tsx   # Event details
├── event/create/page.tsx # Create new events
├── calendar/page.tsx     # Calendar view
├── profile/page.tsx      # User profile
└── search/page.tsx       # Search events
```

### Backend (Node.js/Express)
```
backend/src/
├── index.js              # Main server
├── auth.js               # Authentication
├── upload.js             # File uploads
└── models/
    ├── User.js           # User schema
    └── Event.js          # Event schema
```

### Smart Contracts (Soroban)
```
contracts/src/
├── event_manager.rs      # Event creation & ticketing
├── nft_minter.rs         # NFT minting for events
└── token_rewards.rs      # Reward token distribution
```

## 🔧 Technologies

### Frontend Stack
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **Stellar SDK** - Blockchain integration

### Backend Stack
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB/PostgreSQL** - Database
- **JWT** - Authentication
- **Multer** - File uploads

### Blockchain Stack
- **Stellar Network** - Blockchain platform
- **Soroban** - Smart contract platform
- **Freighter Wallet** - Primary wallet
- **Horizon API** - Stellar data access

## 📱 Usage Guide

### For Event Organizers

1. **Connect Wallet**: Use Freighter wallet extension
2. **Create Event**: Navigate to "Create Event"
3. **Set Details**: Title, date, location, price
4. **Deploy Assets**: Automatically create NFTs and set rewards
5. **Monitor**: Track ticket sales and attendees

### For Event Attendees

1. **Browse Events**: Discover events on homepage
2. **Connect Wallet**: Link your Stellar wallet
3. **Buy Ticket**: Purchase with XLM
4. **Attend Event**: Check-in using blockchain ticket
5. **Claim Rewards**: Get NFTs and reward tokens

## 🔐 Smart Contract Integration

### Contract Addresses (Testnet)
```env
NEXT_PUBLIC_EVENT_MANAGER_CONTRACT=CDXXXXXX...
NEXT_PUBLIC_NFT_MINTER_CONTRACT=CDXXXXXX...
NEXT_PUBLIC_TOKEN_REWARDS_CONTRACT=CDXXXXXX...
```

### Key Functions
```typescript
// Create event on blockchain
const result = await createEventOnChain(
  organizerAddress,
  title,
  description,
  date,
  location,
  price,
  maxAttendees,
  tokenReward
)

// Purchase ticket
const ticket = await purchaseTicketOnChain(eventId, userAddress)

// Mint NFT reward
const nft = await mintEventNFT(userAddress, eventId, metadata)

// Claim reward tokens
const tokens = await claimEventReward(userAddress, eventId)
```

## 🚀 Deployment

### Smart Contracts
```bash
cd contracts
cargo build --target wasm32-unknown-unknown --release
./scripts/deploy.sh
```

### Frontend (Vercel)
```bash
pnpm run build
# Deploy to Vercel or your preferred platform
```

### Backend (VPS/Cloud)
```bash
cd backend
npm run build
# Deploy to your preferred cloud provider
```

## 🔍 Testing

### Frontend Tests
```bash
pnpm run test
```

### Backend Tests
```bash
cd backend
npm run test
```

### Contract Tests
```bash
cd contracts
cargo test
```

### End-to-End Testing
```bash
# Start all services
pnpm run dev & cd backend && npm run dev &

# Run E2E tests
pnpm run test:e2e
```

## 🌐 Environment Configuration

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_EVENT_MANAGER_CONTRACT=CDXXXXXX...
NEXT_PUBLIC_NFT_MINTER_CONTRACT=CDXXXXXX...
NEXT_PUBLIC_TOKEN_REWARDS_CONTRACT=CDXXXXXX...
```

### Backend (.env)
```env
DB_URL=mongodb://localhost:27017/kaizen-web3
JWT_SECRET=your-secret-key
PORT=4000
NODE_ENV=development
```

## 📚 API Documentation

### Event Endpoints
- `GET /api/events` - List all events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### User Endpoints
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/users/me` - Get current user

### Upload Endpoints
- `POST /api/events/:id/image` - Upload event image
- `POST /api/users/:id/image` - Upload profile image

## 🐛 Troubleshooting

### Common Issues

1. **Wallet Connection Failed**
   - Install Freighter browser extension
   - Switch to Stellar testnet
   - Ensure account has XLM balance

2. **Contract Deployment Issues**
   - Verify Rust/Soroban installation
   - Check network configuration
   - Ensure sufficient XLM for fees

3. **Database Connection**
   - Start MongoDB service
   - Check connection string
   - Verify database exists

4. **Build Failures**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify environment variables

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed solutions.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

### Development Guidelines
- Follow TypeScript best practices
- Add comprehensive tests
- Update documentation
- Ensure security compliance

## 📄 License

MIT License - see [LICENSE](./LICENSE) file

## 🏆 Hackathon Focus

Kaizen is designed to showcase:

### ✅ Cross-border Payments
- Instant XLM payments for tickets
- No traditional payment processor fees
- Global accessibility regardless of location

### ✅ Decentralized Event Management  
- On-chain event creation and ticketing
- Immutable event records
- Trustless ticket verification

### ✅ Asset Tokenization
- Custom NFTs for event memorabilia
- Fungible reward tokens (KZR)
- Real-time blockchain transactions

### ✅ Seamless Web3 Integration
- Modern React frontend with wallet connectivity
- Intuitive user experience
- Mobile-responsive design

## 📞 Support

- **Documentation**: Check README files in each directory
- **Issues**: GitHub Issues
- **Discord**: [Stellar Dev Discord](https://discord.gg/stellar-dev)
- **Email**: your-email@example.com

---

**Built with ❤️ for the Stellar Hackathon 2025**
