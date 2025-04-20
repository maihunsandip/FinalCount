# FinalCount - Life Expectancy Calculator

A full-stack MERN application that calculates and displays how many days a user has left to live based on their birthdate and estimated life expectancy.

## Features

- User authentication with JWT
- Personal dashboard with life expectancy countdown
- Profile management
- Customizable view (Days/Weeks/Months/Years)
- Motivational quotes
- Responsive design with TailwindCSS

## Tech Stack

- Frontend: React, TailwindCSS
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT

## Project Structure

```
finalcount/
├── client/           # React frontend
└── server/           # Node.js backend
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Create a `.env` file in the server directory with:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the development servers:
   ```bash
   # Start backend (from server directory)
   npm run dev

   # Start frontend (from client directory)
   npm start
   ```

## License

MIT
