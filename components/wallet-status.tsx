"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Wallet, Copy, ExternalLink, LogOut, RefreshCw } from "lucide-react"
import { useWallet } from "@/contexts/WalletContext"

interface WalletStatusProps {
  onConnect: () => void
}

export function WalletStatus({ onConnect }: WalletStatusProps) {
  const { isConnected, walletName, address, balance, isLoading, disconnectWallet, refreshBalance } = useWallet()
  const [showDetails, setShowDetails] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const detailsRef = useRef<HTMLDivElement>(null)

  // Close details when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
        setShowDetails(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      } catch (err) {
        console.error('Failed to copy address:', err)
      }
    }
  }

  const handleDisconnect = () => {
    disconnectWallet()
    setShowDetails(false)
  }

  const handleRefreshBalance = async () => {
    await refreshBalance()
  }

  const openStellarExplorer = () => {
    if (address) {
      window.open(`https://stellar.expert/explorer/testnet/account/${address}`, '_blank')
    }
  }

  if (!isConnected) {
    return (
      <Button
        onClick={onConnect}
        disabled={isLoading}
        className="bg-kaizen-yellow text-kaizen-black hover:bg-kaizen-yellow/90 font-semibold rounded-full flex items-center gap-2"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-kaizen-black border-t-transparent rounded-full animate-spin" />
        ) : (
          <Wallet className="w-4 h-4" />
        )}
        {isLoading ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    )
  }

  return (
    <div className="relative" ref={detailsRef}>
      <Button
        onClick={() => setShowDetails(!showDetails)}
        variant="outline"
        className="bg-kaizen-dark-gray border-kaizen-gray/30 text-kaizen-white hover:bg-kaizen-gray/20 rounded-full flex items-center gap-2"
      >
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        {address && truncateAddress(address)}
      </Button>

      {showDetails && (
        <Card className="absolute top-12 right-0 bg-kaizen-dark-gray border-kaizen-gray/30 rounded-2xl p-4 min-w-64 z-10 shadow-xl">
          <div className="space-y-4">
            {/* Wallet Info */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-kaizen-yellow rounded-full flex items-center justify-center">
                <Wallet className="w-4 h-4 text-kaizen-black" />
              </div>
              <div>
                <p className="text-kaizen-white font-semibold text-sm">{walletName}</p>
                <p className="text-green-400 text-xs flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Connected to Testnet
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <p className="text-kaizen-gray text-xs">Address</p>
              <div className="flex items-center gap-2">
                <code className="text-kaizen-white text-xs bg-kaizen-black/50 px-2 py-1 rounded flex-1">
                  {address && truncateAddress(address)}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyAddress}
                  className="w-6 h-6 text-kaizen-gray hover:text-kaizen-white"
                  title="Copy full address"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={openStellarExplorer}
                  className="w-6 h-6 text-kaizen-gray hover:text-kaizen-white"
                  title="View on Stellar Expert"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
              {copySuccess && (
                <p className="text-green-400 text-xs">Address copied to clipboard!</p>
              )}
            </div>

            {/* Balance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-kaizen-gray text-xs">Balance</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRefreshBalance}
                  disabled={isLoading}
                  className="w-5 h-5 text-kaizen-gray hover:text-kaizen-white"
                  title="Refresh balance"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              <p className="text-kaizen-white font-semibold flex items-center gap-2">
                {balance} XLM
                {isLoading && (
                  <div className="w-3 h-3 border border-kaizen-gray border-t-kaizen-yellow rounded-full animate-spin" />
                )}
              </p>
              {parseFloat(balance) === 0 && (
                <p className="text-kaizen-gray text-xs">
                  Get testnet XLM from the{' '}
                  <a 
                    href="https://laboratory.stellar.org/#account-creator?network=test" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-kaizen-yellow hover:underline"
                  >
                    Stellar Lab
                  </a>
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-kaizen-gray/20">
              <Button
                onClick={handleDisconnect}
                variant="ghost"
                className="w-full text-red-400 hover:text-red-300 hover:bg-red-400/10 justify-start"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
