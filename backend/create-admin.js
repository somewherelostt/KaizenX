import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure dotenv
dotenv.config({ 
  path: path.join(__dirname, '.env'),
  debug: true
});

// User model (inline to avoid import issues)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

async function createAdminUser() {
  try {
    const dbUrl = process.env.DB_URL;
    if (!dbUrl) {
      console.error("DB_URL not found in environment variables");
      process.exit(1);
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB successfully");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      console.log("Email: admin@gmail.com");
      console.log("Password: admin@123");
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin', 10);
    const adminUser = new User({
      username: 'admin',
      email: 'admin@gmail.com',
      password: hashedPassword
    });

    await adminUser.save();
    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@gmail.com");
    console.log("🔐 Password: admin");
    console.log("👥 This account can be used by judges and testers on Vercel");

  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

createAdminUser();
