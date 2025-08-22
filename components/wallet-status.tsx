"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Wallet, Copy, ExternalLink, LogOut } from "lucide-react"

interface WalletStatusProps {
  isConnected: boolean
  walletName?: string
  address?: string
  balance?: string
  onConnect: () => void
  onDisconnect: () => void
}

export function WalletStatus({
  isConnected,
  walletName,
  address,
  balance,
  onConnect,
  onDisconnect,
}: WalletStatusProps) {
  const [showDetails, setShowDetails] = useState(false)

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  if (!isConnected) {
    return (
      <Button
        onClick={onConnect}
        className="bg-kaizen-yellow text-kaizen-black hover:bg-kaizen-yellow/90 font-semibold rounded-full flex items-center gap-2"
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </Button>
    )
  }

  return (
    <div className="relative">
      <Button
        onClick={() => setShowDetails(!showDetails)}
        variant="outline"
        className="bg-kaizen-dark-gray border-kaizen-gray/30 text-kaizen-white hover:bg-kaizen-gray/20 rounded-full flex items-center gap-2"
      >
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        {address && truncateAddress(address)}
      </Button>

      {showDetails && (
        <Card className="absolute top-12 right-0 bg-kaizen-dark-gray border-kaizen-gray/30 rounded-2xl p-4 min-w-64 z-10">
          <div className="space-y-4">
            {/* Wallet Info */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-kaizen-yellow rounded-full flex items-center justify-center">
                <Wallet className="w-4 h-4 text-kaizen-black" />
              </div>
              <div>
                <p className="text-kaizen-white font-semibold text-sm">{walletName}</p>
                <p className="text-kaizen-gray text-xs">Connected</p>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <p className="text-kaizen-gray text-xs">Address</p>
              <div className="flex items-center gap-2">
                <code className="text-kaizen-white text-xs bg-kaizen-black/50 px-2 py-1 rounded">
                  {address && truncateAddress(address)}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyAddress}
                  className="w-6 h-6 text-kaizen-gray hover:text-kaizen-white"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="icon" className="w-6 h-6 text-kaizen-gray hover:text-kaizen-white">
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Balance */}
            <div className="space-y-2">
              <p className="text-kaizen-gray text-xs">Balance</p>
              <p className="text-kaizen-white font-semibold">{balance} XLM</p>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-kaizen-gray/20">
              <Button
                onClick={onDisconnect}
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
