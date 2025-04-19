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
app.use(cors());
app.use(bodyParser.json());

// Use API routes
app.use('/api', apiRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});