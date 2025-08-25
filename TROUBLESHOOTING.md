# Troubleshooting Next.js Chunk Loading Errors

If you encounter **ChunkLoadError: Loading chunk app/page failed** or similar webpack chunk errors, follow these steps:

## 🚨 Quick Fix

### Windows:
```bash
# Use the automated clean restart script
./clean-restart.bat
```

### Mac/Linux:
```bash
# Make executable and run
chmod +x clean-restart.sh
./clean-restart.sh
```

## 🛠️ Manual Fix Steps

1. **Stop all Node processes:**
   ```bash
   # Windows
   taskkill /f /im node.exe
   
   # Mac/Linux
   pkill -f node
   ```

2. **Clear Next.js cache:**
   ```bash
   # Windows
   rmdir /s /q .next
   
   # Mac/Linux
   rm -rf .next
   ```

3. **Clear node_modules cache (if exists):**
   ```bash
   # Windows
   rmdir /s /q node_modules\.cache
   
   # Mac/Linux
   rm -rf node_modules/.cache
   ```

4. **Reinstall dependencies:**
   ```bash
   pnpm install
   ```

5. **Restart servers:**
   ```bash
   # Terminal 1: Backend
   cd backend && node src/index.js
   
   # Terminal 2: Frontend  
   npm run dev
   ```

## 🔍 Why This Happens

- **Stale build cache**: Old webpack chunks conflict with new code
- **Port conflicts**: Multiple dev servers running simultaneously
- **Hot reload issues**: Development server gets confused during rapid changes
- **Memory issues**: Node processes accumulating over time

## 🛡️ Prevention Tips

1. **Always use the clean-restart script** when switching branches or after major changes
2. **Close dev servers properly** with Ctrl+C instead of closing terminals abruptly
3. **Clear cache regularly** during intensive development sessions
4. **Use different ports** if running multiple Next.js projects

The clean-restart scripts will handle all of this automatically! 🚀
