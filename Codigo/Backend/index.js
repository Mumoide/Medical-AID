// index.js
const express = require('express');
const cors = require('cors');
const app = express();
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const db = require('./db'); // Database connection
// console.log('Registering /admin routes');
const predictionRoutes = require('./routes/predictionRoutes');
const symptomsRoutes = require('./routes/symptomsRoutes');
app.use('/admin', adminRoutes);

// Middleware configuration
app.use(cors({ origin: 'http://localhost:3000', methods: ['GET', 'POST'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route to check DB connection
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ message: 'Database connected successfully', time: result.rows[0].now });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection failed', error });
  }
});

app.get('/test-root', (req, res) => {
  res.send('Root test is working');
});

// Routes
app.use('/auth', authRoutes); // Auth-related routes
app.use('/admin', adminRoutes); // Admin routes with /admin prefix
app.use('/api', predictionRoutes); // Use the prediction route
app.use('/api', symptomsRoutes); // Use the symptoms route

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
