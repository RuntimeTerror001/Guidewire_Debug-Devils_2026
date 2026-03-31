# GigClaimSafe - Quick Start Guide

## ⚡ Super Quick Start (5 minutes)

### Option 1: Using Windows PowerShell

**Terminal 1 - Backend:**
```powershell
cd d:\VS CODE\Guidewire\GigClaimSafe\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

**Terminal 2 - Frontend:**
```powershell
cd d:\VS CODE\Guidewire\GigClaimSafe\frontend
npm install
npm run dev
```

**Terminal 3 - Open Browser:**
```powershell
start http://localhost:3000
```

### Option 2: Using VS Code Terminal

1. Open VS Code in the GigClaimSafe folder
2. Open 2 integrated terminals (Ctrl + Shift + `)
3. Run backend commands in Terminal 1
4. Run frontend commands in Terminal 2

## 📚 Full Setup Instructions

See [README.md](../README.md) for complete documentation.

## 🎮 Demo Workflow

1. **Homepage** - Explore features at `http://localhost:3000`

2. **Register** - Go to `/onboarding`
   - Name: Raj Kumar
   - Platform: Uber
   - City: Mumbai
   - Weekly Earnings: 8000
   - Work Hours: 40
   - Click "Register" → Save User ID

3. **Dashboard** - Go to `/dashboard`
   - Enter saved User ID
   - See risk profile

4. **Plans** - Go to `/plans`
   - Enter User ID
   - Select "Standard" plan
   - Click "Select This Plan"

5. **Monitor** - Go to `/disruptions`
   - View all cities
   - See real-time disruptions
   - If disruption triggered, enter User ID and click "File Claim"

6. **Claims** - Go to `/claims`
   - Enter User ID
   - View all your claims
   - Filter by status

7. **Admin** - Go to `/admin`
   - View system statistics
   - See claims and payouts

## 🔧 Troubleshooting

**Backend won't start?**
- Make sure port 8000 is free
- Check Python installation: `python --version`
- Reinstall dependencies: `pip install -r requirements.txt`

**Frontend won't start?**
- Clear modules: `rm -r node_modules && npm install`
- Check Node version: `node --version`
- Kill old process: `lsof -ti:3000 | xargs kill -9`

**Can't connect frontend to backend?**
- Verify backend is running at http://localhost:8000/health
- Check .env.local has: `NEXT_PUBLIC_API_URL=http://localhost:8000`
- Check browser console for CORS errors

## 📊 API Documentation

While running backend, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 💡 Tips

- **Multiple Users**: Register different workers with different IDs
- **Refresh Monitor**: Click "Refresh Monitor" to simulate new disruption data
- **Chart Data**: Each refresh generates new random weather/AQI data
- **Claim Fraud Detection**: ~5-10% of claims get fraud flags automatically
- **Risk Scores**: Change city in registration to see different risk profiles

## 📱 Pages Overview

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Landing page with features |
| Register | `/onboarding` | Worker registration |
| Dashboard | `/dashboard` | User profile & claims history |
| Plans | `/plans` | Insurance plan selection |
| Monitor | `/disruptions` | Weather/AQI/Temperature tracking |
| Claims | `/claims` | Claim management & history |
| Admin | `/admin` | System statistics & analytics |

---

**Ready to start?** Run the quick start commands above! 🚀
