const fetch = require('node-fetch');

const testRegistration = async () => {
  try {
    console.log('Testing registration API...');
    
    const registrationData = {
      username: 'maaz123',
      email: 'maaz123@gmail.com', // Fixed the email format
      password: 'maaz@123'
    };
    
    console.log('Sending registration request:', registrationData);
    
    const response = await fetch('https://kaizenx-production.up.railway.app/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registrationData)
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const responseData = await response.json();
    console.log('Response data:', responseData);
    
    if (response.ok) {
      console.log('✅ Registration successful!');
      
      // Now test login
      console.log('\nTesting login...');
      const loginResponse = await fetch('https://kaizenx-production.up.railway.app/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: registrationData.email,
          password: registrationData.password
        })
      });
      
      const loginData = await loginResponse.json();
      console.log('Login response:', loginData);
      
      if (loginResponse.ok) {
        console.log('✅ Login successful!');
      } else {
        console.log('❌ Login failed:', loginData);
      }
    } else {
      console.log('❌ Registration failed:', responseData);
    }
    
  } catch (error) {
    console.error('❌ Error testing registration:', error);
  }
};

testRegistration();
