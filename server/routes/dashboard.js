const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Get dashboard based on user role
router.get('/', (req, res, next) => {
  switch (req.user.role) {
    case 'admin':
      return dashboardController.getAdminDashboard(req, res);
    case 'store_owner':
      return dashboardController.getStoreOwnerDashboard(req, res);
    case 'user':
      return dashboardController.getUserDashboard(req, res);
    default:
      return res.status(400).json({ message: 'Invalid user role' });
  }
});

module.exports = router; 