// Test script to create events with different dates (past and future) to demonstrate completion functionality

const mongoose = require('mongoose');

// Define the event schema (same as in Event.js)
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String },
  price: { type: Number, required: true, min: 0 },
  seats: { type: Number, required: true, min: 1 },
  category: { 
    type: String, 
    required: true,
    enum: ["Live shows", "Tourism", "Fever Origin"],
    default: "Live shows"
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.model('Event', eventSchema);

// Test data with both completed (past) and upcoming events
const testEvents = [
  {
    title: "Pokemon Card Trading Event (COMPLETED)",
    description: "A community event for Pokemon card collectors and traders",
    date: new Date('2025-08-25T14:00:00Z'), // Past date - completed event
    location: "Community Center Hall A",
    price: 15,
    seats: 50,
    category: "Fever Origin"
  },
  {
    title: "Summer Music Festival (COMPLETED)",
    description: "Amazing live music performances from local artists",
    date: new Date('2025-08-20T18:00:00Z'), // Past date - completed event
    location: "Central Park Amphitheater", 
    price: 75,
    seats: 200,
    category: "Live shows"
  },
  {
    title: "Tech Conference 2025 (UPCOMING)",
    description: "Latest trends in technology and innovation",
    date: new Date('2025-09-15T09:00:00Z'), // Future date - upcoming event
    location: "Convention Center",
    price: 100,
    seats: 150,
    category: "Live shows"
  },
  {
    title: "City Walking Tour (UPCOMING)", 
    description: "Discover hidden gems and local history",
    date: new Date('2025-08-30T10:00:00Z'), // Future date - upcoming event
    location: "City Square",
    price: 25,
    seats: 30,
    category: "Tourism"
  }
];

async function createTestEvents() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://eventapp:eventapp@cluster0.n4p4x.mongodb.net/event-app?retryWrites=true&w=majority&appName=Cluster0', {
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');
    
    // Create test events
    const createdEvents = await Event.insertMany(testEvents);
    console.log(`Created ${createdEvents.length} test events:`);
    
    createdEvents.forEach(event => {
      const isCompleted = event.date < new Date();
      console.log(`- ${event.title} (${isCompleted ? 'COMPLETED' : 'UPCOMING'})`);
      console.log(`  Date: ${event.date.toLocaleDateString()} at ${event.date.toLocaleTimeString()}`);
      console.log(`  Price: ${event.price} XLM, Seats: ${event.seats}`);
      console.log('');
    });
    
    console.log('Test events created successfully!');
    
  } catch (error) {
    console.error('Error creating test events:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
createTestEvents();
