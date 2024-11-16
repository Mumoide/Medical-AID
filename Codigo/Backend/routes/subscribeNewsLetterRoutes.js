// routes/newsletterRoutes.js
const express = require('express');
const router = express.Router();
const { subscribeNewsletter } = require('../controllers/subscribeNewsLetterController')

// POST route for subscribing to the newsletter
router.post('/subscribe', subscribeNewsletter);

module.exports = router;
