import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";
import mongoose from "mongoose";
import User from "./models/User.js";
import Event from "./models/Event.js";
import { register, login, authMiddleware } from "./auth.js";
import upload from "./upload.js";
import path from "path";
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());

app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const pool = new Pool();

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// --- AUTH ---
app.post("/api/register", register);
app.post("/api/login", login);

// Get current user (protected)
app.get("/api/users/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});
// Event image upload (protected)
app.post(
  "/api/events/:id/image",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ error: "No image uploaded" });
      const event = await Event.findByIdAndUpdate(
        req.params.id,
        { imageUrl: `/uploads/${req.file.filename}` },
        { new: true }
      );
      if (!event) return res.status(404).json({ error: "Event not found" });
      res.json(event);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(400).json({ error: message });
    }
  }
);

// --- USER CRUD (protected) ---
app.post("/api/users", authMiddleware, async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

// User profile image upload (protected)
app.post(
  "/api/users/:id/image",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ error: "No image uploaded" });
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { imageUrl: `/uploads/${req.file.filename}` },
        { new: true }
      );
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      res.status(400).json({ error: message });
    }
  }
);

// Get all Users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

// Get User by ID
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

// Update User
app.put("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

// Delete User
app.delete("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

// --- EVENT CRUD ---
// Create Event (with image upload, protected)
app.post("/api/events", upload.single("image"), async (req, res) => {
  try {
    const eventData = {
      title: req.body.title,
      description: req.body.description,
      date: new Date(req.body.date),
      location: req.body.location,
      price: parseFloat(req.body.price),
      seats: parseInt(req.body.seats),
      category: req.body.category || "Live shows",
    };

    // Validate date is in the future
    if (eventData.date <= new Date()) {
      return res.status(400).json({ error: "Event date must be in the future" });
    }

    if (req.file) {
      eventData.imageUrl = `/uploads/${req.file.filename}`;
    }

    if (req.body.user) {
      eventData.createdBy = req.body.user;
    }

    const event = new Event(eventData);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.log("Event creation error:", message);
    res.status(400).json({ error: message });
  }
});

// Get all Events
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy");
    res.json(events);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

// Search Events by name
app.get("/api/events/search/:query", async (req, res) => {
  try {
    const { query } = req.params;
    const events = await Event.find({
      title: { $regex: query, $options: 'i' } // Case-insensitive search
    }).populate("createdBy");
    res.json(events);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

// Get Event by ID
app.get("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy");
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

// Update Event
app.put("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(400).json({ error: message });
  }
});

// Delete Event
app.delete("/api/events/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

// MongoDB connection
const dbUrl = process.env.DB_URL || process.env.DATABASE_URL;
console.log("DB_URL environment variable:", process.env.DB_URL ? "Set" : "NOT SET");
console.log("DATABASE_URL environment variable:", process.env.DATABASE_URL ? "Set" : "NOT SET");
console.log("Available environment variables:", Object.keys(process.env).filter(key => key.includes('DB') || key.includes('DATABASE')));

if (!dbUrl) {
  console.error("❌ Neither DB_URL nor DATABASE_URL environment variable is set!");
  console.error("Make sure to set DB_URL in Railway Variables tab with your MongoDB connection string");
  process.exit(1);
}

mongoose.connect(dbUrl, {
  ssl: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
