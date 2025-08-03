const axios = require('axios');

const testServer = async () => {
  const baseURL = 'http://localhost:5050';
  
  try {
    console.log('🧪 Testing server connectivity...\n');
    
    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test 2: API base
    console.log('\n2. Testing API base...');
    const apiResponse = await axios.get(`${baseURL}/api`);
    console.log('✅ API base accessible');
    
    // Test 3: Ratings endpoint (should return 401 without auth)
    console.log('\n3. Testing ratings endpoint without auth...');
    try {
      await axios.post(`${baseURL}/api/ratings`, {
        store_id: 1,
        rating: 5,
        comment: 'Test rating'
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Ratings endpoint accessible (401 expected without auth)');
      } else {
        console.log('❌ Unexpected error:', error.response?.status, error.response?.data);
      }
    }
    
    console.log('\n✅ Server is running and accessible!');
    
  } catch (error) {
    console.error('❌ Server test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Server is not running. Please start the server with:');
      console.log('cd server && npm start');
    } else if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Cannot resolve localhost. Check if server is running on port 5050');
    }
  }
};

testServer(); 