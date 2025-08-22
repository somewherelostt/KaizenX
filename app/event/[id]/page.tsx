"use client"

import { ArrowLeft, Heart, MapPin, Calendar, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PurchaseModal } from "@/components/purchase-modal"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [walletConnected] = useState(false) // This would come from global state

  return (
    <div className="min-h-screen bg-kaizen-black text-kaizen-white max-w-sm mx-auto relative">
      {/* Hero Image */}
      <div className="relative h-80 overflow-hidden">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-0ET1prFHgE7P3CxC80ftaZOkGxW6F8.png"
          alt="Gala Night Event"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

        {/* Header Controls */}
        <div className="absolute top-12 left-4 right-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="bg-kaizen-dark-gray/80 text-kaizen-white hover:bg-kaizen-dark-gray rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-kaizen-dark-gray/80 text-kaizen-white hover:bg-kaizen-dark-gray rounded-full"
          >
            <Share className="w-5 h-5" />
          </Button>
        </div>

        {/* Search Icon */}
        <div className="absolute top-12 right-16">
          <Button
            variant="ghost"
            size="icon"
            className="bg-kaizen-dark-gray/80 text-kaizen-white hover:bg-kaizen-dark-gray rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </Button>
        </div>
      </div>

      {/* Event Details */}
      <div className="px-4 py-6">
        {/* Title and Price */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-kaizen-white font-bold text-2xl leading-tight mb-2">
              Gala Night of Hilarious Comedy at The Club
            </h1>
          </div>
          <div className="text-right ml-4">
            <p className="text-kaizen-white font-bold text-3xl">$48</p>
            <p className="text-kaizen-gray text-sm">250 seats available</p>
          </div>
        </div>

        {/* Date and Location */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-kaizen-gray" />
            <span className="text-kaizen-gray text-sm">17 Jun 2024</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-kaizen-gray" />
            <span className="text-kaizen-gray text-sm">California, USA</span>
          </div>
        </div>

        {/* About Event */}
        <div className="mb-6">
          <h2 className="text-kaizen-white font-semibold text-lg mb-3">About Event</h2>
          <p className="text-kaizen-gray text-sm leading-relaxed">
            Planning an event can be a daunting task, especially when you have guests{" "}
            <span className="text-kaizen-white cursor-pointer">read more...</span>
          </p>
        </div>

        {/* Participants */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-kaizen-white font-semibold text-lg">Participant</h2>
            <span className="text-kaizen-yellow text-sm font-medium">+2k</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-kaizen-gray text-sm">All over the world</span>
            <div className="flex -space-x-2">
              <Avatar className="w-8 h-8 border-2 border-kaizen-black">
                <AvatarImage src="/conference-attendee-one.png" />
                <AvatarFallback className="bg-kaizen-yellow text-kaizen-black text-xs">A</AvatarFallback>
              </Avatar>
              <Avatar className="w-8 h-8 border-2 border-kaizen-black">
                <AvatarImage src="/conference-attendee-two.png" />
                <AvatarFallback className="bg-kaizen-dark-gray text-kaizen-white text-xs">B</AvatarFallback>
              </Avatar>
              <Avatar className="w-8 h-8 border-2 border-kaizen-black">
                <AvatarFallback className="bg-kaizen-gray text-kaizen-black text-xs">C</AvatarFallback>
              </Avatar>
              <Avatar className="w-8 h-8 border-2 border-kaizen-black">
                <AvatarFallback className="bg-kaizen-yellow text-kaizen-black text-xs">+2k</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="mb-8">
          <h2 className="text-kaizen-white font-semibold text-lg mb-3">Location</h2>
          <Card className="bg-kaizen-dark-gray border-none rounded-2xl overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-blue-900 to-purple-900 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-kaizen-white" />
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-kaizen-white text-sm font-medium">The Club</p>
                <p className="text-kaizen-gray text-xs">California, USA</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-kaizen-black border-t border-kaizen-dark-gray p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="bg-kaizen-dark-gray text-kaizen-white hover:bg-kaizen-gray rounded-full flex-shrink-0"
          >
            <Heart className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => setShowPurchaseModal(true)}
            className="flex-1 bg-kaizen-yellow text-kaizen-black hover:bg-kaizen-yellow/90 font-semibold rounded-full h-12"
          >
            Buy Ticket
          </Button>
        </div>
      </div>

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        eventTitle="Gala Night of Hilarious Comedy at The Club"
        eventPrice="$48"
        eventImage="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-0ET1prFHgE7P3CxC80ftaZOkGxW6F8.png"
        isWalletConnected={walletConnected}
        onConnectWallet={() => {}}
      />
    </div>
  )
}
