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
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("nfts");
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  // Check for token on mount
  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
    if (t) fetchProfile(t);
  }, []);

  // Fetch user profile
  async function fetchProfile(token: string) {
    try {
      // Replace with your backend endpoint for current user
      const res = await fetch("http://localhost:4000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Not authenticated");
      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    }
  }

  // Login handler
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      setToken(data.token);
      localStorage.setItem("token", data.token);
      fetchProfile(data.token);
    } catch (err: any) {
      setError(err.message);
    }
  }

  // Signup handler
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupForm),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Signup failed");
      }
      // Auto-login after signup
      setLoginForm({ email: signupForm.email, password: signupForm.password });
      await handleLogin(e);
    } catch (err: any) {
      setError(err.message);
    }
  }

  // Logout handler
  function handleLogout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    setLoginForm({ email: "", password: "" });
    setSignupForm({ username: "", email: "", password: "" });
  }

  const nftCollection = [
    {
      id: 1,
      name: "Blackpink Concert POAP",
      event: "Blackpink Concert",
      date: "May 20, 2024",
      image: "/nft-concert-badge.png",
      rarity: "Legendary",
      attendees: "1,234",
    },
    {
      id: 2,
      name: "Tech Summit 2024",
      event: "Web3 Tech Summit",
      date: "March 15, 2024",
      image: "/nft-tech-summit.png",
      rarity: "Rare",
      attendees: "856",
    },
    {
      id: 3,
      name: "Art Gallery Opening",
      event: "Modern Art Exhibition",
      date: "February 8, 2024",
      image: "/nft-art-gallery.png",
      rarity: "Common",
      attendees: "432",
    },
    {
      id: 4,
      name: "Music Festival Pass",
      event: "Summer Music Fest",
      date: "January 22, 2024",
      image: "/nft-music-festival.png",
      rarity: "Epic",
      attendees: "2,156",
    },
  ];

  const eventHistory = [
    {
      id: 1,
      name: "Blackpink Concert",
      date: "May 20, 2024",
      location: "New York",
      status: "attended",
      image: "/concert-performer.png",
    },
    {
      id: 2,
      name: "Web3 Tech Summit",
      date: "March 15, 2024",
      location: "San Francisco",
      status: "attended",
      image: "/community-event.png",
    },
    {
      id: 3,
      name: "Comedy Night",
      date: "June 17, 2024",
      location: "California",
      status: "upcoming",
      image: "/community-event.png",
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
  if (!token || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-kaizen-black text-kaizen-white">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <form onSubmit={handleLogin} className="space-y-3 w-full max-w-xs">
          <input
            className="w-full p-2 rounded bg-kaizen-dark-gray text-kaizen-white"
            type="email"
            placeholder="Email"
            value={loginForm.email}
            onChange={(e) =>
              setLoginForm((f) => ({ ...f, email: e.target.value }))
            }
            required
          />
          <input
            className="w-full p-2 rounded bg-kaizen-dark-gray text-kaizen-white"
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm((f) => ({ ...f, password: e.target.value }))
            }
            required
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <div className="my-4 text-kaizen-gray">or</div>
        <h2 className="text-xl font-bold mb-2">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-3 w-full max-w-xs">
          <input
            className="w-full p-2 rounded bg-kaizen-dark-gray text-kaizen-white"
            type="text"
            placeholder="Username"
            value={signupForm.username}
            onChange={(e) =>
              setSignupForm((f) => ({ ...f, username: e.target.value }))
            }
            required
          />
          <input
            className="w-full p-2 rounded bg-kaizen-dark-gray text-kaizen-white"
            type="email"
            placeholder="Email"
            value={signupForm.email}
            onChange={(e) =>
              setSignupForm((f) => ({ ...f, email: e.target.value }))
            }
            required
          />
          <input
            className="w-full p-2 rounded bg-kaizen-dark-gray text-kaizen-white"
            type="password"
            placeholder="Password"
            value={signupForm.password}
            onChange={(e) =>
              setSignupForm((f) => ({ ...f, password: e.target.value }))
            }
            required
          />
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
        {error && <div className="text-red-500 mt-4">{error}</div>}
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
          onClick={() => handleLogout()}
          className="text-kaizen-white hover:bg-kaizen-dark-gray rounded-full"
        >
          {/* <button
            onClick={() => handleLogout()}
            className="text-kaizen-white hover:bg-kaizen-dark-gray rounded-full"
          > */}
          <LogOutIcon className="w-5 h-5" />
          {/* </button> */}
        </Button>
      </div>

      {/* Profile Info */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src="/abstract-profile.png" />
            <AvatarFallback className="bg-kaizen-dark-gray text-kaizen-white text-xl">
              CJ
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-kaizen-white font-bold text-xl">
              {user?.username || "Christian Johnson"}
            </h2>
            <p className="text-kaizen-gray text-sm mb-2">
              Web3 Event Enthusiast
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-kaizen-gray text-xs">Wallet Connected</span>
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
              {nftCollection.length}
            </p>
            <p className="text-kaizen-gray text-xs">NFTs Collected</p>
          </Card>
          <Card className="bg-kaizen-dark-gray border-none rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5 text-kaizen-yellow" />
            </div>
            <p className="text-kaizen-white font-bold text-lg">
              {eventHistory.filter((e) => e.status === "attended").length}
            </p>
            <p className="text-kaizen-gray text-xs">Events Attended</p>
          </Card>
          <Card className="bg-kaizen-dark-gray border-none rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Wallet className="w-5 h-5 text-kaizen-yellow" />
            </div>
            <p className="text-kaizen-white font-bold text-lg">1,234</p>
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
