"use client"

import { useState, useEffect } from "react"
import { X, ExternalLink, Loader2, CheckCircle, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"

interface TransactionStatus {
  status: 'pending' | 'success' | 'error'
  hash?: string
  ledger?: number
  error?: string
  action?: string
}

interface TransactionDrawerProps {
  isOpen: boolean
  onClose: () => void
  transaction: TransactionStatus
}

export function TransactionDrawer({ isOpen, onClose, transaction }: TransactionDrawerProps) {
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    if (transaction.status === 'pending' && isOpen) {
      const startTime = Date.now()
      const interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [transaction.status, isOpen])

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'pending':
        return <Loader2 className="w-8 h-8 text-kaizen-yellow animate-spin" />
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />
      case 'error':
        return <XCircle className="w-8 h-8 text-red-500" />
      default:
        return <Clock className="w-8 h-8 text-kaizen-gray" />
    }
  }

  const getStatusText = () => {
    switch (transaction.status) {
      case 'pending':
        return 'Processing Transaction...'
      case 'success':
        return 'Transaction Confirmed!'
      case 'error':
        return 'Transaction Failed'
      default:
        return 'Transaction Status'
    }
  }

  const getStatusDescription = () => {
    switch (transaction.status) {
      case 'pending':
        return `Your ${transaction.action || 'transaction'} is being processed on the Stellar network. This usually takes 5-10 seconds.`
      case 'success':
        return `Your ${transaction.action || 'transaction'} has been successfully confirmed on the Stellar network.`
      case 'error':
        return `There was an error processing your ${transaction.action || 'transaction'}. ${transaction.error || 'Please try again.'}`
      default:
        return 'Transaction details will appear here.'
    }
  }

  const formatHash = (hash?: string) => {
    if (!hash) return 'N/A'
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`
  }

  const getExplorerUrl = (hash?: string) => {
    if (!hash) return null
    return `https://stellar.expert/explorer/testnet/tx/${hash}`
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-kaizen-black border-kaizen-dark-gray max-w-sm mx-auto">
        <DrawerHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <DrawerTitle className="text-kaizen-white text-lg font-semibold">
              Transaction Status
            </DrawerTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-kaizen-gray hover:text-kaizen-white hover:bg-kaizen-dark-gray"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Status Icon and Text */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="p-4 bg-kaizen-dark-gray/50 rounded-full">
              {getStatusIcon()}
            </div>
            <div className="text-center">
              <h3 className="text-kaizen-white font-semibold text-xl mb-2">
                {getStatusText()}
              </h3>
              <DrawerDescription className="text-kaizen-gray text-sm leading-relaxed max-w-xs">
                {getStatusDescription()}
              </DrawerDescription>
            </div>
          </div>

          {/* Transaction Details */}
          <Card className="bg-kaizen-dark-gray/30 border-kaizen-dark-gray p-4">
            <div className="space-y-3">
              {/* Transaction Hash */}
              <div className="flex items-center justify-between">
                <span className="text-kaizen-gray text-sm">Transaction Hash</span>
                <div className="flex items-center gap-2">
                  <code className="text-kaizen-white text-sm font-mono">
                    {formatHash(transaction.hash)}
                  </code>
                  {transaction.hash && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 text-kaizen-gray hover:text-kaizen-white"
                      onClick={() => {
                        const url = getExplorerUrl(transaction.hash)
                        if (url) window.open(url, '_blank')
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Ledger Number */}
              {transaction.ledger && (
                <div className="flex items-center justify-between">
                  <span className="text-kaizen-gray text-sm">Ledger</span>
                  <code className="text-kaizen-white text-sm font-mono">
                    #{transaction.ledger}
                  </code>
                </div>
              )}

              {/* Time Elapsed (for pending) */}
              {transaction.status === 'pending' && (
                <div className="flex items-center justify-between">
                  <span className="text-kaizen-gray text-sm">Time Elapsed</span>
                  <span className="text-kaizen-white text-sm">
                    {timeElapsed}s
                  </span>
                </div>
              )}

              {/* Error Details */}
              {transaction.status === 'error' && transaction.error && (
                <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-xs font-mono">
                    {transaction.error}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            {transaction.hash && (
              <Button
                variant="outline"
                className="flex-1 border-kaizen-dark-gray text-kaizen-white hover:bg-kaizen-dark-gray"
                onClick={() => {
                  const url = getExplorerUrl(transaction.hash)
                  if (url) window.open(url, '_blank')
                }}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Explorer
              </Button>
            )}
            
            <Button
              onClick={onClose}
              className={`flex-1 ${
                transaction.status === 'success'
                  ? 'bg-kaizen-yellow text-kaizen-black hover:bg-kaizen-yellow/90'
                  : 'bg-kaizen-dark-gray text-kaizen-white hover:bg-kaizen-gray/50'
              }`}
            >
              {transaction.status === 'success' ? 'Done' : 'Close'}
            </Button>
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  )
}
