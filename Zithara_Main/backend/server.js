// backend/server.js
const express = require('express');
const cors = require('cors');
const pool = require('./db');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Get all records with optional sorting by date or time
app.get('/api/records', async (req, res) => {
  const { sortBy } = req.query;
  let query = 'SELECT * FROM records';

  // Add sorting if sortBy parameter is provided
  if (sortBy === 'date') {
    query += ' ORDER BY created_at::date';
  } else if (sortBy === 'time') {
    query += ' ORDER BY created_at::time';
  }

  try {
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
