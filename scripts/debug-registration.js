const debugRegistration = () => {
  console.log("🔍 Debug Registration on Vercel");
  console.log("================================");
  
  // Check environment variables
  console.log("\n📋 Environment Variables:");
  console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL || "NOT SET");
  console.log("NODE_ENV:", process.env.NODE_ENV || "NOT SET");
  
  // Check current location
  console.log("\n🌐 Current Location:");
  console.log("Window location:", typeof window !== 'undefined' ? window.location.href : "Server-side");
  console.log("API Base URL:", process.env.NEXT_PUBLIC_API_URL || "https://kaizenx-production.up.railway.app");
  
  // Test registration function
  const testRegistration = async () => {
    console.log("\n🧪 Testing Registration...");
    
    const registrationData = {
      username: 'qwer',
      email: 'qwer@gmail.com',
      password: 'qwer@123'
    };
    
    // Determine API URL
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://kaizenx-production.up.railway.app";
    const apiUrl = `${apiBaseUrl}/api/register`;
    
    console.log("API URL:", apiUrl);
    console.log("Registration Data:", registrationData);
    
    try {
      console.log("Sending request...");
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });
      
      console.log("Response Status:", response.status);
      console.log("Response OK:", response.ok);
      console.log("Response URL:", response.url);
      
      const responseText = await response.text();
      console.log("Raw Response:", responseText);
      
      try {
        const responseData = JSON.parse(responseText);
        console.log("Parsed Response:", responseData);
      } catch (parseError) {
        console.log("Failed to parse response as JSON:", parseError.message);
      }
      
      if (!response.ok) {
        console.log("❌ Request failed");
        console.log("Status Code:", response.status);
        console.log("Status Text:", response.statusText);
        
        // Check for common issues
        if (response.status === 0) {
          console.log("🔍 Possible CORS or network issue");
        } else if (response.status === 404) {
          console.log("🔍 API endpoint not found - check backend deployment");
        } else if (response.status === 500) {
          console.log("🔍 Server error - check backend logs");
        }
      } else {
        console.log("✅ Registration successful!");
      }
      
    } catch (error) {
      console.error("❌ Network/Fetch Error:", error);
      console.error("Error message:", error.message);
      
      // Common error analysis
      if (error.message.includes("Failed to fetch")) {
        console.log("🔍 Possible causes:");
        console.log("  - Backend server is not running");
        console.log("  - CORS policy blocking request");
        console.log("  - Network connectivity issue");
        console.log("  - Incorrect API URL");
      }
    }
  };
  
  // Run the test
  testRegistration();
  
  // Additional debugging info
  console.log("\n🛠️ Troubleshooting Steps:");
  console.log("1. Check if backend is deployed and accessible");
  console.log("2. Verify NEXT_PUBLIC_API_URL environment variable in Vercel");
  console.log("3. Check CORS settings in backend for Vercel domain");
  console.log("4. Verify backend API endpoints are working");
  console.log("5. Check Vercel function logs for errors");
};

// Export for both browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = debugRegistration;
} else if (typeof window !== 'undefined') {
  window.debugRegistration = debugRegistration;
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  debugRegistration();
}
