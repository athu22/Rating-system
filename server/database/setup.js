const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'myuser',
  host: 'localhost',
  database: 'store_rating',
  password: 'mypassword',
  port: 5432,
});

const setupDatabase = async () => {
  try {
    console.log('Setting up database...');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(60) NOT NULL CHECK (LENGTH(name) >= 20),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'store_owner', 'user')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create stores table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS stores (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        address VARCHAR(400) NOT NULL,
        owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create ratings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, store_id)
      )
    `);

    // Create indexes for better performance
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_stores_owner ON stores(owner_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_ratings_user ON ratings(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_ratings_store ON ratings(store_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_stores_name ON stores(name)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_stores_address ON stores(address)');

    // Insert default users if not exists
    const bcrypt = require('bcryptjs');
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const storeOwnerPassword = await bcrypt.hash('Store123!', 10);
    const userPassword = await bcrypt.hash('User123!', 10);
    
    // Insert admin user
    await pool.query(`
      INSERT INTO users (name, email, password, role) 
      VALUES ($1, $2, $3, $4) 
      ON CONFLICT (email) DO NOTHING
    `, ['System Administrator', 'admin@store-rating.com', adminPassword, 'admin']);

    // Insert store owner user
    await pool.query(`
      INSERT INTO users (name, email, password, role) 
      VALUES ($1, $2, $3, $4) 
      ON CONFLICT (email) DO NOTHING
    `, ['Store Owner Demo', 'storeowner@store-rating.com', storeOwnerPassword, 'store_owner']);

    // Insert normal user
    await pool.query(`
      INSERT INTO users (name, email, password, role) 
      VALUES ($1, $2, $3, $4) 
      ON CONFLICT (email) DO NOTHING
    `, ['Demo User', 'user@store-rating.com', userPassword, 'user']);

    console.log('Database setup completed successfully!');
    console.log('Default user credentials:');
    console.log('Admin - Email: admin@store-rating.com, Password: Admin123!');
    console.log('Store Owner - Email: storeowner@store-rating.com, Password: Store123!');
    console.log('User - Email: user@store-rating.com, Password: User123!');

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await pool.end();
  }
};

setupDatabase(); 