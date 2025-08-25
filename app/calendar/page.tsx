"use client";

import { ArrowLeft, Info, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function CalendarPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(14);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const dates = [
    { date: 12, day: "Mon" },
    { date: 13, day: "Tue" },
    { date: 14, day: "Wed" },
    { date: 15, day: "Thu" },
    { date: 16, day: "Fri" },
    { date: 17, day: "Sat" },
  ];

  // Fetch events from backend API
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

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
        <h1 className="text-kaizen-white font-semibold text-lg">
          Upcoming Event
        </h1>
        <Button
          variant="ghost"
          size="icon"
          className="text-kaizen-white hover:bg-kaizen-dark-gray rounded-full"
        >
          <Info className="w-5 h-5" />
        </Button>
      </div>

      {/* Month */}
      <div className="px-4 mb-6">
        <h2 className="text-kaizen-white font-semibold text-2xl">January</h2>
      </div>

      {/* Date Selector */}
      <div className="px-4 mb-6 hide-scrollbar" style={{ overflow: "hidden" }}>
        <div
          className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {dates.map((item) => (
            <button
              key={item.date}
              onClick={() => setSelectedDate(item.date)}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-12 h-16 rounded-2xl transition-colors ${
                selectedDate === item.date
                  ? "bg-kaizen-yellow text-kaizen-black"
                  : "bg-kaizen-dark-gray text-kaizen-white hover:bg-kaizen-gray/50"
              }`}
            >
              <span className="text-2xl font-bold">{item.date}</span>
              <span className="text-xs font-medium">{item.day}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="px-4 pb-20">
        {loading ? (
          <div className="text-center py-8 text-kaizen-gray">
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8 text-kaizen-gray">
            No events found.
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <Card
                key={event.id}
                className="bg-kaizen-dark-gray border-none rounded-2xl p-4 hover:bg-kaizen-gray/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {/* Event Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={event.imageUrl ? event.imageUrl : "/placeholder.svg"}
                      alt={event.title}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-kaizen-white font-semibold text-sm truncate">
                      {event.title}
                    </h3>
                    <p className="text-kaizen-white text-sm truncate">
                      {event.subtitle}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-kaizen-yellow"></div>
                        <span className="text-kaizen-gray text-xs">
                          {event.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-kaizen-gray"></div>
                        <span className="text-kaizen-gray text-xs">
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Participants and Arrow */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1">
                        {(event.participants || []).map(
                          (participant: string, index: number) => (
                            <Avatar
                              key={index}
                              className="w-6 h-6 border border-kaizen-black"
                            >
                              <AvatarImage
                                src={participant || "/placeholder.svg"}
                              />
                              <AvatarFallback className="bg-kaizen-yellow text-kaizen-black text-xs">
                                {index + 1}
                              </AvatarFallback>
                            </Avatar>
                          )
                        )}
                        <div className="w-6 h-6 bg-kaizen-yellow rounded-full flex items-center justify-center border border-kaizen-black">
                          <span className="text-kaizen-black text-xs font-bold">
                            {event.participantCount}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-kaizen-white hover:bg-kaizen-gray/20 w-8 h-8"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
