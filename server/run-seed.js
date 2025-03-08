// Sample script to add movies to MongoDB
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

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
    const movie = new Movie({
      title: 'Inception',
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      releaseYear: 2010,
      genre: ['Action', 'Adventure', 'Science Fiction'],
      rating: 8.8,
      posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
      downloadUrl: 'https://example.com/inception.mp4',
      downloadOptions: [
        { quality: '720p', url: 'https://example.com/inception-720p.mp4', size: '1.5 GB' },
        { quality: '1080p', url: 'https://example.com/inception.mp4', size: '3.2 GB' },
        { quality: '4K', url: 'https://example.com/inception-4k.mp4', size: '8.7 GB' }
      ],
      screenshots: [
        'https://m.media-amazon.com/images/M/MV5BMTM0MjUzNjkwMl5BMl5BanBnXkFtZTcwNjY0OTk1Mw@@._V1_.jpg',
        'https://m.media-amazon.com/images/M/MV5BMjE0MjAwOTMxMF5BMl5BanBnXkFtZTcwODk1OTk1Mw@@._V1_.jpg',
        'https://m.media-amazon.com/images/M/MV5BMTI3MzMwODA1MF5BMl5BanBnXkFtZTcwNDYzOTk1Mw@@._V1_.jpg'
      ]
    });
    
    await movie.save();
    console.log('Sample movie added successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error adding sample movie:', error);
    mongoose.connection.close();
  }
};

addSampleMovie(); 