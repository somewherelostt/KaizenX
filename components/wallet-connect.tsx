"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Check, ExternalLink, AlertCircle } from "lucide-react"
import { useWallet } from "@/contexts/WalletContext"

interface WalletConnectProps {
  isOpen: boolean
  onClose: () => void
}

export function WalletConnect({ isOpen, onClose }: WalletConnectProps) {
  const { connectWallet, error, isLoading } = useWallet()
  const [connecting, setConnecting] = useState<string | null>(null)

  const wallets = [
    {
      name: "Freighter",
      icon: "/freighter-wallet.png",
      description: "Stellar wallet browser extension",
      installed: true,
    },
    {
      name: "Albedo",
      icon: "/albedo-wallet-interface.png", 
      description: "Web-based Stellar wallet",
      installed: false,
      comingSoon: true,
    },
    {
      name: "Lobstr",
      icon: "/lobstr-wallet-app.png",
      description: "Mobile Stellar wallet",
      installed: false,
      comingSoon: true,
    },
  ]

  const handleConnect = async (walletName: string) => {
    if (connecting || isLoading) return
    
    setConnecting(walletName)
    
    try {
      const success = await connectWallet(walletName)
      if (success) {
        onClose()
      }
    } catch (err) {
      console.error('Connection failed:', err)
    } finally {
      setConnecting(null)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="bg-kaizen-dark-gray border-none rounded-3xl w-full max-w-sm">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-kaizen-white font-bold text-xl">Connect Wallet</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-kaizen-gray hover:text-kaizen-white hover:bg-kaizen-gray/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Description */}
          <p className="text-kaizen-gray text-sm mb-6">
            Connect your Stellar wallet to buy tickets and collect event NFTs
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Wallet Options */}
          <div className="space-y-3">
            {wallets.map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => wallet.installed && !wallet.comingSoon && handleConnect(wallet.name)}
                disabled={!wallet.installed || wallet.comingSoon || connecting !== null || isLoading}
                className={`w-full p-4 rounded-2xl border transition-colors ${
                  wallet.installed && !wallet.comingSoon
                    ? "border-kaizen-gray/30 hover:border-kaizen-yellow bg-kaizen-black/50 hover:bg-kaizen-yellow/10"
                    : "border-kaizen-gray/20 bg-kaizen-gray/10 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={wallet.icon || "/placeholder.svg"} alt={wallet.name} className="w-10 h-10 rounded-xl" />
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold ${wallet.installed && !wallet.comingSoon ? "text-kaizen-white" : "text-kaizen-gray"}`}>
                        {wallet.name}
                      </h3>
                      {wallet.comingSoon && (
                        <span className="text-xs px-2 py-1 bg-kaizen-yellow/20 text-kaizen-yellow rounded-full">
                          Soon
                        </span>
                      )}
                    </div>
                    <p className="text-kaizen-gray text-sm">{wallet.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {connecting === wallet.name ? (
                      <div className="w-5 h-5 border-2 border-kaizen-yellow border-t-transparent rounded-full animate-spin" />
                    ) : wallet.installed && !wallet.comingSoon ? (
                      <Check className="w-5 h-5 text-kaizen-yellow" />
                    ) : (
                      <ExternalLink className="w-4 h-4 text-kaizen-gray" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Instructions for Freighter */}
          <div className="mt-6 p-4 bg-kaizen-black/50 rounded-lg">
            <h4 className="text-kaizen-white text-sm font-semibold mb-2">Don't have Freighter?</h4>
            <p className="text-kaizen-gray text-xs mb-3">
              Install the Freighter browser extension to connect your Stellar wallet.
            </p>
            <a
              href="https://freighter.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-kaizen-yellow text-xs hover:text-kaizen-yellow/80"
            >
              Download Freighter
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-kaizen-gray/20">
            <p className="text-kaizen-gray text-xs text-center">
              By connecting a wallet, you agree to Kaizen's Terms of Service
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
