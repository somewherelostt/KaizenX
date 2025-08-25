import mongoose from "mongoose";

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

const Event = mongoose.model("Event", eventSchema);
export default Event;
