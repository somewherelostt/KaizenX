# Railway Environment Variables for Backend Deployment

## Add these in Railway Variables tab:

DB_URL=mongodb+srv://vbsaini:testPass@kaizentest.k4vlhp2.mongodb.net/kaizen?retryWrites=true&w=majority&ssl=true
JWT_SECRET=kaizen-super-secret-jwt-key-2024
PORT=8080

## Railway Settings:
- Root Directory: backend
- Start Command: npm start
- Builder: Nixpacks (default)

## After deployment:
1. Copy your Railway domain (e.g., https://your-app.railway.app)
2. Update NEXT_PUBLIC_API_URL in Vercel to point to this domain
3. Redeploy your Vercel app
