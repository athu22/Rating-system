const pool = require('../database/connection');

const submitRating = async (req, res) => {
  try {
    const { store_id, rating, comment } = req.body;
    const user_id = req.user?.id;
    const user_role = req.user?.role;

    if (!user_id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if store exists
    const storeCheck = await pool.query('SELECT id, owner_id FROM stores WHERE id = $1', [store_id]);
    if (storeCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Prevent store owners from rating their own stores
    if (user_role === 'store_owner' && storeCheck.rows[0].owner_id === user_id) {
      return res.status(403).json({ message: 'Store owners cannot rate their own stores' });
    }

    // Check if user already rated this store
    const existingRating = await pool.query(
      'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2',
      [user_id, store_id]
    );

    if (existingRating.rows.length > 0) {
      return res.status(400).json({ message: 'You have already rated this store' });
    }

    // Create rating
    const result = await pool.query(
      'INSERT INTO ratings (user_id, store_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, store_id, rating, comment]
    );

    res.status(201).json({
      message: 'Rating submitted successfully',
      rating: result.rows[0]
    });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.id;

    // Check if rating exists and belongs to user
    const existingRating = await pool.query(
      'SELECT id FROM ratings WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (existingRating.rows.length === 0) {
      return res.status(404).json({ message: 'Rating not found or you do not have permission to edit it' });
    }

    // Update rating
    const result = await pool.query(
      'UPDATE ratings SET rating = $1, comment = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [rating, comment, id]
    );

    res.json({
      message: 'Rating updated successfully',
      rating: result.rows[0]
    });
  } catch (error) {
    console.error('Update rating error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Check if rating exists and belongs to user
    const existingRating = await pool.query(
      'SELECT id FROM ratings WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (existingRating.rows.length === 0) {
      return res.status(404).json({ message: 'Rating not found or you do not have permission to delete it' });
    }

    // Delete rating
    await pool.query('DELETE FROM ratings WHERE id = $1', [id]);

    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getRatingsByStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Check if store exists
    const storeCheck = await pool.query('SELECT id FROM stores WHERE id = $1', [storeId]);
    if (storeCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const result = await pool.query(`
      SELECT r.id, r.rating, r.comment, r.created_at, r.updated_at,
             u.name as user_name, u.email as user_email
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `, [storeId, parseInt(limit), offset]);

    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM ratings WHERE store_id = $1',
      [storeId]
    );
    const totalRatings = parseInt(countResult.rows[0].count);

    res.json({
      ratings: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalRatings / limit),
        totalRatings,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get ratings by store error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserRatings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { page = 1, limit = 10, search = '', sortBy = 'created_at', sortOrder = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    // Build WHERE clause for search
    let whereClause = 'WHERE r.user_id = $1';
    let searchParams = [user_id];
    let paramIndex = 2;

    if (search) {
      whereClause += ` AND (s.name ILIKE $${paramIndex} OR s.address ILIKE $${paramIndex})`;
      searchParams.push(`%${search}%`);
      paramIndex++;
    }

    // Validate sortBy to prevent SQL injection
    const allowedSortFields = ['created_at', 'updated_at', 'rating', 'store_name', 'store_address'];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const validSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Build ORDER BY clause
    let orderByClause = '';
    if (validSortBy === 'store_name') {
      orderByClause = `ORDER BY s.name ${validSortOrder}`;
    } else if (validSortBy === 'store_address') {
      orderByClause = `ORDER BY s.address ${validSortOrder}`;
    } else {
      orderByClause = `ORDER BY r.${validSortBy} ${validSortOrder}`;
    }

    const result = await pool.query(`
      SELECT r.id, r.rating, r.comment, r.created_at, r.updated_at,
             s.id as store_id, s.name as store_name, s.address as store_address
      FROM ratings r
      JOIN stores s ON r.store_id = s.id
      ${whereClause}
      ${orderByClause}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, [...searchParams, parseInt(limit), offset]);

    // Get total count with search
    let countWhereClause = 'WHERE r.user_id = $1';
    let countParams = [user_id];

    if (search) {
      countWhereClause += ` AND (s.name ILIKE $2 OR s.address ILIKE $2)`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(`
      SELECT COUNT(*) FROM ratings r
      JOIN stores s ON r.store_id = s.id
      ${countWhereClause}
    `, countParams);
    
    const totalRatings = parseInt(countResult.rows[0].count);

    res.json({
      ratings: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalRatings / limit),
        totalRatings,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get user ratings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getStoreOwnerRatings = async (req, res) => {
  try {
    const owner_id = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(`
      SELECT r.id, r.rating, r.comment, r.created_at, r.updated_at,
             s.id as store_id, s.name as store_name, s.address as store_address,
             u.name as user_name, u.email as user_email
      FROM ratings r
      JOIN stores s ON r.store_id = s.id
      JOIN users u ON r.user_id = u.id
      WHERE s.owner_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `, [owner_id, parseInt(limit), offset]);

    // Get total count
    const countResult = await pool.query(`
      SELECT COUNT(*) FROM ratings r
      JOIN stores s ON r.store_id = s.id
      WHERE s.owner_id = $1
    `, [owner_id]);
    const totalRatings = parseInt(countResult.rows[0].count);

    res.json({
      ratings: result.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalRatings / limit),
        totalRatings,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get store owner ratings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getRatingById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const result = await pool.query(`
      SELECT r.id, r.rating, r.comment, r.created_at, r.updated_at,
             s.id as store_id, s.name as store_name, s.address as store_address,
             u.name as user_name, u.email as user_email
      FROM ratings r
      JOIN stores s ON r.store_id = s.id
      JOIN users u ON r.user_id = u.id
      WHERE r.id = $1 AND (r.user_id = $2 OR s.owner_id = $2 OR $3 = 'admin')
    `, [id, user_id, req.user.role]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Rating not found or you do not have permission to view it' });
    }

    res.json({ rating: result.rows[0] });
  } catch (error) {
    console.error('Get rating by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  submitRating,
  updateRating,
  deleteRating,
  getRatingsByStore,
  getUserRatings,
  getStoreOwnerRatings,
  getRatingById
}; 