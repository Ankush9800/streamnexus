const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stream-nexus', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

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
  subtitle: String
});

const Movie = mongoose.model('Movie', movieSchema);

// Sample movie data
const movies = [
  {
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    releaseYear: 1994,
    genre: ['Drama'],
    rating: 9.3,
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg',
    downloadUrl: 'https://example.com/movies/shawshank-redemption.mp4',
    downloadOptions: [
      { quality: '720p', url: 'https://example.com/movies/shawshank-redemption-720p.mp4', size: '1.2 GB' },
      { quality: '1080p', url: 'https://example.com/movies/shawshank-redemption.mp4', size: '2.8 GB' },
      { quality: '4K', url: 'https://example.com/movies/shawshank-redemption-4k.mp4', size: '8.5 GB' }
    ],
    screenshots: [
      'https://m.media-amazon.com/images/M/MV5BNTYxOTYyMzE3NV5BMl5BanBnXkFtZTcwOTMxNDY3Mw@@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BNzAwOTk3MDg5MV5BMl5BanBnXkFtZTcwNjQxNDY3Mw@@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg'
    ],
    fullName: 'The Shawshank Redemption (1994)',
    language: 'English',
    size: '2.8 GB',
    source: 'Blu-ray',
    cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
    format: 'MKV',
    subtitle: 'English, Spanish, French'
  },
  {
    title: 'The Godfather',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    releaseYear: 1972,
    genre: ['Crime', 'Drama'],
    rating: 9.2,
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    downloadUrl: 'https://example.com/movies/godfather.mp4',
    downloadOptions: [
      { quality: '720p', url: 'https://example.com/movies/godfather-720p.mp4', size: '1.4 GB' },
      { quality: '1080p', url: 'https://example.com/movies/godfather.mp4', size: '3.2 GB' }
    ],
    screenshots: [
      'https://m.media-amazon.com/images/M/MV5BZTFiODA5NmMtY2Q0OC00MTliLWIxZTUtYTFiZWEwYmMzYjQ1XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BMWMwMGQzZTItY2JlNC00OWZiLWIyMDctNDk2ZDQ2YjRjMWQ0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg'
    ],
    fullName: 'The Godfather (1972)',
    language: 'English, Italian',
    size: '3.2 GB',
    source: 'Blu-ray Remux',
    cast: ['Marlon Brando', 'Al Pacino', 'James Caan'],
    format: 'MKV',
    subtitle: 'English, Italian'
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    releaseYear: 2008,
    genre: ['Action', 'Crime', 'Drama', 'Thriller'],
    rating: 9.0,
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
    downloadUrl: 'https://example.com/movies/dark-knight.mp4',
    downloadOptions: [
      { quality: '720p', url: 'https://example.com/movies/dark-knight-720p.mp4', size: '1.5 GB' },
      { quality: '1080p', url: 'https://example.com/movies/dark-knight.mp4', size: '3.5 GB' },
      { quality: '4K', url: 'https://example.com/movies/dark-knight-4k.mp4', size: '9.2 GB' }
    ],
    screenshots: [
      'https://m.media-amazon.com/images/M/MV5BMTM5MjkwMTI0MV5BMl5BanBnXkFtZTcwODQyMTYxMw@@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BOTAxNzI0NDE1NF5BMl5BanBnXkFtZTcwNjczMTk2Mw@@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BMTkyMjQ4OTY3OF5BMl5BanBnXkFtZTcwODcyMTk2Mw@@._V1_.jpg'
    ]
  },
  {
    title: 'Pulp Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    releaseYear: 1994,
    genre: ['Crime', 'Drama'],
    rating: 8.9,
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    downloadUrl: 'https://example.com/movies/pulp-fiction.mp4',
    downloadOptions: [
      { quality: '720p', url: 'https://example.com/movies/pulp-fiction-720p.mp4', size: '1.3 GB' },
      { quality: '1080p', url: 'https://example.com/movies/pulp-fiction.mp4', size: '3.0 GB' },
      { quality: '4K', url: 'https://example.com/movies/pulp-fiction-4k.mp4', size: '7.8 GB' }
    ],
    screenshots: [
      'https://m.media-amazon.com/images/M/MV5BMTY1NjI5ODY5NV5BMl5BanBnXkFtZTcwNTgwOTk2Mw@@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BMTA2NDM2MDQ5NDNeQTJeQWpwZ15BbWU3MDk4OTk2Mw@@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BMTU2Njk0NDY0NV5BMl5BanBnXkFtZTcwMjc5OTk2Mw@@._V1_.jpg'
    ]
  },
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    releaseYear: 2010,
    genre: ['Action', 'Adventure', 'Science Fiction', 'Thriller'],
    rating: 8.8,
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
    downloadUrl: 'https://example.com/movies/inception.mp4',
    screenshots: [
      'https://m.media-amazon.com/images/M/MV5BMTM0MjUzNjkwMl5BMl5BanBnXkFtZTcwNjY0OTk1Mw@@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BMjE0MjAwOTMxMF5BMl5BanBnXkFtZTcwODk1OTk1Mw@@._V1_.jpg',
      'https://m.media-amazon.com/images/M/MV5BMTI3MzMwODA1MF5BMl5BanBnXkFtZTcwNDYzOTk1Mw@@._V1_.jpg'
    ]
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing movies
    await Movie.deleteMany({});
    console.log('Deleted existing movies');
    
    // Insert new movies
    const result = await Movie.insertMany(movies);
    console.log(`Successfully added ${result.length} movies to the database`);
    
    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
};

// Run the seed function
seedDatabase(); 