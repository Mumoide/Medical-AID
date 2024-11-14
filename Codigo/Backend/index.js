// index.js
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db'); // Database connection
// console.log('Registering /admin routes');
const predictionRoutes = require('./routes/predictionRoutes');
const symptomsRoutes = require('./routes/symptomsRoutes');
const diseaseRoutes = require('./routes/diseaseRoutes')
const userRoutes = require('./routes/userRoutes');
const diagnosisRoutes = require('./routes/diagnosesRoutes'); // Adjust path if needed
const dashboardRoutes = require('./routes/dashboardRoutes')
const newsletterRoutes = require('./routes/subscribeNewsLetterRoutes');
const authRoutes = require('./routes/authRoutes');

const corsOptions = {
  origin: (origin, callback) => {
    // List allowed origins
    const allowedOrigins = ['http://localhost:3000'];
    
    // Check if the origin matches localhost or falls within the IP range
    if (
      allowedOrigins.includes(origin) ||
      /^http:\/\/192\.168\.1\.(\d|[1-9]\d|1\d\d|2[0-5][0-5]):3000$/.test(origin) // Regex for IP range 192.168.1.1 to 192.168.1.255
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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
app.use('/api', predictionRoutes); // Use the prediction route
app.use('/api', symptomsRoutes); // Use the symptoms route
app.use('/api/disease', diseaseRoutes)
app.use('/api/users', userRoutes);
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/newsletter', newsletterRoutes);


const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
