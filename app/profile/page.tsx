"use client";

import {
  ArrowLeft,
  Settings,
  Share,
  Trophy,
  Calendar,
  Wallet,
  ExternalLink,
  LogOutIcon,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("nfts");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [userNFTs, setUserNFTs] = useState<any[]>([]);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const { user, isAuthenticated, logout, isLoading, token } = useAuth();
  const { balance, isConnected } = useWallet();

  // Redirect to home if not authenticated and not loading
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isLoading, isAuthenticated]);

  // Fetch user's events and NFTs when authenticated
  useEffect(() => {
    if (isAuthenticated && user && token) {
      fetchUserData();
    }
  }, [isAuthenticated, user, token]);

  const fetchUserData = async () => {
    try {
      setLoadingUserData(true);
      // Fetch events from backend - you can expand this to get user-specific events
      const eventsRes = await fetch("http://localhost:4000/api/events");
      const allEvents = await eventsRes.json();
      
      // For demo purposes, we'll simulate user's attended events
      // In a real app, you'd have a user-events relationship in your backend
      const attendedEvents = allEvents.slice(0, 2).map((event: any) => ({
        id: event._id,
        name: event.title,
        date: new Date(event.date).toLocaleDateString(),
        location: event.location || "TBD",
        status: "attended",
        image: event.imageUrl ? `http://localhost:4000${event.imageUrl}` : "/community-event.png",
      }));

      // Add a future event
      if (allEvents.length > 2) {
        attendedEvents.push({
          id: allEvents[2]._id,
          name: allEvents[2].title,
          date: new Date(allEvents[2].date).toLocaleDateString(),
          location: allEvents[2].location || "TBD", 
          status: "upcoming",
          image: allEvents[2].imageUrl ? `http://localhost:4000${allEvents[2].imageUrl}` : "/community-event.png",
        });
      }

      setUserEvents(attendedEvents);

      // Generate NFTs based on attended events
      const generatedNFTs = attendedEvents
        .filter((event: any) => event.status === "attended")
        .map((event: any, index: number) => ({
          id: index + 1,
          name: `${event.name} POAP`,
          event: event.name,
          date: event.date,
          image: event.image,
          rarity: index === 0 ? "Legendary" : index === 1 ? "Rare" : "Common",
          attendees: Math.floor(Math.random() * 2000 + 100).toString(),
        }));

      setUserNFTs(generatedNFTs);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserEvents([]);
      setUserNFTs([]);
    } finally {
      setLoadingUserData(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Use dynamic data or fallback to static data
  const nftCollection = userNFTs.length > 0 ? userNFTs : [
    {
      id: 1,
      name: "Sample POAP",
      event: "Sample Event",
      date: "Jan 1, 2024",
      image: "/placeholder.svg",
      rarity: "Common",
      attendees: "0",
    },
  ];

  const eventHistory = userEvents.length > 0 ? userEvents : [
    {
      id: 1,
      name: "Sample Event",
      date: "Jan 1, 2024",
      location: "Sample Location",
      status: "attended",
      image: "/placeholder.svg",
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "legendary":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "epic":
        return "text-purple-400 bg-purple-400/10 border-purple-400/20";
      case "rare":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      default:
        return "text-kaizen-gray bg-kaizen-gray/10 border-kaizen-gray/20";
    }
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kaizen-black text-kaizen-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kaizen-yellow mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-kaizen-black text-kaizen-white max-w-sm mx-auto relative">
        <div className="flex items-center justify-between p-4 pt-12">
          <Button
            variant="ghost"
            size="icon"
            className="text-kaizen-white hover:bg-kaizen-dark-gray rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-kaizen-white font-semibold text-lg">Profile</h1>
          <div></div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-kaizen-white mb-2">
              Sign in to view your profile
            </h2>
            <p className="text-kaizen-gray">
              Access your NFT collection and event history
            </p>
          </div>
          <Button
            onClick={() => setShowAuthModal(true)}
            className="w-full max-w-xs bg-kaizen-yellow text-kaizen-black hover:bg-kaizen-yellow/90 font-semibold rounded-full h-12"
          >
            Sign In / Sign Up
          </Button>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-kaizen-black text-kaizen-white max-w-sm mx-auto relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <Button
          variant="ghost"
          size="icon"
          className="text-kaizen-white hover:bg-kaizen-dark-gray rounded-full"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-kaizen-white font-semibold text-lg">Profile</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-kaizen-white hover:bg-kaizen-dark-gray rounded-full"
        >
          <LogOutIcon className="w-5 h-5" />
        </Button>
      </div>

      {/* Profile Info */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={user?.imageUrl ? `http://localhost:4000${user.imageUrl}` : "/abstract-profile.png"} />
            <AvatarFallback className="bg-kaizen-dark-gray text-kaizen-white text-xl">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-kaizen-white font-bold text-xl">
              {user?.username || "User"}
            </h2>
            <p className="text-kaizen-gray text-sm mb-2">
              Web3 Event Enthusiast
            </p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-kaizen-gray text-xs">
                {isConnected ? "Wallet Connected" : "Wallet Not Connected"}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/event/create")}
            className="text-kaizen-white hover:bg-kaizen-dark-gray rounded-full"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-kaizen-dark-gray border-none rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="w-5 h-5 text-kaizen-yellow" />
            </div>
            <p className="text-kaizen-white font-bold text-lg">
              {loadingUserData ? "..." : nftCollection.length}
            </p>
            <p className="text-kaizen-gray text-xs">NFTs Collected</p>
          </Card>
          <Card className="bg-kaizen-dark-gray border-none rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 text-kaizen-yellow" />
            </div>
            <p className="text-kaizen-white font-bold text-lg">
              {loadingUserData ? "..." : eventHistory.filter((e) => e.status === "attended").length}
            </p>
            <p className="text-kaizen-gray text-xs">Events Attended</p>
          </Card>
          <Card className="bg-kaizen-dark-gray border-none rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Wallet className="w-5 h-5 text-kaizen-yellow" />
            </div>
            <p className="text-kaizen-white font-bold text-lg">
              {isConnected ? parseFloat(balance).toFixed(0) : "0"}
            </p>
            <p className="text-kaizen-gray text-xs">XLM Balance</p>
          </Card>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 mb-6">
        <div className="flex bg-kaizen-dark-gray rounded-full p-1">
          <button
            onClick={() => setActiveTab("nfts")}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
              activeTab === "nfts"
                ? "bg-kaizen-yellow text-kaizen-black"
                : "text-kaizen-gray hover:text-kaizen-white"
            }`}
          >
            NFT Collection
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
              activeTab === "history"
                ? "bg-kaizen-yellow text-kaizen-black"
                : "text-kaizen-gray hover:text-kaizen-white"
            }`}
          >
            Event History
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-20">
        {activeTab === "nfts" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-kaizen-white font-semibold text-lg">
                My NFTs
              </h3>
              <span className="text-kaizen-gray text-sm">
                {nftCollection.length} items
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {nftCollection.map((nft) => (
                <Card
                  key={nft.id}
                  className="bg-kaizen-dark-gray border-none rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                >
                  <div className="aspect-square relative">
                    <img
                      src={
                        nft.image ||
                        "/placeholder.svg?height=200&width=200&query=nft-badge"
                      }
                      alt={nft.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getRarityColor(
                          nft.rarity
                        )}`}
                      >
                        {nft.rarity}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-kaizen-white font-semibold text-sm mb-1 truncate">
                      {nft.name}
                    </h4>
                    <p className="text-kaizen-gray text-xs mb-2 truncate">
                      {nft.event}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-kaizen-gray text-xs">
                        {nft.date}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-kaizen-gray text-xs">
                          {nft.attendees}
                        </span>
                        <ExternalLink className="w-3 h-3 text-kaizen-gray" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-kaizen-white font-semibold text-lg">
                Event History
              </h3>
              <span className="text-kaizen-gray text-sm">
                {eventHistory.length} events
              </span>
            </div>
            <div className="space-y-3">
              {eventHistory.map((event) => (
                <Card
                  key={event.id}
                  className="bg-kaizen-dark-gray border-none rounded-2xl p-4 cursor-pointer hover:bg-kaizen-gray/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-kaizen-white font-semibold text-sm truncate">
                        {event.name}
                      </h4>
                      <p className="text-kaizen-gray text-xs">
                        {event.location}
                      </p>
                      <p className="text-kaizen-gray text-xs">{event.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === "attended"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-kaizen-yellow/20 text-kaizen-yellow"
                        }`}
                      >
                        {event.status === "attended" ? "Attended" : "Upcoming"}
                      </span>
                      <ExternalLink className="w-4 h-4 text-kaizen-gray" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
