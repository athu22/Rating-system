const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authenticateToken, requireUser } = require('../middleware/auth');
const { validateRating } = require('../middleware/validation');

// All routes require authentication
router.use(authenticateToken, requireUser);

// Submit rating
router.post('/', validateRating, ratingController.submitRating);

// Update rating
router.put('/:id', validateRating, ratingController.updateRating);

// Delete rating
router.delete('/:id', ratingController.deleteRating);

// Get ratings by store (public data, but requires authentication for consistency)
router.get('/store/:storeId', ratingController.getRatingsByStore);

// Get user's own ratings
router.get('/user/me', ratingController.getUserRatings);

// Get ratings for stores owned by the authenticated user (store owner only)
router.get('/owner/me', (req, res, next) => {
  if (req.user.role === 'store_owner' || req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Only store owners can view store ratings' });
  }
}, ratingController.getStoreOwnerRatings);

// Get specific rating by ID
router.get('/:id', ratingController.getRatingById);

module.exports = router; 