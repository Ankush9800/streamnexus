// Sample script to add movies to MongoDB
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/streamnexus', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Movie Schema (matching our server.js schema)
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
  screenshots: [String], // Array of screenshot URLs
  createdAt: { type: Date, default: Date.now }
});

const Movie = mongoose.model('Movie', movieSchema);

// Add one sample movie
const addSampleMovie = async () => {
  try {
    const sampleMovie = {
      title: 'Sample Movie',
      description: 'This is a sample movie added as a test.',
      releaseYear: 2023,
      genre: ['Action', 'Adventure'],
      rating: 4.5,
      posterUrl: 'https://example.com/sample-poster.jpg',
      downloadUrl: 'https://example.com/sample-download.mp4',
      downloadOptions: [
        {
          quality: '720p',
          url: 'https://example.com/sample-720p.mp4',
          size: '700MB'
        },
        {
          quality: '1080p',
          url: 'https://example.com/sample-1080p.mp4',
          size: '1.5GB'
        }
      ],
      screenshots: [
        'https://example.com/screenshot1.jpg',
        'https://example.com/screenshot2.jpg'
      ],
      language: 'English',
      source: 'Example Source'
    };
    
    const movie = new Movie(sampleMovie);
    await movie.save();
    
    mongoose.disconnect();
  } catch (error) {
    mongoose.disconnect();
  }
};

addSampleMovie(); 