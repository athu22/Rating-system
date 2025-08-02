const pool = require('../database/connection');

const getAllStores = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'created_at', sortOrder = 'DESC' } = req.query;
    const offset = (page - 1) * limit;
    const user = req.user || { role: 'user' }; // Fallback for unauthenticated users

    let query = `
      SELECT s.id, s.name, s.address, s.created_at, s.updated_at,
             u.name as owner_name, u.email as owner_email,
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN users u ON s.owner_id = u.id
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const queryParams = [];

    // Filter stores based on user role
    if (user.role === 'store_owner') {
      // Store owners can only see their own stores
      query += ` AND s.owner_id = $${queryParams.length + 1}`;
      queryParams.push(user.id);
    }
    // Admins and normal users can see all stores

    // Add search filter
    if (search) {
      query += ` AND (s.name ILIKE $${queryParams.length + 1} OR s.address ILIKE $${queryParams.length + 1})`;
      queryParams.push(`%${search}%`);
    }

    query += ` GROUP BY s.id, s.name, s.address, s.created_at, s.updated_at, u.name, u.email`;

    // Add sorting
    const allowedSortFields = ['name', 'address', 'created_at', 'updated_at', 'average_rating', 'total_ratings'];
    const allowedSortOrders = ['ASC', 'DESC'];
    
    if (allowedSortFields.includes(sortBy) && allowedSortOrders.includes(sortOrder.toUpperCase())) {
      if (sortBy === 'average_rating' || sortBy === 'total_ratings') {
        query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
      } else {
        query += ` ORDER BY s.${sortBy} ${sortOrder.toUpperCase()}`;
      }
    } else {
      query += ` ORDER BY s.created_at DESC`;
    }

    // Add pagination
    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(parseInt(limit), offset);

    const result = await pool.query(query, queryParams);

    // Get total count for pagination
    let countQuery = `SELECT COUNT(DISTINCT s.id) FROM stores s WHERE 1=1`;
    const countParams = [];

    // Apply same filtering for count query
    if (user.role === 'store_owner') {
      countQuery += ` AND s.owner_id = $${countParams.length + 1}`;
      countParams.push(user.id);
    }

    if (search) {
      countQuery += ` AND (s.name ILIKE $${countParams.length + 1} OR s.address ILIKE $${countParams.length + 1})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const totalStores = parseInt(countResult.rows[0].count);

    res.json({
      stores: result.rows.map(store => ({
        ...store,
        average_rating: parseFloat(store.average_rating).toFixed(1),
        total_ratings: parseInt(store.total_ratings)
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalStores / limit),
        totalStores,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all stores error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createStore = async (req, res) => {
  try {
    const { name, address, owner_id } = req.body;

    // Check if owner exists and is a store owner
    const ownerCheck = await pool.query(
      'SELECT id, role FROM users WHERE id = $1',
      [owner_id]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    if (ownerCheck.rows[0].role !== 'store_owner') {
      return res.status(400).json({ message: 'Owner must have store_owner role' });
    }

    // Create store
    const result = await pool.query(
      'INSERT INTO stores (name, address, owner_id) VALUES ($1, $2, $3) RETURNING id, name, address, owner_id, created_at',
      [name, address, owner_id]
    );

    res.status(201).json({
      message: 'Store created successfully',
      store: result.rows[0]
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, owner_id } = req.body;

    // Check if store exists
    const existingStore = await pool.query('SELECT id FROM stores WHERE id = $1', [id]);
    if (existingStore.rows.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }

    if (address) {
      updates.push(`address = $${paramCount}`);
      values.push(address);
      paramCount++;
    }

    if (owner_id) {
      // Check if new owner exists and is a store owner
      const ownerCheck = await pool.query(
        'SELECT id, role FROM users WHERE id = $1',
        [owner_id]
      );

      if (ownerCheck.rows.length === 0) {
        return res.status(404).json({ message: 'Owner not found' });
      }

      if (ownerCheck.rows[0].role !== 'store_owner') {
        return res.status(400).json({ message: 'Owner must have store_owner role' });
      }

      updates.push(`owner_id = $${paramCount}`);
      values.push(owner_id);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No updates provided' });
    }

    values.push(id);
    const query = `
      UPDATE stores 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $${paramCount} 
      RETURNING id, name, address, owner_id, created_at, updated_at
    `;

    const result = await pool.query(query, values);
    res.json({
      message: 'Store updated successfully',
      store: result.rows[0]
    });
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if store exists
    const existingStore = await pool.query('SELECT id FROM stores WHERE id = $1', [id]);
    if (existingStore.rows.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Delete store (cascade will handle related ratings)
    await pool.query('DELETE FROM stores WHERE id = $1', [id]);

    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT s.id, s.name, s.address, s.created_at, s.updated_at,
             u.name as owner_name, u.email as owner_email,
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN users u ON s.owner_id = u.id
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.id = $1
      GROUP BY s.id, s.name, s.address, s.created_at, s.updated_at, u.name, u.email
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const store = result.rows[0];
    res.json({
      store: {
        ...store,
        average_rating: parseFloat(store.average_rating).toFixed(1),
        total_ratings: parseInt(store.total_ratings)
      }
    });
  } catch (error) {
    console.error('Get store by ID error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getStoresByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(`
      SELECT s.id, s.name, s.address, s.created_at, s.updated_at,
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.owner_id = $1
      GROUP BY s.id, s.name, s.address, s.created_at, s.updated_at
      ORDER BY s.created_at DESC
      LIMIT $2 OFFSET $3
    `, [ownerId, parseInt(limit), offset]);

    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM stores WHERE owner_id = $1',
      [ownerId]
    );
    const totalStores = parseInt(countResult.rows[0].count);

    res.json({
      stores: result.rows.map(store => ({
        ...store,
        average_rating: parseFloat(store.average_rating).toFixed(1),
        total_ratings: parseInt(store.total_ratings)
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalStores / limit),
        totalStores,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get stores by owner error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllStores,
  createStore,
  updateStore,
  deleteStore,
  getStoreById,
  getStoresByOwner
}; 