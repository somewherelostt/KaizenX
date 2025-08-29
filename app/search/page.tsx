"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  seats: number;
  category: string;
  imageUrl: string;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const response = await fetch(`https://kaizenx-production.up.railway.app/api/events/search/${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const results = await response.json();
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-kaizen-black text-kaizen-white max-w-sm mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Search Events</h1>
        
        {/* Search Input */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-kaizen-gray" />
            <Input
              placeholder="Search for events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 bg-kaizen-gray/20 border-kaizen-gray/30 text-kaizen-white placeholder-kaizen-gray/60"
            />
          </div>
          <Button 
            onClick={handleSearch}
            disabled={isLoading || !searchQuery.trim()}
            className="bg-kaizen-purple hover:bg-kaizen-purple/80"
          >
            {isLoading ? "..." : "Search"}
          </Button>
        </div>
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        {isLoading && (
          <div className="text-center text-kaizen-gray">
            Searching...
          </div>
        )}

        {hasSearched && !isLoading && searchResults.length === 0 && (
          <div className="text-center text-kaizen-gray">
            No events found for "{searchQuery}". Try searching with different keywords.
          </div>
        )}

        {searchResults.map((event) => (
          <Link key={event._id} href={`/event/${event._id}`}>
            <Card className="bg-kaizen-gray/20 border-kaizen-gray/30 hover:bg-kaizen-gray/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Event Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={event.imageUrl ? `https://kaizenx-production.up.railway.app${event.imageUrl}` : "/placeholder.jpg"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.jpg";
                      }}
                    />
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-kaizen-white truncate mb-1">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-1 text-sm text-kaizen-gray">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>${event.price}</span>
                        <span className="text-kaizen-gray/60">• {event.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {!hasSearched && (
        <div className="text-center text-kaizen-gray mt-8">
          <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Enter an event name to start searching</p>
        </div>
      )}
    </div>
  );
}