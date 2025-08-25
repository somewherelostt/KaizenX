"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    time: "",
    location: "",
    price: "",
    seats: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // TODO: Integrate wallet and Stellar transaction
  // For now, just submit to backend
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      // TODO: Trigger Stellar testnet transaction here
      // Example: await sendStellarTransaction(form)

      // Submit event to backend with image
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("subtitle", form.subtitle);
      formData.append("time", form.time);
      formData.append("location", form.location);

      formData.append("price", form.price);
      formData.append("seats", form.seats);
      if (image) formData.append("image", image);

      const res = await fetch("/api/events", {
        method: "POST",
        // headers: { "Content-Type": "multipart/form-data" }, // Let browser set this
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to create event");
      router.push("/calendar");
    } catch (err: any) {
      setError(err.message || "Error creating event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-kaizen-black text-kaizen-white max-w-sm mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">List a New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="title"
          placeholder="Event Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <Input
          name="subtitle"
          placeholder="Subtitle"
          value={form.subtitle}
          onChange={handleChange}
          required
        />
        <Input
          name="time"
          placeholder="Time (e.g. 08:00 AM)"
          value={form.time}
          onChange={handleChange}
          required
        />
        <Input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />
        <Input
          name="price"
          placeholder="Price (e.g. 40)"
          value={form.price}
          onChange={handleChange}
          required
        />
        <Input
          name="seats"
          placeholder="Seats Available (e.g. 250)"
          value={form.seats}
          onChange={handleChange}
          required
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {/* TODO: Add wallet connect and Stellar transaction UI */}
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Listing..." : "List Event"}
        </Button>
      </form>
    </div>
  );
}
