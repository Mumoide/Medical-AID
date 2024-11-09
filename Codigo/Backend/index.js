// index.js
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/adminRoutes');
const db = require('./db'); // Database connection
// console.log('Registering /admin routes');
const predictionRoutes = require('./routes/predictionRoutes');
const symptomsRoutes = require('./routes/symptomsRoutes');
const diseaseRoutes = require('./routes/diseaseRoutes')
const userRoutes = require('./routes/userRoutes');
const diagnosisRoutes = require('./routes/diagnosesRoutes'); // Adjust path if needed
const dashboardRoutes = require('./routes/dashboardRoutes')
const authenticateToken = require('./middleware/authenticateToken'); // Import the middleware
app.use('/admin', adminRoutes);


const corsOptions = {
  origin: 'http://localhost:3000', // Allow the front-end domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  credentials: true,
};
// Middleware configuration
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware
app.use(bodyParser.json());

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
app.use('/admin', adminRoutes); // Admin routes with /admin prefix
app.use('/api', predictionRoutes); // Use the prediction route
app.use('/api', symptomsRoutes); // Use the symptoms route
app.use('/api/disease', diseaseRoutes)
app.use('/api/users', userRoutes);
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/dashboard', dashboardRoutes)

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
