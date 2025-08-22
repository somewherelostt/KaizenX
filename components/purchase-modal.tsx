"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Wallet, Check, AlertCircle } from "lucide-react"

interface PurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  eventTitle: string
  eventPrice: string
  eventImage: string
  isWalletConnected: boolean
  onConnectWallet: () => void
}

export function PurchaseModal({
  isOpen,
  onClose,
  eventTitle,
  eventPrice,
  eventImage,
  isWalletConnected,
  onConnectWallet,
}: PurchaseModalProps) {
  const [step, setStep] = useState<"confirm" | "processing" | "success" | "error">("confirm")
  const [transactionHash, setTransactionHash] = useState<string>("")

  const handlePurchase = async () => {
    if (!isWalletConnected) {
      onConnectWallet()
      return
    }

    setStep("processing")

    // Simulate transaction
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Simulate success/error
    const success = Math.random() > 0.2 // 80% success rate

    if (success) {
      setTransactionHash("GCKFBEIYTKQTPD5ZXQGZXPQJQUZN3KYJCSJDMB7QBWQTQXQZXQGZXPQJ")
      setStep("success")
    } else {
      setStep("error")
    }
  }

  const resetModal = () => {
    setStep("confirm")
    setTransactionHash("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="bg-kaizen-dark-gray border-none rounded-3xl w-full max-w-sm">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-kaizen-white font-bold text-xl">
              {step === "confirm" && "Confirm Purchase"}
              {step === "processing" && "Processing..."}
              {step === "success" && "Purchase Successful!"}
              {step === "error" && "Transaction Failed"}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetModal}
              className="text-kaizen-gray hover:text-kaizen-white hover:bg-kaizen-gray/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {step === "confirm" && (
            <>
              {/* Event Details */}
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={eventImage || "/placeholder.svg"}
                  alt={eventTitle}
                  className="w-16 h-16 rounded-2xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-kaizen-white font-semibold text-sm">{eventTitle}</h3>
                  <p className="text-kaizen-gray text-sm">1 Ticket</p>
                </div>
                <div className="text-right">
                  <p className="text-kaizen-white font-bold text-lg">{eventPrice}</p>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-kaizen-gray text-sm">Ticket Price</span>
                  <span className="text-kaizen-white text-sm">{eventPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-kaizen-gray text-sm">Network Fee</span>
                  <span className="text-kaizen-white text-sm">0.00001 XLM</span>
                </div>
                <div className="border-t border-kaizen-gray/20 pt-3">
                  <div className="flex justify-between">
                    <span className="text-kaizen-white font-semibold">Total</span>
                    <span className="text-kaizen-white font-semibold">{eventPrice}</span>
                  </div>
                </div>
              </div>

              {/* NFT Info */}
              <div className="bg-kaizen-yellow/10 border border-kaizen-yellow/20 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-kaizen-yellow rounded-full"></div>
                  <span className="text-kaizen-yellow font-semibold text-sm">NFT Included</span>
                </div>
                <p className="text-kaizen-gray text-xs">
                  You'll receive a commemorative NFT as proof of attendance after the event
                </p>
              </div>

              {/* Purchase Button */}
              <Button
                onClick={handlePurchase}
                className="w-full bg-kaizen-yellow text-kaizen-black hover:bg-kaizen-yellow/90 font-semibold rounded-full h-12 flex items-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                {isWalletConnected ? "Confirm Purchase" : "Connect Wallet to Purchase"}
              </Button>
            </>
          )}

          {step === "processing" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-kaizen-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-kaizen-white font-semibold mb-2">Processing Transaction</h3>
              <p className="text-kaizen-gray text-sm">Please confirm the transaction in your wallet</p>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-kaizen-white font-semibold mb-2">Ticket Purchased!</h3>
              <p className="text-kaizen-gray text-sm mb-4">Your ticket has been secured on the Stellar blockchain</p>
              <div className="bg-kaizen-black/50 rounded-2xl p-3 mb-4">
                <p className="text-kaizen-gray text-xs mb-1">Transaction Hash</p>
                <code className="text-kaizen-white text-xs break-all">{transactionHash}</code>
              </div>
              <Button
                onClick={resetModal}
                className="w-full bg-kaizen-yellow text-kaizen-black hover:bg-kaizen-yellow/90 font-semibold rounded-full"
              >
                Done
              </Button>
            </div>
          )}

          {step === "error" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-kaizen-white font-semibold mb-2">Transaction Failed</h3>
              <p className="text-kaizen-gray text-sm mb-4">The transaction was rejected or failed to process</p>
              <div className="flex gap-3">
                <Button
                  onClick={resetModal}
                  variant="outline"
                  className="flex-1 border-kaizen-gray/30 text-kaizen-white hover:bg-kaizen-gray/20 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setStep("confirm")}
                  className="flex-1 bg-kaizen-yellow text-kaizen-black hover:bg-kaizen-yellow/90 font-semibold"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
