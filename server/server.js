require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://streamnexus.netlify.app', 'http://localhost:3000']
    : ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Add mongoose strictQuery setting to remove deprecation warning
mongoose.set('strictQuery', false);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/streamnexus', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Movie Schema
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  genre: [String],
  rating: { type: Number, min: 0, max: 10 },
  posterUrl: String,
  downloadUrl: String,
  downloadOptions: [{
    quality: { type: String, enum: ['720p', '1080p', '4K', 'default'] },
    url: { type: String, required: true },
    size: String
  }],
  screenshots: [String],
  createdAt: { type: Date, default: Date.now },
  fullName: String,
  language: String,
  size: String,
  source: String,
  cast: [String],
  format: String,
  subtitle: String,
  contentType: { type: String, enum: ['movie', 'series'], default: 'movie' },
  episodes: [{
    number: { type: Number, min: 1 },
    title: { type: String },
    description: { type: String, default: '' },
    downloadLinks: [{
      quality: { type: String },
      url: { type: String },
      size: { type: String, default: '' }
    }],
    screenshot: { type: String, default: '' }
  }]
});

const Movie = mongoose.model('Movie', movieSchema);

// Authentication Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      username,
      password: hashedPassword,
    });
    
    await user.save();
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create and sign JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/verify', authMiddleware, (req, res) => {
  res.json({
    user: {
      _id: req.user._id,
      username: req.user.username,
      isAdmin: req.user.isAdmin
    }
  });
});

// Unprotected API Routes
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/movies/search', async (req, res) => {
  try {
    const { q } = req.query;
    const movies = await Movie.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { genre: { $regex: q, $options: 'i' } }
      ]
    });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Protected Movie Routes
app.post('/api/movies', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Not authorized to create movies' });
    }
    
    // Validate required fields
    if (!req.body.title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    if (!req.body.description) {
      return res.status(400).json({ error: 'Description is required' });
    }
    
    if (!req.body.releaseYear) {
      return res.status(400).json({ error: 'Release year is required' });
    }
    
    // Validate downloadOptions if present
    if (req.body.downloadOptions && Array.isArray(req.body.downloadOptions)) {
      for (const option of req.body.downloadOptions) {
        if (!option.url) {
          return res.status(400).json({ error: 'URL is required for all download options' });
        }
        if (!option.quality) {
          return res.status(400).json({ error: 'Quality is required for all download options' });
        }
      }
    }
    
    // Validate episodes if present
    if (req.body.contentType === 'series' && req.body.episodes && Array.isArray(req.body.episodes)) {
      for (const episode of req.body.episodes) {
        if (!episode.title) {
          return res.status(400).json({ error: 'Title is required for all episodes' });
        }
        if (!episode.number) {
          return res.status(400).json({ error: 'Episode number is required for all episodes' });
        }
        
        // Validate episode download links if present
        if (episode.downloadLinks && Array.isArray(episode.downloadLinks)) {
          for (const link of episode.downloadLinks) {
            if (!link.url) {
              return res.status(400).json({ error: 'URL is required for all episode download links' });
            }
            if (!link.quality) {
              return res.status(400).json({ error: 'Quality is required for all episode download links' });
            }
          }
        }
      }
    }
    
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    // Check for validation error (MongoDB validation)
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: 'Validation error', details: validationErrors });
    }
    
    // Check for duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Duplicate key error. Movie may already exist with this title or identifier.' });
    }
    
    console.error('Error saving movie:', error);
    res.status(500).json({ error: 'Failed to save movie', message: error.message });
  }
});

app.put('/api/movies/:id', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    res.json(updatedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/movies/:id', authMiddleware, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to convert Google Drive link to direct download link
app.get('/api/convert-drive-link', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url || !url.includes('drive.google.com')) {
      return res.status(400).json({ message: 'Invalid Google Drive URL' });
    }
    
    // Extract the file ID from various Google Drive URL formats
    let fileId = '';
    
    if (url.includes('/file/d/')) {
      // Format: https://drive.google.com/file/d/FILE_ID/view...
      fileId = url.split('/file/d/')[1].split('/')[0];
    } else if (url.includes('id=')) {
      // Format: https://drive.google.com/open?id=FILE_ID
      fileId = url.split('id=')[1].split('&')[0];
    } else {
      return res.status(400).json({ message: 'Could not extract file ID from URL' });
    }
    
    // Create direct download link
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    res.json({ 
      originalUrl: url,
      fileId,
      downloadUrl
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create admin user if none exists
const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ isAdmin: true });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const adminUser = new User({
        username: 'admin',
        password: hashedPassword,
        isAdmin: true
      });
      
      await adminUser.save();
    }
  } catch (error) {
  }
};

// Add new server startup code
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  createAdminUser();
});

// Add health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

// Authentication error handling
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Invalid token' });
  } else {
    next(err);
  }
}); 