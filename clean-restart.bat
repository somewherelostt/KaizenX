@echo off
echo.
echo =======================================
echo    NEXT.JS CLEAN RESTART SCRIPT
echo =======================================
echo.

echo 1. Stopping all Node.js processes...
taskkill /f /im node.exe >nul 2>&1

echo 2. Cleaning Next.js build cache...
if exist ".next" (
    rmdir /s /q .next
    echo    - Removed .next directory
) else (
    echo    - .next directory not found (already clean)
)

echo 3. Cleaning node_modules cache...
if exist "node_modules\.cache" (
    rmdir /s /q node_modules\.cache
    echo    - Removed node_modules cache
) else (
    echo    - No node_modules cache found
)

echo 4. Verifying dependencies...
pnpm install

echo.
echo 5. Starting backend server...
start "Backend Server" cmd /k "cd backend && node src/index.js"

echo 6. Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo 7. Starting frontend development server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo =======================================
echo    SERVERS STARTED SUCCESSFULLY!
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:4000
echo =======================================
echo.
pause
