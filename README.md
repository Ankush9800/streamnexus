# Stream Nexus - Movie Download Website

A modern web application for browsing and downloading movies. Built with React, Node.js, and MongoDB.

## Project Structure

- `client/` - React frontend
- `server/` - Express backend and API
- `.env` - Environment variables

## Features

- Browse latest movies
- Search movies by title
- View detailed movie information
- Download movies (supports Google Drive links)
- Admin panel with authentication
- Responsive design
- Dark mode UI

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd stream-nexus
```

2. Install all dependencies (backend, server, and client):
```bash
npm run install:all
```

3. Make sure your `.env` file in the root directory has the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stream-nexus
JWT_SECRET=your-secret-key-here
```

4. Start MongoDB on your local machine.

## Running the Application

1. Start both backend and frontend in development mode:
```bash
npm run dev
```

Or run them separately:

2. Start just the backend server:
```bash
npm run server
```

3. Start just the frontend client:
```bash
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Admin Access

By default, a user with admin privileges is created:
- Username: `admin`
- Password: `admin123`

You can create or update admin users using the provided script:
```bash
npm run create-admin
```

## Seeding the Database

To populate the database with sample movies:
```bash
npm run seed
```

## API Endpoints

### Public Endpoints
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie by ID
- `GET /api/movies/search?q=query` - Search movies
- `GET /api/convert-drive-link` - Convert Google Drive link to direct download link

### Protected Endpoints (require authentication)
- `POST /api/movies` - Add a new movie
- `PUT /api/movies/:id` - Update a movie
- `DELETE /api/movies/:id` - Delete a movie

### Authentication Endpoints
- `POST /api/auth/login` - Login as admin
- `POST /api/auth/register` - Register a new admin (rarely used)
- `GET /api/auth/verify` - Verify authentication token

## Technologies Used

- Frontend:
  - React
  - TypeScript
  - Material-UI
  - React Router
  - Axios

- Backend:
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - JWT Authentication

## Movie Management

### Adding Movies
1. Navigate to the Admin page by clicking the "Admin" button in the navbar
2. Click "Add Movie" and fill in the movie details
3. For movie files hosted on Google Drive:
   - Click the "Google Drive Helper" button
   - Paste your Google Drive sharing link
   - Click "Convert Link" 
   - Click "Use This Link" to add the direct download link to the form
4. Click "Add Movie" to save

### Google Drive Sharing Requirements
When sharing movie files from Google Drive:
1. Upload your movie file to Google Drive
2. Right-click the file and select "Share"
3. Set the permissions to "Anyone with the link can view"
4. Copy the sharing link (Format: https://drive.google.com/file/d/FILEID/view?usp=sharing)
5. Use this link in the Google Drive Helper

### Editing Movies
1. Navigate to the Admin page
2. Click the Edit (pencil) icon next to a movie
3. Make your changes
4. Click "Save Changes"

### Deleting Movies
1. Navigate to the Admin page
2. Click the Delete (trash) icon next to a movie
3. Confirm the deletion

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 