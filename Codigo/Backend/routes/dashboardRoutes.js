const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/DashboardController');

router.get('/all', dashboardController.getAllDiagnoses);

module.exports = router;
