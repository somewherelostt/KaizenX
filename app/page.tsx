"use client"

import { useState, useEffect } from "react"
import { Search, Calendar, Home, User, Filter, Heart, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { WalletConnect } from "@/components/wallet-connect"
import { WalletStatus } from "@/components/wallet-status"
import { PurchaseModal } from "@/components/purchase-modal"
import { getAccountBalance } from "@/lib/stellar"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as FreighterApi from "@stellar/freighter-api"

export default function KaizenApp() {
  const [activeTab, setActiveTab] = useState("home")
  const [selectedCategory, setSelectedCategory] = useState("Live shows")
  const [showWalletConnect, setShowWalletConnect] = useState(false)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletInfo, setWalletInfo] = useState({
    name: "",
    address: "",
    balance: "0",
  })
  const [isLoading, setIsLoading] = useState(false) // Changed to false for immediate load
  const router = useRouter()

  // Optional: Check for existing wallet connection manually
  // Disabled auto-check for better demo performance
  useEffect(() => {
    // Quick check for stored wallet without network calls
    const storedWallet = localStorage.getItem('kaizen_wallet')
    const manuallyDisconnected = localStorage.getItem('kaizen_wallet_disconnected')
    
    if (storedWallet && manuallyDisconnected !== 'true') {
      try {
        const walletData = JSON.parse(storedWallet)
        const oneDay = 24 * 60 * 60 * 1000
        
        // If stored connection is recent, restore it (without network verification for speed)
        if (Date.now() - walletData.timestamp < oneDay && walletData.connected) {
          setWalletConnected(true)
          setWalletInfo({
            name: walletData.name,
            address: walletData.address,
            balance: walletData.balance, // Use stored balance initially
          })
        }
      } catch (error) {
        console.log("Error parsing stored wallet data")
        localStorage.removeItem('kaizen_wallet')
      }
    }
  }, [])

  const checkExistingConnection = async () => {
    try {
      setIsLoading(true)
      
      // Check if user manually disconnected - if so, don't auto-reconnect
      const manuallyDisconnected = localStorage.getItem('kaizen_wallet_disconnected')
      if (manuallyDisconnected === 'true') {
        return // Don't auto-reconnect after manual disconnect
      }
      
      // First check localStorage for recent connection
      const storedWallet = localStorage.getItem('kaizen_wallet')
      if (storedWallet) {
        const walletData = JSON.parse(storedWallet)
        
        // Check if connection is less than 24 hours old
        const oneDay = 24 * 60 * 60 * 1000
        if (Date.now() - walletData.timestamp < oneDay && walletData.connected) {
          // Add timeout to prevent hanging
          const timeout = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Connection check timeout')), 5000)
          )
          
          try {
            // Verify the connection is still active with Freighter (with timeout)
            const isConnected = await Promise.race([
              FreighterApi.isConnected(),
              timeout
            ])
            
            if (isConnected) {
              // Refresh the balance (with timeout)
              const currentBalance = await Promise.race([
                getAccountBalance(walletData.address),
                timeout
              ]) as string
              
              setWalletConnected(true)
              setWalletInfo({
                name: walletData.name,
                address: walletData.address,
                balance: currentBalance,
              })
              
              // Update stored balance
              localStorage.setItem('kaizen_wallet', JSON.stringify({
                ...walletData,
                balance: currentBalance,
                timestamp: Date.now()
              }))
              
              return // Successfully restored connection
            }
          } catch (error) {
            console.log("Stored wallet no longer valid or timeout occurred, clearing...", error)
            localStorage.removeItem('kaizen_wallet')
          }
        } else {
          // Connection too old, clear it
          localStorage.removeItem('kaizen_wallet')
        }
      }
      
    } catch (error) {
      console.log("No existing wallet connection found", error)
      localStorage.removeItem('kaizen_wallet')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    if (tab === "calendar") {
      router.push("/calendar")
    } else if (tab === "profile") {
      router.push("/profile")
    }
  }

  const handleWalletConnect = async (walletName: string, publicKey: string, balance: string) => {
    setWalletConnected(true)
    setWalletInfo({
      name: walletName,
      address: publicKey,
      balance: balance,
    })
    
    // Clear the manual disconnect flag since user is actively connecting
    localStorage.removeItem('kaizen_wallet_disconnected')
    
    // Store in localStorage for persistence
    localStorage.setItem('kaizen_wallet', JSON.stringify({
      connected: true,
      name: walletName,
      address: publicKey,
      balance: balance,
      timestamp: Date.now()
    }))
  }

  const handleWalletDisconnect = () => {
    setWalletConnected(false)
    setWalletInfo({ name: "", address: "", balance: "0" })
    
    // Clear from localStorage and mark as manually disconnected
    localStorage.removeItem('kaizen_wallet')
    localStorage.setItem('kaizen_wallet_disconnected', 'true')
  }

  const handlePurchaseClick = () => {
    setShowPurchaseModal(true)
  }

  // Show loading spinner while checking wallet connection
  if (isLoading) {
    return (
      <div className="min-h-screen bg-kaizen-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-kaizen-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-kaizen-white">Checking wallet connection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-kaizen-black text-kaizen-white max-w-sm mx-auto relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/abstract-profile.png" />
            <AvatarFallback className="bg-kaizen-dark-gray text-kaizen-white">CJ</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-kaizen-gray text-sm">Welcome Back</p>
            <p className="text-kaizen-white font-semibold">Christian Johnson</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <WalletStatus
            isConnected={walletConnected}
            walletName={walletInfo.name}
            address={walletInfo.address}
            balance={walletInfo.balance}
            onConnect={() => setShowWalletConnect(true)}
            onDisconnect={handleWalletDisconnect}
          />
          <Button
            variant="ghost"
            size="icon"
            className="text-kaizen-white hover:bg-kaizen-dark-gray"
            onClick={() => router.push("/calendar")}
          >
            <Calendar className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-kaizen-gray w-4 h-4" />
          <Input
            placeholder="Discover"
            className="pl-10 bg-kaizen-dark-gray border-none text-kaizen-white placeholder:text-kaizen-gray rounded-full h-12"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-kaizen-white hover:bg-kaizen-gray/20"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-kaizen-white font-semibold text-lg">Categories</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <button
            key="all"
            onClick={() => setSelectedCategory("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full flex-shrink-0 font-medium transition-colors ${
              selectedCategory === "all"
                ? 'bg-kaizen-yellow text-kaizen-black'
                : 'bg-kaizen-dark-gray text-kaizen-white hover:bg-kaizen-gray/50'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedCategory === "all" ? 'bg-kaizen-black' : 'bg-kaizen-gray'}`}>
              <div className={`w-3 h-3 rounded-full ${selectedCategory === "all" ? 'bg-kaizen-yellow' : 'bg-kaizen-gray'}`}></div>
            </div>
            <span>All</span>
          </button>
          {['Live shows', 'Tourism', 'Fever Origin'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full flex-shrink-0 font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-kaizen-yellow text-kaizen-black'
                  : 'bg-kaizen-dark-gray text-kaizen-white hover:bg-kaizen-gray/50'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedCategory === cat ? 'bg-kaizen-black' : 'bg-kaizen-gray'}`}>
                <div className={`w-3 h-3 rounded-full ${selectedCategory === cat ? 'bg-kaizen-yellow' : 'bg-kaizen-gray'}`}></div>
              </div>
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Event (filtered by category) */}
      <div className="px-4 mb-6">
        {(selectedCategory === "Live shows" || selectedCategory === "all") && (
          <Link href="/event/1">
            <Card className="bg-gradient-to-br from-green-600 to-green-800 border-none rounded-3xl overflow-hidden relative p-0 cursor-pointer hover:scale-[1.02] transition-transform">
              <div className="relative h-64">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-zY5f7bxQlrK3C1CkraP1yzFTbVqxtc.png"
                  alt="Blackpink Concert"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                {/* Date Badge */}
                <div className="absolute top-4 left-4 bg-kaizen-white text-kaizen-black px-3 py-1 rounded-lg text-sm font-medium">
                  May<br />20
                </div>
                {/* Heart Icon */}
                <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white hover:bg-white/20">
                  <Heart className="w-5 h-5" />
                </Button>
                {/* Event Details */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-xl mb-2">Blackpink Concert</h3>
                  <div className="flex items-center gap-1 mb-4">
                    <MapPin className="w-4 h-4 text-white/80" />
                    <p className="text-white/80 text-sm">123 Main Street, New York</p>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <Avatar className="w-8 h-8 border-2 border-white">
                          <AvatarImage src="/conference-attendee-one.png" />
                          <AvatarFallback className="bg-kaizen-yellow text-kaizen-black text-xs">A</AvatarFallback>
                        </Avatar>
                        <Avatar className="w-8 h-8 border-2 border-white">
                          <AvatarImage src="/conference-attendee-two.png" />
                          <AvatarFallback className="bg-kaizen-dark-gray text-kaizen-white text-xs">B</AvatarFallback>
                        </Avatar>
                        <Avatar className="w-8 h-8 border-2 border-white">
                          <AvatarFallback className="bg-kaizen-yellow text-kaizen-black text-xs">1.2k</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-2xl">50 XLM</p>
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      handlePurchaseClick()
                    }}
                    className="w-full bg-kaizen-yellow text-kaizen-black hover:bg-kaizen-yellow/90 font-semibold rounded-full h-12"
                  >
                    Join now
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
        )}
        {selectedCategory === "Tourism" && (
          <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-none rounded-3xl overflow-hidden relative p-0 cursor-pointer hover:scale-[1.02] transition-transform">
            <div className="relative h-64 flex items-center justify-center">
              <span className="text-white text-xl">No tourism events yet.</span>
            </div>
          </Card>
        )}
        {selectedCategory === "Fever Origin" && (
          <Card className="bg-gradient-to-br from-purple-600 to-purple-800 border-none rounded-3xl overflow-hidden relative p-0 cursor-pointer hover:scale-[1.02] transition-transform">
            <div className="relative h-64 flex items-center justify-center">
              <span className="text-white text-xl">No Fever Origin events yet.</span>
            </div>
          </Card>
        )}
      </div>

      {/* Top 10 in London */}
      <div className="px-4 mb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-kaizen-white font-semibold text-lg">Top 10 in London</h2>
          <Button variant="ghost" className="text-kaizen-gray text-sm p-0 h-auto hover:text-kaizen-white">
            See all
          </Button>
        </div>
  <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {[
            { id: 1, rating: "5.0", image: "/community-event.png?height=96&width=128&query=music-festival" },
            { id: 2, rating: "4.8", image: "/community-event.png?height=96&width=128&query=art-exhibition" },
            { id: 3, rating: "4.9", image: "/community-event.png?height=96&width=128&query=tech-conference" },
          ].map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-32 h-24 bg-kaizen-dark-gray rounded-2xl relative overflow-hidden cursor-pointer hover:scale-105 transition-transform"
            >
              <img
                src={item.image || "/placeholder.svg"}
                alt={`Event ${item.id}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute top-2 left-2 bg-kaizen-yellow text-kaizen-black px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                ⭐ {item.rating}
              </div>
              <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-white hover:bg-white/20">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-kaizen-black border-t border-kaizen-dark-gray">
        <div className="flex items-center justify-around py-3">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${activeTab === "home" ? "bg-kaizen-yellow text-kaizen-black" : "text-kaizen-gray hover:text-kaizen-white"}`}
            onClick={() => handleTabClick("home")}
          >
            <Home className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${activeTab === "search" ? "bg-kaizen-yellow text-kaizen-black" : "text-kaizen-gray hover:text-kaizen-white"}`}
            onClick={() => handleTabClick("search")}
          >
            <Search className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${activeTab === "calendar" ? "bg-kaizen-yellow text-kaizen-black" : "text-kaizen-gray hover:text-kaizen-white"}`}
            onClick={() => handleTabClick("calendar")}
          >
            <Calendar className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${activeTab === "profile" ? "bg-kaizen-yellow text-kaizen-black" : "text-kaizen-gray hover:text-kaizen-white"}`}
            onClick={() => handleTabClick("profile")}
          >
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Modals */}
      <WalletConnect
        isOpen={showWalletConnect}
        onClose={() => setShowWalletConnect(false)}
        onConnect={handleWalletConnect}
      />

      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        eventTitle="Blackpink Concert"
        eventPrice="50 XLM"
        eventImage="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-zY5f7bxQlrK3C1CkraP1yzFTbVqxtc.png"
        isWalletConnected={walletConnected}
        walletAddress={walletInfo.address}
        onConnectWallet={() => setShowWalletConnect(true)}
      />
    </div>
  )
}
