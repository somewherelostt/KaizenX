"use client";

import { useState, useEffect } from "react"
import { Search, Calendar, Filter, Heart, MapPin, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { WalletConnect } from "@/components/wallet-connect"
import { WalletStatus } from "@/components/wallet-status"
import { PurchaseModal } from "@/components/purchase-modal"
import { AuthModal } from "@/components/auth-modal"
import { getEventStatus, isEventCompleted } from "@/lib/eventUtils"
import { useAuth } from "@/contexts/AuthContext"
import { apiUrl, imageUrl } from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useWallet } from "@/contexts/WalletContext"

export default function KaizenApp() {
  const [selectedCategory, setSelectedCategory] = useState("Live shows");
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const { isConnected } = useWallet()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState<any>(null)

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(apiUrl("/api/events"));
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Filter events by selectedCategory and exclude completed events
  const featuredEvents = events.filter(
    (event) => {
      // First filter by category
      const matchesCategory = selectedCategory === "all" ||
        (event.category && event.category === selectedCategory);
      
      // Then exclude completed events
      const isNotCompleted = !isEventCompleted(event.date);
      
      return matchesCategory && isNotCompleted;
    }
  );

  const handlePurchaseClick = (event: any) => {
    setSelectedEvent(event)
    setShowPurchaseModal(true)
  }

  // Get the selected event for purchase modal
  const defaultEvent = featuredEvents[0] || {
    title: "Blackpink Concert",
    price: "50",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-zY5f7bxQlrK3C1CkraP1yzFTbVqxtc.png"
  }

  const currentSelectedEvent = selectedEvent || defaultEvent

  return (
    <div className="min-h-screen bg-kaizen-black text-kaizen-white max-w-sm mx-auto relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        {isAuthenticated && user ? (
          <Link href="/profile" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <Avatar className="w-10 h-10">
              <AvatarImage src={imageUrl(user.imageUrl) || "/abstract-profile.png"} />
              <AvatarFallback className="bg-kaizen-dark-gray text-kaizen-white">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-kaizen-gray text-sm">Welcome Back</p>
              <p className="text-kaizen-white font-semibold">{user.username}</p>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-kaizen-dark-gray text-kaizen-white">
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-kaizen-gray text-sm">Guest User</p>
              <Button
                onClick={() => setShowAuthModal(true)}
                className="text-kaizen-white font-semibold p-0 h-auto bg-transparent hover:bg-transparent hover:text-kaizen-yellow text-left"
              >
                Sign In / Sign Up
              </Button>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <WalletStatus
            onConnect={() => setShowWalletConnect(true)}
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
          <h2 className="text-kaizen-white font-semibold text-lg">
            Categories
          </h2>
        </div>
        <div
          className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <button
            key="all"
            onClick={() => setSelectedCategory("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full flex-shrink-0 font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-kaizen-yellow text-kaizen-black"
                : "bg-kaizen-dark-gray text-kaizen-white hover:bg-kaizen-gray/50"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                selectedCategory === "all"
                  ? "bg-kaizen-black"
                  : "bg-kaizen-gray"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  selectedCategory === "all"
                    ? "bg-kaizen-yellow"
                    : "bg-kaizen-gray"
                }`}
              ></div>
            </div>
            <span>All</span>
          </button>
          {["Live shows", "Tourism", "Fever Origin"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full flex-shrink-0 font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-kaizen-yellow text-kaizen-black"
                  : "bg-kaizen-dark-gray text-kaizen-white hover:bg-kaizen-gray/50"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  selectedCategory === cat
                    ? "bg-kaizen-black"
                    : "bg-kaizen-gray"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    selectedCategory === cat
                      ? "bg-kaizen-yellow"
                      : "bg-kaizen-gray"
                  }`}
                ></div>
              </div>
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Event (filtered by category) */}
      <div className="px-4 mb-6">
        {loading ? (
          <div className="text-center py-8 text-kaizen-gray">
            Loading events...
          </div>
        ) : featuredEvents.length === 0 ? (
          <div className="text-center py-8 text-kaizen-gray">
            {selectedCategory === "all" ? "No events found." : `No ${selectedCategory} events found.`}
          </div>
        ) : (
          featuredEvents.map((event) => (
            <Link key={event._id} href={`/event/${event._id}`} className="block mb-4">
              <Card className="bg-gradient-to-br from-green-600 to-green-800 border-none rounded-3xl overflow-hidden relative p-0 cursor-pointer hover:scale-[1.02] transition-transform">
                <div className="relative h-64">
                  <img
                    src={imageUrl(event.imageUrl) || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 bg-kaizen-white text-kaizen-black px-3 py-1 rounded-lg text-sm font-medium">
                    {event.date ? (
                      <>
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                        <br />
                        {new Date(event.date).toLocaleDateString("en-US", {
                          year: "numeric",
                        })}
                      </>
                    ) : (
                      "TBD"
                    )}
                  </div>
                  {/* Heart Icon */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 text-white hover:bg-white/20"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                  {/* Event Details */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-bold text-xl mb-2">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <MapPin className="w-4 h-4 text-white/80" />
                      <p className="text-white/80 text-sm">{event.location || "Location TBD"}</p>
                    </div>
                    {event.date && (
                      <div className="flex items-center gap-1 mb-4">
                        <Clock className="w-4 h-4 text-white/80" />
                        <p className="text-white/80 text-sm">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })} at{" "}
                          {new Date(event.date).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    )}
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
                        <p className="text-white font-bold text-2xl">
                          {event.price ? `${event.price} XLM` : "Free"}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        if (!getEventStatus(event.date).isCompleted) {
                          handlePurchaseClick(event);
                        }
                      }}
                      disabled={getEventStatus(event.date).isCompleted}
                      className={`w-full font-semibold rounded-full h-12 ${getEventStatus(event.date).className}`}
                    >
                      {getEventStatus(event.date).text}
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        )}

        {/* Fallback static content when no dynamic events */}
        {!loading && events.length === 0 && (selectedCategory === "Live shows" || selectedCategory === "all") && (
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
                      handlePurchaseClick(defaultEvent)
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

        {selectedCategory === "Tourism" && events.length === 0 && (
          <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-none rounded-3xl overflow-hidden relative p-0 cursor-pointer hover:scale-[1.02] transition-transform">
            <div className="relative h-64 flex items-center justify-center">
              <span className="text-white text-xl">No tourism events yet.</span>
            </div>
          </Card>
        )}

        {selectedCategory === "Fever Origin" && events.length === 0 && (
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
          <h2 className="text-kaizen-white font-semibold text-lg">
            Top 10 in London
          </h2>
          <Button
            variant="ghost"
            className="text-kaizen-gray text-sm p-0 h-auto hover:text-kaizen-white"
          >
            See all
          </Button>
        </div>
        <div
          className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {[
            {
              id: 1,
              rating: "5.0",
              image:
                "/community-event.png?height=96&width=128&query=music-festival",
            },
            {
              id: 2,
              rating: "4.8",
              image:
                "/community-event.png?height=96&width=128&query=art-exhibition",
            },
            {
              id: 3,
              rating: "4.9",
              image:
                "/community-event.png?height=96&width=128&query=tech-conference",
            },
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
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-white hover:bg-white/20"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <WalletConnect
        isOpen={showWalletConnect}
        onClose={() => setShowWalletConnect(false)}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        eventTitle={currentSelectedEvent.title}
        eventPrice={`${currentSelectedEvent.price || "50"} XLM`}
        eventImage={imageUrl(currentSelectedEvent.imageUrl) || currentSelectedEvent.imageUrl}
        isWalletConnected={isConnected}
        onConnectWallet={() => setShowWalletConnect(true)}
        eventId={currentSelectedEvent._id}
        organizerAddress={currentSelectedEvent.createdBy?.walletAddress}
        hasNFTReward={true}
      />
    </div>
  );
}
