"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Wallet, Check, AlertCircle, ExternalLink, Trophy } from "lucide-react"
import { useWallet } from "@/contexts/WalletContext"
import { joinEvent, sendPayment } from "@/lib/stellar"
import { TransactionDrawer } from "./transaction-drawer"

interface PurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  eventTitle: string
  eventPrice: string
  eventImage: string
  isWalletConnected: boolean
  onConnectWallet: () => void
  eventId?: string
  organizerAddress?: string
  hasNFTReward?: boolean
}

interface TransactionStatus {
  status: 'pending' | 'success' | 'error'
  hash?: string
  ledger?: number
  error?: string
  action?: string
}

export function PurchaseModal({
  isOpen,
  onClose,
  eventTitle,
  eventPrice,
  eventImage,
  isWalletConnected,
  onConnectWallet,
  eventId,
  organizerAddress,
  hasNFTReward = true,
}: PurchaseModalProps) {
  const [step, setStep] = useState<"confirm" | "processing" | "success" | "error">("confirm")
  const [transaction, setTransaction] = useState<TransactionStatus>({
    status: 'pending',
    action: 'Event Join'
  })
  const [showTransactionDrawer, setShowTransactionDrawer] = useState(false)
  const { address } = useWallet()

  const handleJoinEvent = async () => {
    if (!isWalletConnected || !address) {
      onConnectWallet()
      return
    }

    setStep("processing")
    setTransaction({
      status: 'pending',
      action: 'Event Join'
    })
    setShowTransactionDrawer(true)

    try {
      // Join the event with payment (combines payment + blockchain proof in one transaction)
      const eventIdNumber = eventId ? parseInt(eventId) : 1
      const joinResult = await joinEvent(
        address, 
        eventIdNumber, 
        eventPrice,
        organizerAddress,
        eventTitle
      )

      if (joinResult.success) {
        setTransaction({
          status: 'success',
          hash: joinResult.transactionHash,
          ledger: joinResult.ledger,
          action: 'Event Join'
        })
        setStep("success")
      } else {
        throw new Error(joinResult.error || 'Failed to join event')
      }

    } catch (error) {
      console.error('Join event error:', error)
      setTransaction({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        action: 'Event Join'
      })
      setStep("error")
    }
  }

  const resetModal = () => {
    setStep("confirm")
    setTransaction({ status: 'pending', action: 'Event Join' })
    setShowTransactionDrawer(false)
    onClose()
  }

  const priceInXLM = eventPrice === "Free" ? "0" : eventPrice.replace(' XLM', '')
  const networkFee = "0.00001"
  const totalAmount = eventPrice === "Free" 
    ? networkFee 
    : (parseFloat(priceInXLM) + parseFloat(networkFee)).toFixed(5)

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <Card className="bg-kaizen-dark-gray border-none rounded-3xl w-full max-w-sm">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-kaizen-white font-bold text-xl">
                {step === "confirm" && "Join Event"}
                {step === "processing" && "Processing..."}
                {step === "success" && "Successfully Joined!"}
                {step === "error" && "Join Failed"}
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
                    <p className="text-kaizen-gray text-sm">Event Ticket</p>
                  </div>
                  <div className="text-right">
                    <p className="text-kaizen-white font-bold text-lg">{eventPrice}</p>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-kaizen-gray text-sm">
                      {eventPrice === "Free" ? "Event" : "Ticket Price"}
                    </span>
                    <span className="text-kaizen-white text-sm">{eventPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-kaizen-gray text-sm">Network Fee</span>
                    <span className="text-kaizen-white text-sm">{networkFee} XLM</span>
                  </div>
                  <div className="border-t border-kaizen-gray/20 pt-3">
                    <div className="flex justify-between">
                      <span className="text-kaizen-white font-semibold">Total Cost</span>
                      <span className="text-kaizen-white font-semibold">
                        {eventPrice === "Free" ? `${networkFee} XLM` : `${totalAmount} XLM`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* NFT/POAP Info */}
                {hasNFTReward && (
                  <div className="bg-kaizen-yellow/10 border border-kaizen-yellow/20 rounded-2xl p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-kaizen-yellow" />
                      <span className="text-kaizen-yellow font-semibold text-sm">POAP Included</span>
                    </div>
                    <p className="text-kaizen-gray text-xs">
                      You'll receive a commemorative NFT as proof of attendance when you join this event
                    </p>
                  </div>
                )}

                {/* Wallet Connection Status */}
                {!isWalletConnected && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="w-4 h-4 text-orange-500" />
                      <span className="text-orange-500 font-semibold text-sm">Wallet Required</span>
                    </div>
                    <p className="text-kaizen-gray text-xs">
                      Connect your Stellar wallet to join this event and receive rewards
                    </p>
                  </div>
                )}

                {/* Join Button */}
                <Button
                  onClick={handleJoinEvent}
                  className="w-full bg-kaizen-yellow text-kaizen-black hover:bg-kaizen-yellow/90 font-semibold rounded-full h-12 flex items-center gap-2"
                >
                  <Wallet className="w-4 h-4" />
                  {isWalletConnected ? "Join Event" : "Connect Wallet to Join"}
                </Button>
              </>
            )}

            {step === "processing" && (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-4 border-kaizen-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-kaizen-white font-semibold mb-2">Joining Event</h3>
                <p className="text-kaizen-gray text-sm">
                  Processing your transaction on the Stellar network...
                </p>
              </div>
            )}

            {step === "success" && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-kaizen-white font-semibold mb-2">Welcome to the Event!</h3>
                <p className="text-kaizen-gray text-sm mb-4">
                  You've successfully joined {eventTitle}
                  {hasNFTReward && " and will receive your POAP"}
                </p>
                {transaction.hash && (
                  <div className="bg-kaizen-black/50 rounded-2xl p-3 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-kaizen-gray text-xs">Transaction Hash</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-4 h-4 p-0 text-kaizen-gray hover:text-kaizen-white"
                        onClick={() => window.open(`https://stellar.expert/explorer/testnet/tx/${transaction.hash}`, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                    <code className="text-kaizen-white text-xs break-all">
                      {transaction.hash}
                    </code>
                  </div>
                )}
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
                <h3 className="text-kaizen-white font-semibold mb-2">Failed to Join Event</h3>
                <p className="text-kaizen-gray text-sm mb-4">
                  {transaction.error || "The transaction was rejected or failed to process"}
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={resetModal}
                    variant="outline"
                    className="flex-1 border-kaizen-gray/30 text-kaizen-white hover:bg-kaizen-gray/20 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setStep("confirm")
                      setTransaction({ status: 'pending', action: 'Event Join' })
                    }}
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

      {/* Transaction Status Drawer */}
      <TransactionDrawer
        isOpen={showTransactionDrawer}
        onClose={() => setShowTransactionDrawer(false)}
        transaction={transaction}
      />
    </>
  )
}
