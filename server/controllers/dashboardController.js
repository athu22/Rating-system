const pool = require('../database/connection');

const getAdminDashboard = async (req, res) => {
  try {
    // Get total users count
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    const totalUsers = parseInt(usersCount.rows[0].count);

    // Get total stores count
    const storesCount = await pool.query('SELECT COUNT(*) FROM stores');
    const totalStores = parseInt(storesCount.rows[0].count);

    // Get total ratings count
    const ratingsCount = await pool.query('SELECT COUNT(*) FROM ratings');
    const totalRatings = parseInt(ratingsCount.rows[0].count);

    // Get average rating across all stores
    const avgRating = await pool.query('SELECT COALESCE(AVG(rating), 0) as average_rating FROM ratings');
    const averageRating = parseFloat(avgRating.rows[0].average_rating).toFixed(1);

    // Get users by role
    const usersByRole = await pool.query(`
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role
    `);

    // Get top rated stores
    const topStores = await pool.query(`
      SELECT s.id, s.name, s.address,
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id, s.name, s.address
      HAVING COUNT(r.id) > 0
      ORDER BY average_rating DESC, total_ratings DESC
      LIMIT 5
    `);

    // Get recent ratings
    const recentRatings = await pool.query(`
      SELECT r.id, r.rating, r.comment, r.created_at,
             s.name as store_name,
             u.name as user_name
      FROM ratings r
      JOIN stores s ON r.store_id = s.id
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
      LIMIT 10
    `);

    // Get recent users
    const recentUsers = await pool.query(`
      SELECT id, name, email, role, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 10
    `);

    // Get recent stores
    const recentStores = await pool.query(`
      SELECT s.id, s.name, s.address, s.created_at,
             u.name as owner_name
      FROM stores s
      JOIN users u ON s.owner_id = u.id
      ORDER BY s.created_at DESC
      LIMIT 10
    `);

    res.json({
      statistics: {
        totalUsers,
        totalStores,
        totalRatings,
        averageRating
      },
      usersByRole: usersByRole.rows,
      topStores: topStores.rows.map(store => ({
        ...store,
        average_rating: parseFloat(store.average_rating).toFixed(1),
        total_ratings: parseInt(store.total_ratings)
      })),
      recentRatings: recentRatings.rows,
      recentUsers: recentUsers.rows,
      recentStores: recentStores.rows
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getStoreOwnerDashboard = async (req, res) => {
  try {
    const owner_id = req.user.id;

    // Get total stores owned by this user
    const storesCount = await pool.query(
      'SELECT COUNT(*) FROM stores WHERE owner_id = $1',
      [owner_id]
    );
    const totalStores = parseInt(storesCount.rows[0].count);

    // Get total ratings for all stores owned by this user
    const ratingsCount = await pool.query(`
      SELECT COUNT(*) FROM ratings r
      JOIN stores s ON r.store_id = s.id
      WHERE s.owner_id = $1
    `, [owner_id]);
    const totalRatings = parseInt(ratingsCount.rows[0].count);

    // Get average rating across all stores owned by this user
    const avgRating = await pool.query(`
      SELECT COALESCE(AVG(r.rating), 0) as average_rating 
      FROM ratings r
      JOIN stores s ON r.store_id = s.id
      WHERE s.owner_id = $1
    `, [owner_id]);
    const averageRating = parseFloat(avgRating.rows[0].average_rating).toFixed(1);

    // Get stores with their ratings
    const storesWithRatings = await pool.query(`
      SELECT s.id, s.name, s.address,
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.owner_id = $1
      GROUP BY s.id, s.name, s.address
      ORDER BY s.created_at DESC
    `, [owner_id]);

    // Get recent ratings for stores owned by this user
    const recentRatings = await pool.query(`
      SELECT r.id, r.rating, r.comment, r.created_at,
             s.name as store_name,
             u.name as user_name, u.email as user_email
      FROM ratings r
      JOIN stores s ON r.store_id = s.id
      JOIN users u ON r.user_id = u.id
      WHERE s.owner_id = $1
      ORDER BY r.created_at DESC
      LIMIT 10
    `, [owner_id]);

    res.json({
      statistics: {
        totalStores,
        totalRatings,
        averageRating
      },
      storesWithRatings: storesWithRatings.rows.map(store => ({
        ...store,
        average_rating: parseFloat(store.average_rating).toFixed(1),
        total_ratings: parseInt(store.total_ratings)
      })),
      recentRatings: recentRatings.rows
    });
  } catch (error) {
    console.error('Get store owner dashboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getUserDashboard = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Get total ratings by this user
    const ratingsCount = await pool.query(
      'SELECT COUNT(*) FROM ratings WHERE user_id = $1',
      [user_id]
    );
    const totalRatings = parseInt(ratingsCount.rows[0].count);

    // Get average rating given by this user
    const avgRating = await pool.query(
      'SELECT COALESCE(AVG(rating), 0) as average_rating FROM ratings WHERE user_id = $1',
      [user_id]
    );
    const averageRating = parseFloat(avgRating.rows[0].average_rating).toFixed(1);

    // Get recent ratings by this user
    const recentRatings = await pool.query(`
      SELECT r.id, r.rating, r.comment, r.created_at,
             s.name as store_name, s.address as store_address
      FROM ratings r
      JOIN stores s ON r.store_id = s.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
      LIMIT 10
    `, [user_id]);

    // Get top rated stores (for user to discover)
    const topStores = await pool.query(`
      SELECT s.id, s.name, s.address,
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as total_ratings
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id, s.name, s.address
      HAVING COUNT(r.id) > 0
      ORDER BY average_rating DESC, total_ratings DESC
      LIMIT 5
    `);

    res.json({
      statistics: {
        totalRatings,
        averageRating
      },
      recentRatings: recentRatings.rows,
      topStores: topStores.rows.map(store => ({
        ...store,
        average_rating: parseFloat(store.average_rating).toFixed(1),
        total_ratings: parseInt(store.total_ratings)
      }))
    });
  } catch (error) {
    console.error('Get user dashboard error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAdminDashboard,
  getStoreOwnerDashboard,
  getUserDashboard
}; 