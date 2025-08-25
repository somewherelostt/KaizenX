# Backend Deployment Options

## Quick Solutions for Your Friend to Test the App

### Option 1: Deploy Backend to Railway/Render (Recommended)

1. **Railway Deployment (Easiest)**:
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repo
   - Deploy the `backend` folder
   - Railway will auto-detect it's a Node.js app
   - Copy the deployment URL (e.g., `https://your-app.railway.app`)

2. **Update Frontend Environment Variable**:
   - Update `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=https://your-deployed-backend-url.railway.app
   ```

3. **Redeploy Frontend to Vercel**:
   - Vercel will automatically redeploy when you push changes
   - Add the environment variable in Vercel dashboard too

### Option 2: Use ngrok for Local Backend (Quick Test)

1. **Install ngrok**:
   ```bash
   npm install -g ngrok
   ```

2. **Expose local backend**:
   ```bash
   ngrok http 4000
   ```

3. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

4. **Update environment variable**:
   ```bash
   NEXT_PUBLIC_API_URL=https://abc123.ngrok.io
   ```

### Option 3: Temporary Mock Data Mode

We've already implemented fallbacks, so the app will work with limited functionality even without the backend.

## Current Status

✅ **Frontend**: Already configured with environment variables  
✅ **API calls**: Updated to use configurable API URLs  
✅ **Fallback data**: App works even if backend is unavailable  
❌ **Backend**: Currently only running locally  

## Next Steps

1. Choose one of the deployment options above
2. Update `NEXT_PUBLIC_API_URL` in Vercel environment variables
3. Your friend will be able to sign up and use the app!
