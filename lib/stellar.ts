import {
  Horizon,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  TimeoutInfinite,
  Address,
  Transaction,
  Operation,
  Asset,
  Keypair,
  Memo,
  Contract,
} from '@stellar/stellar-sdk'
import * as FreighterApi from '@stellar/freighter-api'

// Stellar testnet configuration  
export const server = new Horizon.Server('https://horizon-testnet.stellar.org')
export const networkPassphrase = Networks.TESTNET

// Contract addresses (these should be set from environment variables)
export const CONTRACT_ADDRESSES = {
  KAIZEN_EVENT: process.env.NEXT_PUBLIC_KAIZEN_EVENT_CONTRACT || '',
}

// Helper function to build contract invocation transaction
async function buildContractTransaction(
  contractAddress: string,
  method: string,
  args: any[],
  source: string
): Promise<Transaction> {
  const account = await server.loadAccount(source)
  
  const contract = new Contract(contractAddress)
  const operation = contract.call(method, ...args)
  
  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(operation)
    .setTimeout(TimeoutInfinite)
    .build()
    
  return transaction
}

/**
 * Initialize a new event contract
 */
export async function initializeEventContract(
  organizerAddress: string,
  eventName: string,
  tokenAddress?: string
) {
  try {
    if (!CONTRACT_ADDRESSES.KAIZEN_EVENT) {
      throw new Error('Contract address not configured')
    }

    const args = [
      new Address(organizerAddress),
      eventName,
      tokenAddress ? new Address(tokenAddress) : null
    ]

    const transaction = await buildContractTransaction(
      CONTRACT_ADDRESSES.KAIZEN_EVENT,
      'init',
      args,
      organizerAddress
    )

    // Sign with Freighter
    const { signedTxXdr } = await FreighterApi.signTransaction(
      transaction.toXDR(),
      { networkPassphrase, address: organizerAddress }
    )

    // Submit transaction
    const signedTransaction = new Transaction(signedTxXdr, networkPassphrase)
    const result = await server.submitTransaction(signedTransaction)
    
    if (result.successful) {
      return {
        success: true,
        transactionHash: result.hash,
      }
    } else {
      throw new Error('Transaction failed')
    }
  } catch (error) {
    console.error('Init event contract error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Join an event with payment (main user action) - Fixed to handle event pricing
 */
export async function joinEvent(
  attendeeAddress: string,
  eventId: number = 1,
  eventPrice?: string,
  organizerAddress?: string,
  eventTitle?: string
) {
  try {
    // Create a short memo (max 28 bytes for Stellar) - format: "JOIN_E1_123456"
    const timestamp = Date.now().toString().slice(-6)
    const eventJoinMemo = `JOIN_E${eventId}_${timestamp}`
    
    // Determine payment details
    let recipientAddress = attendeeAddress // Default: send to self (free events)
    let paymentAmount = "0.0000001" // Minimal amount for free events
    
    // If event has a price, send payment to organizer
    if (eventPrice && eventPrice !== "Free" && organizerAddress) {
      recipientAddress = organizerAddress
      paymentAmount = eventPrice.replace(' XLM', '')
    }
    
    // Create the transaction
    const result = await sendPayment(
      recipientAddress,
      paymentAmount,
      eventJoinMemo
    )

    if (result.success) {
      return {
        success: true,
        transactionHash: result.transactionHash,
        ledger: 0,
      }
    } else {
      throw new Error(result.error || 'Transaction failed')
    }
  } catch (error) {
    console.error('Join event error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Check if user has joined the event
 */
export async function hasJoinedEvent(userAddress: string, eventId: number = 1): Promise<boolean> {
  try {
    if (!CONTRACT_ADDRESSES.KAIZEN_EVENT) {
      return false
    }

    const args = [new Address(userAddress), eventId]
    
    const transaction = await buildContractTransaction(
      CONTRACT_ADDRESSES.KAIZEN_EVENT,
      'has_ticket',
      args,
      userAddress
    )

    // This would need to be a read-only call in a real implementation
    // For now, return false as we can't easily make read calls without simulation
    return false
  } catch (error) {
    console.error('Check joined status error:', error)
    return false
  }
}

/**
 * Get event info from contract
 */
export async function getEventInfo() {
  try {
    if (!CONTRACT_ADDRESSES.KAIZEN_EVENT) {
      return null
    }

    // This would need proper contract read implementation
    // For now, return mock data
    return {
      name: 'Mock Event',
      organizer: 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      tokenAddress: null,
      joinCount: 0
    }
  } catch (error) {
    console.error('Get event info error:', error)
    return null
  }
}

// Basic Stellar Functions for now - Smart contract integration to be added later

/**
 * Send XLM payment (for ticket purchases)
 */
export async function sendPayment(
  recipientAddress: string,
  amount: string,
  memo?: string
) {
  try {
    const { address } = await FreighterApi.requestAccess()
    const account = await server.loadAccount(address)

    const transaction = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase,
    })
      .addOperation(
        Operation.payment({
          destination: recipientAddress,
          asset: Asset.native(),
          amount: amount,
        })
      )
      .setTimeout(TimeoutInfinite)

    if (memo) {
      // Ensure memo is within Stellar's 28-byte limit
      const truncatedMemo = memo.length > 28 ? memo.substring(0, 28) : memo
      transaction.addMemo(Memo.text(truncatedMemo))
    }

    const builtTransaction = transaction.build()

    // Sign transaction with Freighter
    const { signedTxXdr } = await FreighterApi.signTransaction(builtTransaction.toXDR(), {
      networkPassphrase,
      address: address,
    })

    // Submit transaction
    const signedTransaction = new Transaction(signedTxXdr, networkPassphrase)
    const result = await server.submitTransaction(signedTransaction)
    
    if (result.successful) {
      return {
        success: true,
        transactionHash: result.hash,
      }
    } else {
      throw new Error('Transaction failed')
    }
  } catch (error) {
    console.error('Send payment error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get account balance
 */
export async function getAccountBalance(publicKey: string) {
  try {
    const account = await server.loadAccount(publicKey)
    const balance = account.balances.find((b: any) => b.asset_type === 'native')
    return {
      success: true,
      balance: balance ? parseFloat(balance.balance) : 0,
    }
  } catch (error) {
    console.error('Get balance error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      balance: 0,
    }
  }
}

/**
 * Create test account (for development)
 */
export async function createTestAccount() {
  try {
    const keypair = Keypair.random()
    
    // Fund account using Friendbot
    await fetch(`https://friendbot.stellar.org?addr=${keypair.publicKey()}`)
    
    return {
      success: true,
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret(),
    }
  } catch (error) {
    console.error('Create test account error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Placeholder functions for smart contract integration
// These will be implemented once contracts are deployed

/**
 * Create a new event on the blockchain (placeholder)
 */
export async function createEventOnChain(
  organizerAddress: string,
  title: string,
  description: string,
  date: number,
  location: string,
  price: number,
  maxAttendees: number,
  tokenRewardAmount: number
) {
  console.log('Creating event on chain:', { title, organizerAddress })
  
  // For now, return mock success
  return {
    success: true,
    transactionHash: 'mock_hash_' + Date.now(),
    eventId: Math.floor(Math.random() * 1000) + 1,
  }
}

/**
 * Purchase a ticket for an event (placeholder)
 */
export async function purchaseTicketOnChain(eventId: number, attendeeAddress: string) {
  console.log('Purchasing ticket on chain:', { eventId, attendeeAddress })
  
  // For now, just send a payment and return mock data
  try {
    // This could be enhanced to send payment to event organizer
    return {
      success: true,
      transactionHash: 'mock_ticket_hash_' + Date.now(),
      ticketId: eventId * 1000 + Math.floor(Math.random() * 1000),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Mint NFT for event attendee (placeholder)
 */
export async function mintEventNFT(
  recipientAddress: string,
  eventId: number,
  name: string,
  description: string,
  imageUrl: string
) {
  console.log('Minting NFT:', { recipientAddress, eventId, name })
  
  return {
    success: true,
    transactionHash: 'mock_nft_hash_' + Date.now(),
    tokenId: Math.floor(Math.random() * 10000) + 1,
  }
}

/**
 * Claim event reward tokens (placeholder)
 */
export async function claimEventReward(userAddress: string, eventId: number) {
  console.log('Claiming reward:', { userAddress, eventId })
  
  return {
    success: true,
    transactionHash: 'mock_reward_hash_' + Date.now(),
    rewardAmount: 100 * 10000000, // 100 tokens in stroops
  }
}

/**
 * Get event details from smart contract (placeholder)
 */
export async function getEventDetails(eventId: number) {
  console.log('Getting event details for:', eventId)
  return {
    success: true,
    event: {
      id: eventId,
      title: 'Mock Event',
      description: 'Mock Description',
      // ... other event data
    },
  }
}

/**
 * Get user's NFTs (placeholder)
 */
export async function getUserNFTs(userAddress: string) {
  console.log('Getting NFTs for user:', userAddress)
  return {
    success: true,
    nfts: [],
  }
}

/**
 * Get user's token balance (placeholder)
 */
export async function getUserTokenBalance(userAddress: string) {
  console.log('Getting token balance for user:', userAddress)
  return {
    success: true,
    balance: 0,
  }
}

/**
 * Utility function to format Stellar amounts
 */
export function formatStellarAmount(amount: number): string {
  return amount.toFixed(7)
}

/**
 * Utility function to parse Stellar amounts  
 */
export function parseStellarAmount(amount: string): number {
  return parseFloat(amount)
}

/**
 * Validate Stellar address
 */
export function isValidStellarAddress(address: string): boolean {
  try {
    new Address(address)
    return true
  } catch {
    return false
  }
}