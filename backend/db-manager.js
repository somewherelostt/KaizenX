import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Event from './src/models/Event.js';
import User from './src/models/User.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function listDatabaseContents() {
  try {
    await mongoose.connect(`${process.env.DB_URL}`, {
      ssl: true,
    });
    
    console.log('📊 Database Contents:');
    console.log('==================\n');
    
    // List all events
    const events = await Event.find().populate('createdBy').limit(10);
    console.log(`📅 Events (showing first 10 of ${await Event.countDocuments()}):`);
    events.forEach((event, index) => {
      console.log(`  ${index + 1}. "${event.title}" - ${new Date(event.date).toLocaleDateString()} - $${event.price}`);
    });
    
    // List all users
    const users = await User.find().limit(10);
    console.log(`\n👥 Users (showing first 10 of ${await User.countDocuments()}):`);
    users.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.name} (${user.email})`);
    });
    
    return { events, users };
    
  } catch (error) {
    console.error('❌ Error listing database contents:', error);
  } finally {
    await mongoose.disconnect();
  }
}

async function deleteEventsByCategory(category) {
  try {
    await mongoose.connect(`${process.env.DB_URL}`, {
      ssl: true,
    });
    
    const result = await Event.deleteMany({ category: category });
    console.log(`🗑️  Deleted ${result.deletedCount} events in category: ${category}`);
    
  } catch (error) {
    console.error('❌ Error deleting events by category:', error);
  } finally {
    await mongoose.disconnect();
  }
}

async function deleteOldEvents(days = 30) {
  try {
    await mongoose.connect(`${process.env.DB_URL}`, {
      ssl: true,
    });
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const result = await Event.deleteMany({ 
      createdAt: { $lt: cutoffDate } 
    });
    
    console.log(`🗑️  Deleted ${result.deletedCount} events older than ${days} days`);
    
  } catch (error) {
    console.error('❌ Error deleting old events:', error);
  } finally {
    await mongoose.disconnect();
  }
}

async function clearUploads() {
  try {
    const uploadsDir = path.join(__dirname, 'uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      console.log('📁 No uploads directory found');
      return;
    }
    
    const files = fs.readdirSync(uploadsDir);
    let deletedCount = 0;
    
    files.forEach(file => {
      if (file !== '.gitkeep') { // Keep .gitkeep if it exists
        fs.unlinkSync(path.join(uploadsDir, file));
        deletedCount++;
      }
    });
    
    console.log(`🗑️  Deleted ${deletedCount} uploaded files`);
    
  } catch (error) {
    console.error('❌ Error clearing uploads:', error);
  }
}

async function createBackup() {
  try {
    await mongoose.connect(`${process.env.DB_URL}`, {
      ssl: true,
    });
    
    const events = await Event.find().populate('createdBy');
    const users = await User.find();
    
    const backup = {
      timestamp: new Date().toISOString(),
      events: events,
      users: users
    };
    
    const backupFileName = `backup-${Date.now()}.json`;
    fs.writeFileSync(backupFileName, JSON.stringify(backup, null, 2));
    
    console.log(`💾 Backup created: ${backupFileName}`);
    console.log(`   Events: ${events.length}, Users: ${users.length}`);
    
  } catch (error) {
    console.error('❌ Error creating backup:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Main function to handle commands
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  console.log('🛠️  MongoDB Management Tool');
  console.log('============================\n');
  
  switch (command) {
    case '--list':
      await listDatabaseContents();
      break;
      
    case '--clear-all':
      console.log('💣 Clearing ALL data...');
      // Import and run the clear database function
      const { clearDatabase } = await import('./clear-database.js');
      await clearDatabase();
      break;
      
    case '--clear-test':
      console.log('🧪 Clearing test data only...');
      const { clearTestData } = await import('./clear-database.js');
      await clearTestData();
      break;
      
    case '--clear-category':
      const category = args[1];
      if (!category) {
        console.log('❌ Please specify a category: --clear-category "Live shows"');
        process.exit(1);
      }
      await deleteEventsByCategory(category);
      break;
      
    case '--clear-old':
      const days = parseInt(args[1]) || 30;
      await deleteOldEvents(days);
      break;
      
    case '--clear-uploads':
      await clearUploads();
      break;
      
    case '--backup':
      await createBackup();
      break;
      
    default:
      console.log('Available commands:');
      console.log('  --list              # List database contents');
      console.log('  --clear-all         # Delete all data (destructive!)');
      console.log('  --clear-test        # Delete only test data (safer)');
      console.log('  --clear-category    # Delete events by category');
      console.log('  --clear-old [days]  # Delete events older than X days (default: 30)');
      console.log('  --clear-uploads     # Delete all uploaded files');
      console.log('  --backup            # Create backup before cleaning');
      console.log('\nExample usage:');
      console.log('  node db-manager.js --list');
      console.log('  node db-manager.js --backup');
      console.log('  node db-manager.js --clear-category "Live shows"');
      console.log('  node db-manager.js --clear-old 7');
      break;
  }
}

// Check if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('db-manager.js')) {
  main().catch(console.error);
}

export {
  listDatabaseContents,
  deleteEventsByCategory,
  deleteOldEvents,
  clearUploads,
  createBackup
};
