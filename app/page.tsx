"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Home,
  User,
  Filter,
  Heart,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WalletConnect } from "@/components/wallet-connect";
import { WalletStatus } from "@/components/wallet-status";
import { PurchaseModal } from "@/components/purchase-modal";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function KaizenApp() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState("Live shows");
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletInfo, setWalletInfo] = useState({
    name: "",
    address: "",
    balance: "0",
  });
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("http://localhost:4000/api/events");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Filter events by selectedCategory
  const featuredEvents = events.filter(
    (event) =>
      selectedCategory === "all" ||
      (event.category && event.category === selectedCategory)
  );

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === "calendar") {
      router.push("/calendar");
    } else if (tab === "profile") {
      router.push("/profile");
    }
  };

  const handleWalletConnect = (walletName: string) => {
    setWalletConnected(true);
    setWalletInfo({
      name: walletName,
      address: "GCKFBEIYTKQTPD5ZXQGZXPQJQUZN3KYJCSJDMB7QBWQTQXQZXQGZXPQJ",
      balance: "1,234.56",
    });
  };

  const handleWalletDisconnect = () => {
    setWalletConnected(false);
    setWalletInfo({ name: "", address: "", balance: "0" });
  };

  const handlePurchaseClick = () => {
    setShowPurchaseModal(true);
  };

  return (
    <div className="min-h-screen bg-kaizen-black text-kaizen-white max-w-sm mx-auto relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/abstract-profile.png" />
            <AvatarFallback className="bg-kaizen-dark-gray text-kaizen-white">
              CJ
            </AvatarFallback>
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
            No events found.
          </div>
        ) : (
          featuredEvents.map((event) => (
            <Link key={event._id} href={`/event/${event._id}`}>
              <Card className="bg-gradient-to-br from-green-600 to-green-800 border-none rounded-3xl overflow-hidden relative p-0 cursor-pointer hover:scale-[1.02] transition-transform">
                <div className="relative h-64">
                  <img
                    src={event.imageUrl || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 bg-kaizen-white text-kaizen-black px-3 py-1 rounded-lg text-sm font-medium">
                    {event.date
                      ? new Date(event.date).toLocaleString("default", {
                          month: "short",
                        })
                      : ""}
                    <br />
                    {event.date ? new Date(event.date).getDate() : ""}
                  </div>
                  {/* Heart Icon */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 text-white hover:bg-white/20"
                  >
                    <Heart className="w-5 h-5" />
                  </Button>
                  {/* Event Details */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-bold text-xl mb-2">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-1 mb-4">
                      <MapPin className="w-4 h-4 text-white/80" />
                      <p className="text-white/80 text-sm">{event.location}</p>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div />
                      <div className="text-right">
                        <p className="text-white font-bold text-2xl">
                          {event.price ? `$${event.price}` : ""}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        handlePurchaseClick();
                      }}
                      className="w-full bg-kaizen-yellow text-kaizen-black hover:bg-kaizen-yellow/90 font-semibold rounded-full h-12"
                    >
                      Join now
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))
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

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-kaizen-black border-t border-kaizen-dark-gray">
        <div className="flex items-center justify-around py-3">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${
              activeTab === "home"
                ? "bg-kaizen-yellow text-kaizen-black"
                : "text-kaizen-gray hover:text-kaizen-white"
            }`}
            onClick={() => handleTabClick("home")}
          >
            <Home className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${
              activeTab === "search"
                ? "bg-kaizen-yellow text-kaizen-black"
                : "text-kaizen-gray hover:text-kaizen-white"
            }`}
            onClick={() => handleTabClick("search")}
          >
            <Search className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${
              activeTab === "calendar"
                ? "bg-kaizen-yellow text-kaizen-black"
                : "text-kaizen-gray hover:text-kaizen-white"
            }`}
            onClick={() => handleTabClick("calendar")}
          >
            <Calendar className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${
              activeTab === "profile"
                ? "bg-kaizen-yellow text-kaizen-black"
                : "text-kaizen-gray hover:text-kaizen-white"
            }`}
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
        eventPrice="$40.230"
        eventImage="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-zY5f7bxQlrK3C1CkraP1yzFTbVqxtc.png"
        isWalletConnected={walletConnected}
        onConnectWallet={() => setShowWalletConnect(true)}
      />
    </div>
  );
}
