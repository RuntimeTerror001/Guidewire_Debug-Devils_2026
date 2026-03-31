@echo off

REM GigClaimSafe Setup Script for Windows

echo.
echo 🛡️  GigClaimSafe - Setup Script for Windows
echo ================================

REM Backend setup
echo.
echo 📦 Setting up backend...
cd backend

REM Create virtual environment
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment (note: you'll need to run this manually)
REM call venv\Scripts\activate.bat

REM Install dependencies
echo Installing backend dependencies...
pip install -r requirements.txt

echo ✅ Backend setup complete!

REM Frontend setup
echo.
echo 📦 Setting up frontend...
cd ..\frontend

REM Install dependencies
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

REM Create .env.local
if not exist ".env.local" (
    echo Creating .env.local...
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:8000
    ) > .env.local
)

echo ✅ Frontend setup complete!

echo.
echo ================================
echo 🚀 Setup complete! Run this to start:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   .\venv\Scripts\Activate.ps1
echo   python main.py
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm run dev
echo.
echo Then open http://localhost:3000
echo ================================
