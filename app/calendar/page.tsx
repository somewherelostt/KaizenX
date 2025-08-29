"use client";

import { ArrowLeft, Info, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getEventStatus } from "@/lib/eventUtils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function CalendarPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate dates for the current week
  const generateWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay + 1); // Start from Monday

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push({
        date: date.getDate(),
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: new Date(date),
        month: date.getMonth(),
        year: date.getFullYear()
      });
    }
    return dates;
  };

  const dates = generateWeekDates();
  const monthName = new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long' });

  // Filter events for the selected date
  const getEventsForSelectedDate = () => {
    if (!events.length) return [];
    
    const selectedFullDate = dates.find(d => d.date === selectedDate)?.fullDate;
    if (!selectedFullDate) return events; // Show all events if no specific date selected
    
    return events.filter(event => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === selectedFullDate.getDate() &&
        eventDate.getMonth() === selectedFullDate.getMonth() &&
        eventDate.getFullYear() === selectedFullDate.getFullYear()
      );
    });
  };

  const filteredEvents = getEventsForSelectedDate();

  // Fetch events from backend API
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("https://kaizenx-production.up.railway.app/api/events");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
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
        <h2 className="text-kaizen-white font-semibold text-2xl">{monthName} {currentYear}</h2>
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
              key={`${item.date}-${item.month}-${item.year}`}
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
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-kaizen-gray">
            {selectedDate ? `No events found for ${monthName} ${selectedDate}.` : "No events found."}
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-kaizen-white font-medium text-sm">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} for {monthName} {selectedDate}
            </h3>
            {filteredEvents.map((event, index) => (
              <Card
                key={event._id || index}
                className="bg-kaizen-dark-gray border-none rounded-2xl p-4 hover:bg-kaizen-gray/20 transition-colors cursor-pointer"
                onClick={() => router.push(`/event/${event._id}`)}
              >
                <div className="flex items-center gap-3">
                  {/* Event Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={event.imageUrl ? `https://kaizenx-production.up.railway.app${event.imageUrl}` : "/placeholder.svg"}
                      alt={event.title}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-kaizen-white font-semibold text-sm truncate">
                      {event.title}
                    </h3>
                    <p className="text-kaizen-gray text-sm truncate">
                      {event.description || "No description available"}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      {event.date && (
                        <div className="flex items-center gap-1">
                          <div className={`w-3 h-3 rounded-full ${getEventStatus(event.date).isCompleted ? 'bg-kaizen-gray' : 'bg-kaizen-yellow'}`}></div>
                          <span className="text-kaizen-gray text-xs">
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })} at {new Date(event.date).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-kaizen-gray"></div>
                        <span className="text-kaizen-gray text-xs">
                          {event.location || "Location TBD"}
                        </span>
                      </div>
                    </div>
                    {event.category && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="inline-block bg-kaizen-yellow/20 text-kaizen-yellow px-2 py-1 rounded-full text-xs">
                          {event.category}
                        </span>
                        {getEventStatus(event.date).isCompleted && (
                          <span className="inline-block bg-kaizen-gray text-kaizen-white px-2 py-1 rounded-full text-xs">
                            Event Completed
                          </span>
                        )}
                      </div>
                    )}
                    {!event.category && getEventStatus(event.date).isCompleted && (
                      <div className="mt-2">
                        <span className="inline-block bg-kaizen-gray text-kaizen-white px-2 py-1 rounded-full text-xs">
                          Event Completed
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Price and Arrow */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-kaizen-white font-semibold text-sm">
                        {event.price ? `${event.price} XLM` : "Free"}
                      </p>
                      {event.seats && (
                        <p className="text-kaizen-gray text-xs">
                          {event.seats} seats
                        </p>
                      )}
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

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-4">
        <Button
          onClick={() => router.push("/event/create")}
          className="w-14 h-14 bg-kaizen-yellow text-kaizen-black hover:bg-kaizen-yellow/90 rounded-full shadow-lg flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
