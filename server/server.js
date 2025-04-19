const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const apiRoutes = require('./routes/api');

// Middleware
app.use(cors({
  origin: [
    'https://ousl-gpa-evaluation-system-client.vercel.app', 
    'http://localhost:3000',
    // Add your Vercel client URL if different
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(bodyParser.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'GPA Calculator API is running. Use /api/courses/{specialization} to get course data.' });
});

// Use API routes
app.use('/api', apiRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Start the server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel serverless function
module.exports = app;