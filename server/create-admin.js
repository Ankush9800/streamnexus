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
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  createAdmin();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const createAdmin = () => {
  rl.question('Enter admin username (default: admin): ', (username) => {
    const adminUsername = username || 'admin';
    
    rl.question('Enter admin password (default: admin123): ', async (password) => {
      const adminPassword = password || 'admin123';
      
      try {
        // Check if user exists
        const existingUser = await User.findOne({ username: adminUsername });
        
        if (existingUser) {
          console.log(`User '${adminUsername}' already exists.`);
          console.log('Do you want to update the password?');
          
          rl.question('Update password? (y/n): ', async (answer) => {
            if (answer.toLowerCase() === 'y') {
              // Update password
              const salt = await bcrypt.genSalt(10);
              const hashedPassword = await bcrypt.hash(adminPassword, salt);
              
              await User.findByIdAndUpdate(existingUser._id, {
                password: hashedPassword
              });
              
              console.log(`Password updated for user '${adminUsername}'`);
            } else {
              console.log('Password not updated.');
            }
            
            mongoose.connection.close();
            rl.close();
          });
        } else {
          // Create new admin user
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(adminPassword, salt);
          
          const newAdmin = new User({
            username: adminUsername,
            password: hashedPassword,
            isAdmin: true
          });
          
          await newAdmin.save();
          console.log(`Admin user created successfully!`);
          console.log(`Username: ${adminUsername}`);
          console.log(`Password: ${adminPassword}`);
          
          mongoose.connection.close();
          rl.close();
        }
      } catch (error) {
        console.error('Error creating admin user:', error);
        mongoose.connection.close();
        rl.close();
      }
    });
  });
};

// Handle closing
rl.on('close', () => {
  console.log('Exiting...');
  process.exit(0);
}); 