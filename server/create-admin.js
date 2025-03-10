const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const readline = require('readline');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/streamnexus', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  createAdmin();
})
.catch(err => {
  process.exit(1);
});

const createAdmin = async () => {
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  try {
    // Check if admin user already exists
    const existingUser = await User.findOne({ username: adminUsername });
    
    if (existingUser) {
      const answer = await promptYesNo();
      
      if (answer) {
        existingUser.password = adminPassword;
        await existingUser.save();
      }
    } else {
      // Create new admin user
      const adminUser = new User({
        username: adminUsername,
        password: adminPassword,
        isAdmin: true
      });
      
      await adminUser.save();
    }
    
    mongoose.disconnect();
  } catch (error) {
    mongoose.disconnect();
    process.exit(1);
  }
};

// Exit handler
process.on('SIGINT', () => {
  mongoose.disconnect();
  process.exit(0);
});

// Handle closing
rl.on('close', () => {
  process.exit(0);
}); 