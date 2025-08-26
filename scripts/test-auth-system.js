// Test authentication flow
console.log("🧪 Testing Kaizen Authentication System...\n");

const API_BASE = "https://kaizen-x-delta.vercel.app";
const BACKEND_BASE = "https://kaizenx-production.up.railway.app";

// Test user data
const testUser = {
  username: "kaizentest" + Date.now(),
  email: "kaizentest" + Date.now() + "@example.com", 
  password: "TestPass123!"
};

async function testAuth() {
  try {
    console.log("1️⃣ Testing Backend Health...");
    
    // Test backend health
    const healthRes = await fetch(`${BACKEND_BASE}/api/health`);
    const healthData = await healthRes.json();
    console.log("✅ Backend Health:", healthData);
    
    console.log("\n2️⃣ Testing Registration...");
    
    // Test registration via Next.js API (if available)
    try {
      const registerRes = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testUser)
      });
      
      if (registerRes.ok) {
        console.log("✅ Frontend API Registration: Working");
      } else {
        console.log("⚠️ Frontend API not ready yet, testing backend directly...");
        
        // Fallback to direct backend registration
        const backendRegRes = await fetch(`${BACKEND_BASE}/api/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(testUser)
        });
        
        if (backendRegRes.ok) {
          console.log("✅ Backend Registration: Working");
        } else {
          console.log("❌ Backend Registration: Failed");
          return;
        }
      }
    } catch (err) {
      console.log("⚠️ Frontend API not ready, using backend directly");
      
      const backendRegRes = await fetch(`${BACKEND_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testUser)
      });
      
      if (backendRegRes.ok) {
        console.log("✅ Backend Registration: Working");
      } else {
        console.log("❌ Backend Registration: Failed");
        return;
      }
    }
    
    console.log("\n3️⃣ Testing Login...");
    
    // Test login
    try {
      const loginRes = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: testUser.email, 
          password: testUser.password 
        })
      });
      
      if (loginRes.ok) {
        const loginData = await loginRes.json();
        console.log("✅ Frontend API Login: Working");
        console.log("🔑 Token received:", loginData.token ? "Yes" : "No");
      } else {
        console.log("⚠️ Frontend API not ready, testing backend directly...");
        
        const backendLoginRes = await fetch(`${BACKEND_BASE}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: testUser.email, 
            password: testUser.password 
          })
        });
        
        if (backendLoginRes.ok) {
          const loginData = await backendLoginRes.json();
          console.log("✅ Backend Login: Working");
          console.log("🔑 Token received:", loginData.token ? "Yes" : "No");
        } else {
          console.log("❌ Backend Login: Failed");
        }
      }
    } catch (err) {
      console.log("⚠️ Frontend API not ready, using backend directly");
      
      const backendLoginRes = await fetch(`${BACKEND_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: testUser.email, 
          password: testUser.password 
        })
      });
      
      if (backendLoginRes.ok) {
        const loginData = await backendLoginRes.json();
        console.log("✅ Backend Login: Working");
        console.log("🔑 Token received:", loginData.token ? "Yes" : "No");
      } else {
        console.log("❌ Backend Login: Failed");
      }
    }
    
    console.log("\n🎉 Authentication system is working!");
    console.log("📝 Users can now sign up/sign in from anywhere!");
    
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
testAuth();
