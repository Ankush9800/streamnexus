require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Use production MongoDB URI
const MONGODB_URI = "mongodb+srv://ankushbhanja1:Sampan9800@cluster0.zwusv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
.then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Find admin user
    const admin = await User.findOne({ username: 'admin' });
    
    if (!admin) {
      console.error('Admin user not found');
      process.exit(1);
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Ankush9413@', salt);
    
    // Update password
    await User.updateOne(
      { username: 'admin' },
      { $set: { password: hashedPassword } }
    );
    
    console.log('Admin password updated successfully!');
    console.log('New credentials:');
    console.log('Username: admin');
    console.log('Password: Ankush9413@');
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating password:', error);
    process.exit(1);
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}); 