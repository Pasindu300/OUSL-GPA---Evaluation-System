const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const apiRoutes = require('./routes/api');

// Configure CORS for Vercel deployment
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://https://ousl-gpa-evaluation-system-client.vercel.app/', 'https://https://ousl-gpa-evaluation-system-server.vercel.app/'] 
    : 'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.json());

// Use API routes
app.use('/api', apiRoutes);

// For Vercel serverless deployment
if (process.env.NODE_ENV === 'production') {
  // Just handle API requests, don't try to serve static files
  app.get('/', (req, res) => {
    res.json({ message: 'GPA Calculator API is running' });
  });
}

// Export for Vercel serverless function
module.exports = app;

// Only listen when running directly (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}