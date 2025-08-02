const pool = require('./database/connection');

async function testEverything() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test database
    const dbResult = await pool.query('SELECT NOW()');
    console.log('✅ Database connected:', dbResult.rows[0].now);
    
    // Test users table
    const usersResult = await pool.query('SELECT COUNT(*) FROM users');
    console.log('✅ Users table exists, count:', usersResult.rows[0].count);
    
    // Test admin user
    const adminResult = await pool.query("SELECT * FROM users WHERE email = 'admin@store-rating.com'");
    if (adminResult.rows.length > 0) {
      console.log('✅ Admin user exists');
    } else {
      console.log('❌ Admin user not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

testEverything(); 