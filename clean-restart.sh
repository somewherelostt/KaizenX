#!/bin/bash

echo ""
echo "======================================="
echo "   NEXT.JS CLEAN RESTART SCRIPT"
echo "======================================="
echo ""

echo "1. Stopping all Node.js processes..."
pkill -f node || true

echo "2. Cleaning Next.js build cache..."
if [ -d ".next" ]; then
    rm -rf .next
    echo "   - Removed .next directory"
else
    echo "   - .next directory not found (already clean)"
fi

echo "3. Cleaning node_modules cache..."
if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    echo "   - Removed node_modules cache"
else
    echo "   - No node_modules cache found"
fi

echo "4. Verifying dependencies..."
pnpm install

echo ""
echo "5. Starting backend server..."
cd backend && node src/index.js &
BACKEND_PID=$!
cd ..

echo "6. Waiting for backend to start..."
sleep 3

echo "7. Starting frontend development server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "======================================="
echo "   SERVERS STARTED SUCCESSFULLY!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:4000"
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo "======================================="
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
