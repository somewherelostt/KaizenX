"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";

export default function CreateEventPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    price: "",
    seats: "",
    category: "Live shows",
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  type User = { _id: string; [key: string]: any };
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    const res = await fetch("https://kaizenx-production.up.railway.app/api/users/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Combine date and time into a single Date object
      const eventDateTime = new Date(`${form.date}T${form.time}`);
      
      if (eventDateTime <= new Date()) {
        throw new Error("Event date must be in the future");
      }

      await fetchUser();
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("date", eventDateTime.toISOString());
      formData.append("location", form.location);
      formData.append("price", form.price);
      formData.append("seats", form.seats);
      formData.append("category", form.category);
      formData.append("user", user?._id || "");
      
      if (image) formData.append("image", image);

      const res = await fetch("https://kaizenx-production.up.railway.app/api/events", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create event");
      }
      
      router.push("/calendar");
    } catch (err: any) {
      setError(err.message || "Error creating event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-kaizen-black text-kaizen-white max-w-sm mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-8">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="text-kaizen-white hover:bg-kaizen-dark-gray"
        >
          ← Back
        </Button>
        <h1 className="text-xl font-bold">Create Event</h1>
        <div className="w-16"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-kaizen-white text-sm font-medium mb-2 block">
              Event Title *
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter event title"
              value={form.title}
              onChange={handleChange}
              required
              className="bg-kaizen-dark-gray border-kaizen-gray/30 text-kaizen-white placeholder:text-kaizen-gray"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-kaizen-white text-sm font-medium mb-2 block">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your event..."
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="bg-kaizen-dark-gray border-kaizen-gray/30 text-kaizen-white placeholder:text-kaizen-gray resize-none"
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-kaizen-white text-sm font-medium mb-2 block">
              Category *
            </Label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-kaizen-dark-gray border border-kaizen-gray/30 text-kaizen-white rounded-md focus:outline-none focus:ring-2 focus:ring-kaizen-yellow"
            >
              <option value="Live shows">Live shows</option>
              <option value="Tourism">Tourism</option>
              <option value="Fever Origin">Fever Origin</option>
            </select>
          </div>
        </div>

        {/* Date & Time */}
        <div className="space-y-4">
          <h3 className="text-kaizen-white font-semibold flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Date & Time
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="date" className="text-kaizen-white text-sm font-medium mb-2 block">
                Date *
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="bg-kaizen-dark-gray border-kaizen-gray/30 text-kaizen-white"
              />
            </div>

            <div>
              <Label htmlFor="time" className="text-kaizen-white text-sm font-medium mb-2 block">
                Time *
              </Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
                required
                className="bg-kaizen-dark-gray border-kaizen-gray/30 text-kaizen-white"
              />
            </div>
          </div>
        </div>

        {/* Location & Details */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="location" className="text-kaizen-white text-sm font-medium mb-2 block">
              Location *
            </Label>
            <Input
              id="location"
              name="location"
              placeholder="Event venue or address"
              value={form.location}
              onChange={handleChange}
              required
              className="bg-kaizen-dark-gray border-kaizen-gray/30 text-kaizen-white placeholder:text-kaizen-gray"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="price" className="text-kaizen-white text-sm font-medium mb-2 block">
                Price (XLM) *
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
                required
                className="bg-kaizen-dark-gray border-kaizen-gray/30 text-kaizen-white placeholder:text-kaizen-gray"
              />
            </div>

            <div>
              <Label htmlFor="seats" className="text-kaizen-white text-sm font-medium mb-2 block">
                Available Seats *
              </Label>
              <Input
                id="seats"
                name="seats"
                type="number"
                min="1"
                placeholder="250"
                value={form.seats}
                onChange={handleChange}
                required
                className="bg-kaizen-dark-gray border-kaizen-gray/30 text-kaizen-white placeholder:text-kaizen-gray"
              />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <Label htmlFor="image" className="text-kaizen-white text-sm font-medium mb-2 block">
            Event Image
          </Label>
          <div className="relative">
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 bg-kaizen-dark-gray border border-kaizen-gray/30 text-kaizen-white rounded-md file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-kaizen-yellow file:text-kaizen-black hover:file:bg-kaizen-yellow/90"
            />
          </div>
          {image && (
            <p className="text-kaizen-gray text-xs mt-1">
              Selected: {image.name}
            </p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-kaizen-yellow text-kaizen-black hover:bg-kaizen-yellow/90 font-semibold py-3 rounded-xl"
        >
          {loading ? "Creating Event..." : "Create Event"}
        </Button>
      </form>

      <div className="pb-20"></div>
    </div>
  );
}
