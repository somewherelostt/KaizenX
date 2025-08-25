import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Event from './src/models/Event.js';
import User from './src/models/User.js';

dotenv.config();

async function clearDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(`${process.env.DB_URL}`, {
      ssl: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Show current counts before deletion
    const eventCount = await Event.countDocuments();
    const userCount = await User.countDocuments();
    
    console.log(`\n📊 Current database status:`);
    console.log(`   Events: ${eventCount}`);
    console.log(`   Users: ${userCount}`);
    
    if (eventCount === 0 && userCount === 0) {
      console.log('\n✅ Database is already empty!');
      await mongoose.disconnect();
      return;
    }
    
    // Ask for confirmation (in a real scenario, you might want to add readline for interactive confirmation)
    console.log('\n⚠️  WARNING: This will delete ALL data from the database!');
    console.log('   This action cannot be undone.');
    
    // Delete all events
    if (eventCount > 0) {
      const eventResult = await Event.deleteMany({});
      console.log(`\n🗑️  Deleted ${eventResult.deletedCount} events`);
    }
    
    // Delete all users
    if (userCount > 0) {
      const userResult = await User.deleteMany({});
      console.log(`🗑️  Deleted ${userResult.deletedCount} users`);
    }
    
    // Verify deletion
    const finalEventCount = await Event.countDocuments();
    const finalUserCount = await User.countDocuments();
    
    console.log(`\n✅ Database cleared successfully!`);
    console.log(`   Events remaining: ${finalEventCount}`);
    console.log(`   Users remaining: ${finalUserCount}`);
    
    if (finalEventCount === 0 && finalUserCount === 0) {
      console.log('\n🎉 Database is now completely clean and ready for presentation!');
    }
    
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Add a safer version that only deletes test data (events without real users)
async function clearTestData() {
  try {
    await mongoose.connect(`${process.env.DB_URL}`, {
      ssl: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Delete only events that don't have a createdBy field or have test users
    const testEvents = await Event.find({ 
      $or: [
        { createdBy: { $exists: false } },
        { createdBy: null }
      ]
    });
    
    console.log(`\n📊 Found ${testEvents.length} test events to delete`);
    
    if (testEvents.length > 0) {
      const result = await Event.deleteMany({ 
        $or: [
          { createdBy: { $exists: false } },
          { createdBy: null }
        ]
      });
      console.log(`🗑️  Deleted ${result.deletedCount} test events`);
    }
    
    console.log('\n✅ Test data cleared successfully!');
    
  } catch (error) {
    console.error('❌ Error clearing test data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Check command line arguments
const args = process.argv.slice(2);
const command = args[0];

console.log('🧹 MongoDB Database Cleaner');
console.log('============================\n');

if (command === '--test-only') {
  console.log('🔍 Running in TEST-ONLY mode (safer)');
  console.log('   This will only delete events without associated users\n');
  clearTestData();
} else if (command === '--all') {
  console.log('💣 Running in ALL mode (destructive)');
  console.log('   This will delete ALL events and users\n');
  clearDatabase();
} else {
  console.log('Usage:');
  console.log('  node clear-database.js --test-only   # Delete only test events (safer)');
  console.log('  node clear-database.js --all         # Delete all data (destructive)');
  console.log('\nRecommended: Use --test-only for safer cleanup');
  process.exit(1);
}

export { clearDatabase, clearTestData };
