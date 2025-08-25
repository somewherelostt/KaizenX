"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Horizon } from '@stellar/stellar-sdk'
import * as FreighterApi from '@stellar/freighter-api'

interface WalletState {
  isConnected: boolean
  walletName: string
  address: string
  balance: string
  isLoading: boolean
  error: string | null
}

interface WalletContextType extends WalletState {
  connectWallet: (walletName: string) => Promise<boolean>
  disconnectWallet: () => void
  refreshBalance: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    walletName: '',
    address: '',
    balance: '0',
    isLoading: false,
    error: null,
  })

  // Stellar testnet server
  const server = new Horizon.Server('https://horizon-testnet.stellar.org')

  // Check for existing wallet connection on app start
  useEffect(() => {
    checkExistingConnection()
  }, [])

  const checkExistingConnection = async () => {
    try {
      // Check if we have stored wallet info
      const storedWallet = localStorage.getItem('kaizen-wallet')
      if (!storedWallet) return

      const { walletName, address } = JSON.parse(storedWallet)
      
      if (walletName === 'Freighter') {
        // Verify Freighter is still connected
        const isConnected = await FreighterApi.isConnected()
        if (isConnected) {
          setWalletState(prev => ({
            ...prev,
            isConnected: true,
            walletName,
            address,
            isLoading: true,
          }))
          
          // Fetch current balance
          await fetchBalance(address)
        } else {
          // Clean up if not connected
          localStorage.removeItem('kaizen-wallet')
        }
      }
    } catch (error) {
      console.error('Error checking existing connection:', error)
      localStorage.removeItem('kaizen-wallet')
    }
  }

  const fetchBalance = async (publicKey: string) => {
    try {
      const account = await server.loadAccount(publicKey)
      const xlmBalance = account.balances.find((b: any) => b.asset_type === 'native')
      const balance = xlmBalance ? parseFloat(xlmBalance.balance).toFixed(2) : '0.00'
      
      setWalletState(prev => ({
        ...prev,
        balance,
        isLoading: false,
        error: null,
      }))
    } catch (error: any) {
      console.error('Error fetching balance:', error)
      
      // If account doesn't exist on testnet, that's fine - balance is 0
      if (error.message?.includes('not found') || error.response?.status === 404) {
        setWalletState(prev => ({
          ...prev,
          balance: '0.00',
          isLoading: false,
          error: null,
        }))
      } else {
        setWalletState(prev => ({
          ...prev,
          balance: '0.00',
          isLoading: false,
          error: 'Failed to fetch balance',
        }))
      }
    }
  }

  const connectWallet = async (walletName: string): Promise<boolean> => {
    setWalletState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      let publicKey = ''

      if (walletName === 'Freighter') {
        // Check if Freighter extension is available and request access
        const accessResult = await FreighterApi.requestAccess()
        
        if (accessResult.error) {
          throw new Error(accessResult.error || 'Freighter access denied')
        }
        
        publicKey = accessResult.address || ''

        if (!publicKey) {
          throw new Error('No public key received from Freighter')
        }
      } else if (walletName === 'Albedo') {
        // Implement Albedo connection
        throw new Error('Albedo wallet integration coming soon')
      } else if (walletName === 'Lobstr') {
        // Implement Lobstr connection  
        throw new Error('Lobstr wallet integration coming soon')
      }

      // Store wallet info
      localStorage.setItem('kaizen-wallet', JSON.stringify({
        walletName,
        address: publicKey,
      }))

      setWalletState(prev => ({
        ...prev,
        isConnected: true,
        walletName,
        address: publicKey,
      }))

      // Fetch balance
      await fetchBalance(publicKey)
      
      return true
    } catch (error: any) {
      console.error('Wallet connection error:', error)
      
      let errorMessage = 'Failed to connect wallet'
      
      if (error.message?.includes('not found') || error.message?.includes('not available')) {
        errorMessage = 'Please install the Freighter wallet extension first!'
      } else if (error.message?.includes('rejected') || error.message?.includes('denied')) {
        errorMessage = 'Wallet connection was rejected. Please try again and approve the connection.'
      } else if (error.message) {
        errorMessage = error.message
      }

      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }))

      return false
    }
  }

  const disconnectWallet = () => {
    // Clear stored wallet info
    localStorage.removeItem('kaizen-wallet')
    
    setWalletState({
      isConnected: false,
      walletName: '',
      address: '',
      balance: '0',
      isLoading: false,
      error: null,
    })
  }

  const refreshBalance = async () => {
    if (walletState.address) {
      setWalletState(prev => ({ ...prev, isLoading: true }))
      await fetchBalance(walletState.address)
    }
  }

  const contextValue: WalletContextType = {
    ...walletState,
    connectWallet,
    disconnectWallet,
    refreshBalance,
  }

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  )
}
