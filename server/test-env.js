require('dotenv').config();

console.log('🔍 Testing environment variables...');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('DB_NAME:', process.env.DB_NAME || '❌ Missing');
console.log('DB_USER:', process.env.DB_USER || '❌ Missing');
console.log('PORT:', process.env.PORT || '❌ Missing');

if (!process.env.JWT_SECRET) {
  console.log('❌ JWT_SECRET is missing! Please create .env file with JWT_SECRET');
} else {
  console.log('✅ JWT_SECRET is set correctly');
} 