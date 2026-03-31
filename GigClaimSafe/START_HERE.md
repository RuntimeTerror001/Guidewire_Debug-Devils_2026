# 🚀 GigClaimSafe - START HERE

Welcome to GigClaimSafe! This is your complete AI-powered parametric insurance platform. Let's get it running!

## ⚡ Windows Quick Start (2 minutes)

Open PowerShell and run these commands:

### Step 1: Backend Setup
```powershell
cd d:\VS CODE\Guidewire\GigClaimSafe\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 2: Frontend Setup (New PowerShell Window)
```powershell
cd d:\VS CODE\Guidewire\GigClaimSafe\frontend
npm install
npm run dev
```

You should see:
```
> ready - started server on 0.0.0.0:3000
```

### Step 3: Open Browser
```
http://localhost:3000
```

---

## 🎮 First Time Demo (5 minutes)

### 1. Register a Worker
1. Click "Get Started" or go to `/onboarding`
2. Fill in the form:
   - Name: Raj Kumar
   - Platform: Uber
   - City: Mumbai
   - Weekly Earnings: 8000
   - Work Hours: 40
3. Click "Register & Generate Risk Profile"
4. **SAVE YOUR USER ID** (e.g., 1)

### 2. View Your Dashboard
1. Go to `/dashboard`
2. Enter your User ID
3. See your risk profile and risk score

### 3. Get Insurance
1. Go to `/plans`
2. Enter your User ID
3. Select "Standard" plan (₹35)
4. Click "Select This Plan"

### 4. Monitor Disruptions
1. Go to `/disruptions`
2. Watch for ⚠️ DISRUPTION DETECTED
3. When it appears:
   - Enter your User ID
   - Click "File Claim for Disruption"
4. See claim approved instantly!

### 5. View Your Claims
1. Go to `/claims`
2. Enter your User ID
3. See your claim with payout amount

### 6. Admin Stats
1. Go to `/admin`
2. See total users, claims, payouts
3. View claims distribution chart

---

## 📱 Pages You Can Access

| Page | URL | What to Do |
|------|-----|-----------|
| 🏠 Home | `http://localhost:3000` | Learn about features |
| 📝 Register | `http://localhost:3000/onboarding` | Sign up new workers |
| 📊 Dashboard | `http://localhost:3000/dashboard` | View your profile |
| 🛡️ Plans | `http://localhost:3000/plans` | Buy insurance |
| 🌦️ Monitor | `http://localhost:3000/disruptions` | Check weather/AQI |
| 📋 Claims | `http://localhost:3000/claims` | View your claims |
| 👨‍💼 Admin | `http://localhost:3000/admin` | See system stats |

---

## 🔧 If Something Goes Wrong

### Backend won't start?
```bash
# Check if port 8000 is already used
netstat -ano | findstr :8000

# If it shows a PID, kill it:
taskkill /PID <PID> /F

# Try again
python main.py
```

### Frontend won't start?
```bash
# Clear everything and reinstall
rmdir node_modules /s /q
del package-lock.json
npm install
npm run dev
```

### Can't connect frontend to backend?
1. Check: Is backend running at `http://localhost:8000/health`?
2. Check: Is `frontend/.env.local` set to `NEXT_PUBLIC_API_URL=http://localhost:8000`?
3. Check: Browser console for CORS errors

---

## 🧪 User IDs for Testing

After registering workers, use their IDs throughout the app:
- First worker: ID = 1
- Second worker: ID = 2
- etc.

Create multiple workers to see different risk profiles!

---

## 📚 Next Steps

1. **Explore the UI**
   - Try registering multiple workers
   - Check how risk scores differ by city
   - Select different plans

2. **Test the System**
   - Monitor disruptions (high rain/AQI/temperature)
   - File claims when disruptions trigger
   - Check fraud detection (some claims flagged)
   - View payouts

3. **Check Admin Dashboard**
   - See system statistics
   - View claims breakdown
   - Check platform health

4. **Read Documentation**
   - [README.md](./README.md) - Complete guide
   - [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Architecture overview
   - [CHECKLIST.md](./CHECKLIST.md) - Feature checklist

---

## 🌐 API Playground

Visit these URLs while backend is running:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

Try API calls directly from Swagger UI!

---

## 💡 Pro Tips

✅ **Refresh disruptions** multiple times to see different scenarios
✅ **Different cities** have different risk levels (Mumbai: high, Bangalore: low)
✅ **Some claims** automatically flagged as fraud (~10%)
✅ **Payouts vary** based on plan type selected
✅ **Admin dashboard** updates in real-time

---

## 📊 Test Data

After first registration:

- **User 1**: Raj, Uber, Mumbai
  - Risk: HIGH (0.7+)
  - Status: Fresh registration

- Try registering:
  - Same person in different city
  - Different platform (Swiggy vs Ola)
  - Different earnings (₹5000 vs ₹15000)

Watch how risk scores change!

---

## 🎯 What's Actually Happening?

### Backend (http://localhost:8000)
- FastAPI server
- SQLite database
- Real-time monitoring simulation
- Risk calculation
- Fraud detection
- Claim processing

### Frontend (http://localhost:3000)
- Next.js with React
- Tailwind CSS styling
- Recharts for visualizations
- Axios for API calls
- 9 pages + 5 components

### Data Flow
```
User Registration → Risk Calculation → Risk Profile
                        ↓
                   Active Policy
                        ↓
                 Disruption Detected
                        ↓
                   Claim Created
                        ↓
                  Fraud Detection
                        ↓
                   Auto-Approved
                        ↓
                      Payout
```

---

## ✅ Checklist: Getting Started

- [ ] Backend running on :8000 ✓
- [ ] Frontend running on :3000 ✓
- [ ] Registered first worker ✓
- [ ] Saved User ID ✓
- [ ] Selected a plan ✓
- [ ] Viewed dashboard ✓
- [ ] Monitored disruptions ✓
- [ ] Filed a claim ✓
- [ ] Checked payout ✓
- [ ] Viewed admin dashboard ✓

---

## 🚀 You're Ready!

The app is fully functional. Enjoy exploring GigClaimSafe!

### Questions?
- Check [README.md](./README.md) for complete docs
- Check API docs at http://localhost:8000/docs
- Review the code - it's well-commented!

### Next Milestone:
Deploy to production using Docker or cloud platform!

---

**Happy insuring! 🛡️** 

🎉 GigClaimSafe is ready to protect gig workers!
