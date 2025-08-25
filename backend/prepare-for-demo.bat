@echo off
echo.
echo ======================================
echo    KAIZEN WEB3 APP - DEMO PREP
echo ======================================
echo.

echo 1. Creating backup of current data...
node db-manager.js --backup

echo.
echo 2. Clearing all test data...
node clear-database.js --test-only

echo.
echo 3. Clearing uploaded files...
node db-manager.js --clear-uploads

echo.
echo 4. Listing final database state...
node db-manager.js --list

echo.
echo ======================================
echo    DEMO PREPARATION COMPLETE!
echo    Your app is ready for presentation
echo ======================================
echo.
pause
