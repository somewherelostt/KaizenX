# 🚀 Kaizen Event Platform - Judge Testing Guide

## 🌟 **For Judges: How to Test the Platform**

### 📱 **Step 1: Set Up Stellar Testnet Wallet**

**Option A: Freighter Wallet (Recommended)**
1. Install [Freighter Browser Extension](https://freighter.app/)
2. Create a new wallet or import existing one
3. Switch to **Testnet** in Freighter settings
4. Get free testnet XLM: Visit [Stellar Laboratory Friendbot](https://laboratory.stellar.org/#account-creator?network=test)
   - Enter your public key
   - Click "Get test network lumens"

**Option B: Albedo Wallet**
1. Go to [Albedo.link](https://albedo.link/)
2. Create new account
3. Select "Testnet" network
4. Fund account using Friendbot (same as above)

### 🎯 **Step 2: Test Event Joining**

1. **Visit the Platform**: [Your Vercel URL here]
2. **Browse Events**: View available events with different pricing
3. **Connect Wallet**: Click "Connect Wallet" and approve connection
4. **Join an Event**: 
   - Click "Join" on any event
   - Review the pricing (will deduct exact amount shown)
   - Confirm transaction in wallet
   - Get transaction hash for verification

### 🔍 **Step 3: Verify on Blockchain**

**Every event join creates a verifiable transaction:**
1. Copy transaction hash from success screen
2. Visit: `https://stellar.expert/explorer/testnet/tx/{TRANSACTION_HASH}`
3. **You'll see:**
   - ✅ Transaction amount matches event price
   - ✅ Payment to event organizer (for paid events)
   - ✅ Memo with event join proof
   - ✅ Timestamp and all transaction details

### 💰 **Event Pricing Examples**

| Event Type | Price | What Happens |
|------------|-------|--------------|
| Free Event | 0 XLM | Minimal transaction (0.0000001 XLM to self) + memo |
| Paid Event | 5 XLM | 5 XLM sent to organizer + memo |
| Premium Event | 25 XLM | 25 XLM sent to organizer + memo |

### 🔒 **Security & Verification**

- **All transactions are on Stellar Testnet** (100% safe, no real money)
- **Fully transparent**: Every action recorded on blockchain
- **Memo field proves event participation**: `JOIN_EVENT_{ID}_{TITLE}_{TIMESTAMP}`
- **Organizer payments**: Automatically sent to correct addresses

### 🌍 **Multi-User Testing**

- **Each judge can use their own wallet**
- **All wallets work independently**  
- **No setup conflicts between users**
- **Each transaction is unique and verifiable**

---

## 🚨 **Quick Testnet Setup (30 seconds)**

```bash
1. Install Freighter: https://freighter.app/
2. Create new wallet → Switch to Testnet
3. Fund wallet: https://laboratory.stellar.org/#account-creator?network=test
4. Done! Ready to test 🎉
```

## 🔗 **Useful Links**

- **Stellar Expert (Testnet)**: https://stellar.expert/explorer/testnet/
- **Freighter Wallet**: https://freighter.app/
- **Stellar Testnet Faucet**: https://laboratory.stellar.org/#account-creator?network=test
