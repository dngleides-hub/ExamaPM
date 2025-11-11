const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const dashboardController = require('../controllers/dashboardController');

router.get('/', pageController.getHomePage);
router.get('/dashboard', dashboardController.getDashboard);
router.get('/admin', dashboardController.getAdminPanel);
router.get('/client', dashboardController.getClientPanel);

module.exports = router;