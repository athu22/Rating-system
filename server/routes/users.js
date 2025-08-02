const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateUserUpdate } = require('../middleware/validation');

// All routes require admin authentication
router.use(authenticateToken, requireAdmin);

// Get all users with pagination, search, and sorting
router.get('/', userController.getAllUsers);

// Create new user
router.post('/', userController.createUser);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user
router.put('/:id', validateUserUpdate, userController.updateUser);

// Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router; 