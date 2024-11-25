// index.js
const express = require('express');
const cors = require('cors');
const app = express();
const https = require('https'); // Import the https module
const fs = require('fs'); // Import the file system module
const bodyParser = require('body-parser');
const db = require('./dbtest'); // Database connection
// console.log('Registering /admin routes');
const predictionRoutes = require('./routes/predictionRoutes');
const symptomsRoutes = require('./routes/symptomsRoutes');
const diseaseRoutes = require('./routes/diseaseRoutes')
const userRoutes = require('./routes/userRoutes');
const diagnosisRoutes = require('./routes/diagnosesRoutes'); // Adjust path if needed
const dashboardRoutes = require('./routes/dashboardRoutes')
const alertRoutes = require("./routes/alertRoutes");
const newsletterRoutes = require('./routes/subscribeNewsLetterRoutes');
const authRoutes = require('./routes/authRoutes');


const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            'https://localhost:3000',
            'https://localhost:3001',
            'https://190.21.45.46',
            'http://localhost:3000',
            'http://190.21.45.46',
        ];

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`Blocked by CORS: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));


// ACTIVAR ESTA CONFIGURACION PARA LEVANTAR SERVIDOR HTTPS
// // Load SSL certificate and key
// const sslOptions = {
//   key: fs.readFileSync(process.env.SSL_KEY_PATH),
//   cert: fs.readFileSync(process.env.SSL_CERT_PATH),
// };

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
app.use("/api/alerts", alertRoutes);

// Export the app for testing
module.exports = app;

// // DESACTIVAR ESTA CONFIGURACION PARA LEVANTAR SERVIDOR HTTPS
// const port = 3002;
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });

// ACTIVAR ESTA CONFIGURACION PARA LEVANTAR SERVIDOR HTTPS
// // Create HTTPS server
// const port = process.env.PORT || 3001;
// https.createServer(sslOptions, app).listen(port, () => {
//   console.log(`HTTPS Server running on port ${port}`);
// });