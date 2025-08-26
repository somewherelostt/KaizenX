"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Calendar, MapPin, Users, ExternalLink } from "lucide-react"
import { useWallet } from "@/contexts/WalletContext"
import { getUserNFTs } from "@/lib/stellar"

interface CollectedNFT {
  id: string
  name: string
  description: string
  image: string
  eventName: string
  eventDate: string
  eventLocation: string
  contractAddress: string
  transactionHash: string
}

interface CollectiblesViewProps {
  className?: string
}

export function CollectiblesView({ className }: CollectiblesViewProps) {
  const { address, isConnected } = useWallet()
  const [nfts, setNfts] = useState<CollectedNFT[]>([])
  const [loading, setLoading] = useState(false)

  // Mock data for demonstration
  const mockNFTs: CollectedNFT[] = [
    {
      id: '1',
      name: 'Kaizen Web3 Delhi POAP',
      description: 'Proof of attendance for Kaizen Web3 Meetup in Delhi',
      image: '/placeholder-logo.png',
      eventName: 'Kaizen Web3 Meetup Delhi',
      eventDate: '2024-03-15',
      eventLocation: 'New Delhi, India',
      contractAddress: 'CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      transactionHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'
    },
    {
      id: '2',
      name: 'Blackpink Concert NFT',
      description: 'Exclusive NFT for Blackpink Concert attendees',
      image: '/concert-performer.png',
      eventName: 'Blackpink World Tour',
      eventDate: '2024-05-20',
      eventLocation: 'Mumbai, India',
      contractAddress: 'CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      transactionHash: '2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c'
    }
  ]

  useEffect(() => {
    if (isConnected && address) {
      loadUserNFTs()
    } else {
      setNfts([])
    }
  }, [isConnected, address])

  const loadUserNFTs = async () => {
    if (!address) return
    
    setLoading(true)
    try {
      const result = await getUserNFTs(address)
      if (result.success) {
        // For now, show mock data
        // In production, this would be: setNfts(result.nfts)
        setNfts(mockNFTs)
      }
    } catch (error) {
      console.error('Failed to load NFTs:', error)
      // Show mock data for demo
      setNfts(mockNFTs)
    } finally {
      setLoading(false)
    }
  }

  if (!isConnected) {
    return (
      <div className={`${className} text-center py-12`}>
        <div className="max-w-sm mx-auto">
          <div className="mb-6">
            <Trophy className="w-16 h-16 text-kaizen-gray mx-auto mb-4" />
            <h3 className="text-kaizen-white font-semibold text-xl mb-2">
              Connect Your Wallet
            </h3>
            <p className="text-kaizen-gray text-sm">
              Connect your wallet to view your collected NFTs and POAPs from events you've attended.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`${className} text-center py-12`}>
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-kaizen-dark-gray rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-kaizen-dark-gray rounded w-48 mx-auto mb-2"></div>
          <div className="h-3 bg-kaizen-dark-gray rounded w-32 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (nfts.length === 0) {
    return (
      <div className={`${className} text-center py-12`}>
        <div className="max-w-sm mx-auto">
          <div className="mb-6">
            <Trophy className="w-16 h-16 text-kaizen-gray mx-auto mb-4" />
            <h3 className="text-kaizen-white font-semibold text-xl mb-2">
              No Collectibles Yet
            </h3>
            <p className="text-kaizen-gray text-sm mb-6">
              Attend events and join activities to collect exclusive NFTs and POAPs that prove your participation.
            </p>
            <Button className="bg-kaizen-yellow text-kaizen-black hover:bg-kaizen-yellow/90">
              Discover Events
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`
  }

  const getExplorerUrl = (hash: string) => {
    return `https://stellar.expert/explorer/testnet/tx/${hash}`
  }

  return (
    <div className={className}>
      <div className="mb-6">
        <h2 className="text-kaizen-white font-semibold text-lg mb-2">
          My Collectibles
        </h2>
        <p className="text-kaizen-gray text-sm">
          NFTs and POAPs from events you've attended ({nfts.length} items)
        </p>
      </div>

      <div className="space-y-4">
        {nfts.map((nft) => (
          <Card
            key={nft.id}
            className="bg-kaizen-dark-gray/50 border-kaizen-dark-gray p-4 hover:bg-kaizen-dark-gray/70 transition-colors"
          >
            <div className="flex gap-4">
              {/* NFT Image */}
              <div className="flex-shrink-0">
                <Avatar className="w-16 h-16 rounded-xl">
                  <AvatarImage src={nft.image} alt={nft.name} />
                  <AvatarFallback className="bg-kaizen-yellow text-kaizen-black text-sm rounded-xl">
                    <Trophy className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* NFT Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-kaizen-white font-medium text-sm mb-1 truncate">
                      {nft.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="bg-kaizen-yellow/20 text-kaizen-yellow text-xs"
                    >
                      POAP
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 text-kaizen-gray hover:text-kaizen-white flex-shrink-0"
                    onClick={() => window.open(getExplorerUrl(nft.transactionHash), '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>

                {/* Event Info */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-center gap-2 text-xs text-kaizen-gray">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(nft.eventDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-kaizen-gray">
                    <MapPin className="w-3 h-3" />
                    <span>{nft.eventLocation}</span>
                  </div>
                </div>

                {/* Transaction Hash */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-kaizen-gray">TX:</span>
                    <code className="text-xs text-kaizen-white font-mono">
                      {formatHash(nft.transactionHash)}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card className="bg-kaizen-dark-gray/30 border-kaizen-dark-gray p-4 mt-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-6">
            <div>
              <div className="text-kaizen-white font-semibold text-2xl">
                {nfts.length}
              </div>
              <div className="text-kaizen-gray text-xs">
                Total Collectibles
              </div>
            </div>
            <div className="w-px h-8 bg-kaizen-dark-gray"></div>
            <div>
              <div className="text-kaizen-white font-semibold text-2xl">
                {new Set(nfts.map(nft => nft.eventName)).size}
              </div>
              <div className="text-kaizen-gray text-xs">
                Events Attended
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
