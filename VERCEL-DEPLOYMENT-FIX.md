# Vercel Deployment Issues & Fixes

## Problem
Registration works on localhost but fails on Vercel deployment.

## Root Causes Identified

### 1. CORS Configuration Issue ✅ FIXED
**Problem**: Backend CORS only allows localhost origins
**Location**: `backend/src/index.js`
**Solution**: Updated CORS to include Vercel domains

```javascript
// OLD (problematic)
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://192.168.1.10:3000'],
  credentials: true
}));

// NEW (fixed)
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://192.168.1.10:3000',
    'https://kaizen-web3-app.vercel.app',
    'https://kaizen-web3-app-git-main-somewherelostt.vercel.app',
    /^https:\/\/kaizen-web3-app-.*\.vercel\.app$/
  ],
  credentials: true
}));
```

### 2. Backend Deployment Status
**Check**: Railway backend at `https://kaizen-web3-app-production.up.railway.app`
**Action Needed**: Redeploy backend with CORS fix

### 3. Vercel Environment Variables
**Current Config** (from vercel.json):
```json
{
  "env": {
    "NEXT_PUBLIC_API_URL": "https://kaizen-web3-app-production.up.railway.app"
  }
}
```

## Steps to Fix

### Step 1: Deploy Backend Changes
1. Push the CORS changes to your repository
2. Redeploy on Railway (should auto-deploy from git)
3. Verify backend is accessible

### Step 2: Test Backend Health
Use the debug script created: `debug-registration.js`

### Step 3: Verify Vercel Configuration
1. Check Vercel environment variables in dashboard
2. Ensure `NEXT_PUBLIC_API_URL` is set correctly
3. Redeploy Vercel if needed

### Step 4: Test Registration Flow
1. Open browser developer console on Vercel deployment
2. Run: `debugRegistration()`
3. Check console output for specific errors

## Common Error Messages & Solutions

### "Failed to fetch" or Network Error
- **Cause**: CORS blocking or backend down
- **Solution**: Verify backend CORS and deployment status

### "Registration failed. Please try again."
- **Cause**: Backend API returning error
- **Solution**: Check backend logs and database connection

### 404 Not Found
- **Cause**: Backend API endpoint not accessible
- **Solution**: Verify Railway deployment and API routes

## Testing Commands

### Test Backend Health
```bash
# Test if backend is accessible
curl https://kaizen-web3-app-production.up.railway.app/api/health

# Test registration endpoint
curl -X POST https://kaizen-web3-app-production.up.railway.app/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"test123"}'
```

### Debug in Browser Console (on Vercel)
```javascript
// Run this in browser console on your Vercel deployment
debugRegistration();
```

## Next Steps
1. ✅ CORS fix applied
2. 🔄 Deploy backend changes to Railway
3. 🔄 Test backend accessibility  
4. 🔄 Test registration on Vercel
5. 🔄 Monitor for any additional errors

## Monitoring
- Check Railway logs for backend errors
- Check Vercel function logs for frontend errors
- Use browser developer tools to inspect network requests
