"use client"

import { useState } from "react"
import { Horizon } from "@stellar/stellar-sdk"
import * as FreighterApi from "@stellar/freighter-api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Check, ExternalLink } from "lucide-react"

interface WalletConnectProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (wallet: string, publicKey: string, balance: string) => void
}

export function WalletConnect({ isOpen, onClose, onConnect }: WalletConnectProps) {
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
      installed: true,
    },
    {
      name: "Lobstr",
      icon: "/lobstr-wallet-app.png",
      description: "Mobile Stellar wallet",
      installed: false,
    },
  ]

  const handleConnect = async (walletName: string) => {
    setConnecting(walletName)
    let publicKey = ""
    let balance = "0"

    if (walletName === "Freighter") {
      try {
        // Check if Freighter extension is available
        if (!await FreighterApi.isConnected()) {
          throw new Error("Freighter wallet extension not found. Please install Freighter.")
        }
        
        // Request access from Freighter
        const accessResult = await FreighterApi.requestAccess()
        
        if (accessResult.error) {
          throw new Error(accessResult.error)
        }
        
        publicKey = accessResult.address
        
        if (!publicKey) {
          throw new Error("No public key received from Freighter")
        }
        
        console.log("Freighter connected successfully:", publicKey.substring(0, 10) + "...")
        
        // Fetch XLM balance from Stellar testnet
        const server = new Horizon.Server("https://horizon-testnet.stellar.org")
        try {
          const account = await server.loadAccount(publicKey)
          const xlm = account.balances.find((b: any) => b.asset_type === "native")
          balance = xlm ? parseFloat(xlm.balance).toFixed(2) : "0"
        } catch (balanceErr) {
          console.log("Could not fetch balance, account may not exist on testnet:", balanceErr)
          balance = "0"
        }
        
      } catch (err: any) {
        console.error("Freighter connection error:", err)
        
        // Show user-friendly error messages
        if (err.message?.includes("not found") || err.message?.includes("not available")) {
          alert("Please install the Freighter wallet extension first!")
        } else if (err.message?.includes("rejected") || err.message?.includes("denied")) {
          alert("Wallet connection was rejected. Please try again and approve the connection.")
        } else {
          alert(`Wallet connection failed: ${err.message || 'Unknown error'}`)
        }
        
        publicKey = ""
        balance = "0"
      }
    }

    // For Albedo/Lobstr, you can add similar logic or just simulate for now
    onConnect(walletName, publicKey, balance)
    setConnecting(null)
    onClose()
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

          {/* Wallet Options */}
          <div className="space-y-3">
            {wallets.map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => wallet.installed && handleConnect(wallet.name)}
                disabled={!wallet.installed || connecting !== null}
                className={`w-full p-4 rounded-2xl border transition-colors ${
                  wallet.installed
                    ? "border-kaizen-gray/30 hover:border-kaizen-yellow bg-kaizen-black/50 hover:bg-kaizen-yellow/10"
                    : "border-kaizen-gray/20 bg-kaizen-gray/10 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img src={wallet.icon || "/placeholder.svg"} alt={wallet.name} className="w-10 h-10 rounded-xl" />
                  <div className="flex-1 text-left">
                    <h3 className={`font-semibold ${wallet.installed ? "text-kaizen-white" : "text-kaizen-gray"}`}>
                      {wallet.name}
                    </h3>
                    <p className="text-kaizen-gray text-sm">{wallet.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {connecting === wallet.name ? (
                      <div className="w-5 h-5 border-2 border-kaizen-yellow border-t-transparent rounded-full animate-spin" />
                    ) : wallet.installed ? (
                      <Check className="w-5 h-5 text-kaizen-yellow" />
                    ) : (
                      <ExternalLink className="w-4 h-4 text-kaizen-gray" />
                    )}
                  </div>
                </div>
              </button>
            ))}
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
