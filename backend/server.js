const express = require('express');
const cors = require('cors');
const pool = require('./db/database');
const notesRouter = require('./routes/notes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Notes API routes
app.use('/api/notes', notesRouter);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'NoteNest API is running!',
  });
});

// Database health check
app.get('/api/health/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT current_database()');

    res.status(200).json({
      message: 'PostgreSQL connected successfully!',
      database: result.rows[0].current_database,
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);

    res.status(500).json({
      message: 'Database connection failed.',
    });
  }
});

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`NoteNest API running at http://localhost:${PORT}`);
});