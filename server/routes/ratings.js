const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authenticateToken, requireUser } = require('../middleware/auth');
const { validateRating } = require('../middleware/validation');

// Debug middleware to log all requests
router.use((req, res, next) => {
  console.log(`[RATINGS] ${req.method} ${req.path} - User: ${req.user?.id || 'none'}`);
  next();
});

// All routes require authentication
router.use(authenticateToken, requireUser);

// Submit rating
router.post('/', validateRating, (req, res, next) => {
  console.log('[RATINGS] POST / - Submitting rating:', req.body);
  next();
}, ratingController.submitRating);

// Update rating
router.put('/:id', validateRating, (req, res, next) => {
  console.log('[RATINGS] PUT /:id - Updating rating:', req.params.id, req.body);
  next();
}, ratingController.updateRating);

// Delete rating
router.delete('/:id', (req, res, next) => {
  console.log('[RATINGS] DELETE /:id - Deleting rating:', req.params.id);
  next();
}, ratingController.deleteRating);

// Get ratings by store (public data, but requires authentication for consistency)
router.get('/store/:storeId', (req, res, next) => {
  console.log('[RATINGS] GET /store/:storeId - Getting ratings for store:', req.params.storeId);
  next();
}, ratingController.getRatingsByStore);

// Get user's own ratings
router.get('/user/me', (req, res, next) => {
  console.log('[RATINGS] GET /user/me - Getting user ratings for user:', req.user.id);
  next();
}, ratingController.getUserRatings);

// Get ratings for stores owned by the authenticated user (store owner only)
router.get('/owner/me', (req, res, next) => {
  console.log('[RATINGS] GET /owner/me - Getting store owner ratings for user:', req.user.id);
  if (req.user.role === 'store_owner' || req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Only store owners can view store ratings' });
  }
}, ratingController.getStoreOwnerRatings);

// Get specific rating by ID
router.get('/:id', (req, res, next) => {
  console.log('[RATINGS] GET /:id - Getting rating by ID:', req.params.id);
  next();
}, ratingController.getRatingById);

module.exports = router; 