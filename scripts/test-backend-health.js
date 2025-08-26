const fetch = require('node-fetch');

const testBackendHealth = async () => {
  console.log('🏥 Testing Backend Health...');
  console.log('================================');
  
  const backendUrl = 'https://kaizen-web3-app-production.up.railway.app';
  
  try {
    console.log(`Testing: ${backendUrl}/api/health`);
    
    const response = await fetch(`${backendUrl}/api/health`);
    console.log('Status:', response.status);
    console.log('OK:', response.ok);
    
    const data = await response.text();
    console.log('Response:', data);
    
    if (response.ok) {
      console.log('✅ Backend is healthy!');
    } else {
      console.log('❌ Backend health check failed');
    }
    
  } catch (error) {
    console.error('❌ Backend is not accessible:', error.message);
    console.log('\n🔍 Possible issues:');
    console.log('1. Railway deployment is down');
    console.log('2. Backend service is not running');
    console.log('3. Network connectivity issue');
    console.log('4. Railway URL has changed');
  }
  
  // Also test registration endpoint
  console.log('\n🧪 Testing Registration Endpoint...');
  try {
    const regResponse = await fetch(`${backendUrl}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser123',
        email: 'test123@example.com', 
        password: 'testpass123'
      })
    });
    
    console.log('Registration Status:', regResponse.status);
    console.log('Registration OK:', regResponse.ok);
    
    const regData = await regResponse.text();
    console.log('Registration Response:', regData);
    
  } catch (error) {
    console.error('❌ Registration endpoint error:', error.message);
  }
};

testBackendHealth();
