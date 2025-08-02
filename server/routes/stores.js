const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { authenticateToken, requireAdmin, requireStoreOwner, requireUser } = require('../middleware/auth');
const { validateStore } = require('../middleware/validation');

// Protected route - requires authentication to view stores (for role-based filtering)
router.get('/', authenticateToken, storeController.getAllStores);

// Get store by ID (public)
router.get('/:id', storeController.getStoreById);

// Protected routes
router.use(authenticateToken);

// Create store (admin only)
router.post('/', requireAdmin, validateStore, storeController.createStore);

// Update store (admin only)
router.put('/:id', requireAdmin, validateStore, storeController.updateStore);

// Delete store (admin only)
router.delete('/:id', requireAdmin, storeController.deleteStore);

// Get stores by owner (store owner can see their own stores, admin can see any)
router.get('/owner/:ownerId', (req, res, next) => {
  if (req.user.role === 'admin' || req.user.id.toString() === req.params.ownerId) {
    next();
  } else {
    res.status(403).json({ message: 'Insufficient permissions' });
  }
}, storeController.getStoresByOwner);

module.exports = router; 