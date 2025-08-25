# MongoDB Connection Troubleshooting Guide

## Issue: MongoParseError - Invalid scheme

### Problem
```
MongoParseError: Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://"
```

### Root Cause
The environment variable `DB_URL` is not being loaded properly, causing the MongoDB connection string to be undefined or invalid.

## Solutions

### For Local Development ✅

**Status**: Should work correctly with the .env file

**Requirements**:
1. `.env` file exists in `/backend` directory
2. `.env` file contains valid MongoDB connection string
3. Running from correct directory

**Verification**:
```bash
cd backend
npm start
```

**Expected output**:
```
[dotenv@17.2.1] injecting env (1) from .env
✅ Database URL found, attempting connection...
Server running on port 4000
Connected to MongoDB
```

### For Railway Deployment 🚨

**Status**: Requires environment variables to be set in Railway dashboard

**Issue**: Railway deployments don't use .env files for security reasons.

**Solution**:
1. Go to your Railway project dashboard
2. Navigate to **Variables** section
3. Add these environment variables:

```
DB_URL=mongodb+srv://vbsaini:testPass@kaizentest.k4vlhp2.mongodb.net/kaizen?retryWrites=true&w=majority&ssl=true
JWT_SECRET=your-super-secret-jwt-key-for-production
PORT=8080
```

**How to identify Railway deployment**:
- Server runs on port 8080 (not 4000)
- File paths show `/app/src/index.js`
- dotenv shows "injecting env (0)"

### Debug Information

The updated code now provides detailed debugging:

```
🔍 Environment check:
NODE_ENV: not set
DB_URL environment variable: Set/NOT SET
DATABASE_URL environment variable: Set/NOT SET
Available environment variables: [...]
✅ Database URL found, attempting connection...
🔒 Connection string preview: mongodb+srv://...
```

## Quick Fix Commands

### Kill existing processes:
```bash
# Windows
taskkill /F /IM node.exe

# Linux/Mac
pkill node
```

### Restart server:
```bash
cd backend
npm start
```

### Test environment variables:
```bash
node -e "require('dotenv').config(); console.log('DB_URL:', process.env.DB_URL ? 'SET' : 'NOT SET');"
```

## Environment Variables Reference

### Local Development (.env file):
```
DB_URL=mongodb+srv://vbsaini:testPass@kaizentest.k4vlhp2.mongodb.net/kaizen?retryWrites=true&w=majority&ssl=true
```

### Railway Production:
Set in Railway dashboard Variables section:
- `DB_URL`: Your MongoDB connection string
- `JWT_SECRET`: Production JWT secret
- `PORT`: 8080

## Validation Checks

The code now validates:
1. ✅ Environment variables are loaded
2. ✅ DB_URL exists
3. ✅ Connection string format is valid (starts with mongodb:// or mongodb+srv://)
4. ✅ Connection is established

## Common Issues

1. **Wrong directory**: Make sure to run from `/backend` directory
2. **File encoding**: Ensure .env file has UTF-8 encoding
3. **Railway deployment**: Set environment variables in Railway dashboard, not .env file
4. **Port conflicts**: Local uses 4000, Railway uses 8080
5. **Case sensitivity**: Use `DB_URL` not `db_url`
