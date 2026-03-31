# GigClaimSafe - Full Stack Web Application

An AI-powered parametric insurance platform for gig delivery workers. Get instant payouts when weather, air quality, or temperature disrupts your deliveries.

## 🎯 Features

✅ **User Onboarding** - Register with platform, city, earnings, and work hours  
✅ **AI Risk Scoring** - Automatic risk profile generation based on multiple factors  
✅ **Insurance Plans** - Basic (₹20), Standard (₹35), Premium (₹50) with varying coverage  
✅ **Disruption Monitoring** - Real-time weather, AQI, and temperature tracking  
✅ **Parametric Triggers** - Automatic claim activation when thresholds are met  
✅ **Instant Claims Processing** - Fast claim creation and approval  
✅ **Fraud Detection** - AI-powered fraud detection with risk scoring  
✅ **Payout System** - Instant payouts after claim approval  
✅ **Dashboard UI** - Beautiful, responsive user interface  
✅ **Admin Dashboard** - System statistics and analytics  

## 🛠️ Tech Stack

### Backend
- **FastAPI** (Python)
- **SQLAlchemy** (ORM)
- **SQLite** (Database - can switch to PostgreSQL)
- **Uvicorn** (ASGI server)

### Frontend
- **Next.js 14** (React framework)
- **Tailwind CSS** (Styling)
- **Recharts** (Charts & visualizations)
- **Axios** (API calls)

## 📋 Prerequisites

- Python 3.9+
- Node.js 16+
- npm or yarn
- Git

## 🚀 Installation & Setup

### Clone the Repository

```bash
cd d:\VS CODE\Guidewire\GigClaimSafe
```

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create a Python virtual environment**
```bash
python -m venv venv
```

3. **Activate the virtual environment**

On Windows (PowerShell):
```bash
.\venv\Scripts\Activate.ps1
```

On Windows (CMD):
```bash
.\venv\Scripts\activate.bat
```

On Linux/Mac:
```bash
source venv/bin/activate
```

4. **Install dependencies**
```bash
pip install -r requirements.txt
```

5. **Run the FastAPI server**
```bash
python main.py
```

The backend will start at `http://localhost:8000`

**API Documentation available at:**
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to frontend directory** (in a new terminal)
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env.local file**
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

4. **Run the development server**
```bash
npm run dev
```

The frontend will start at `http://localhost:3000`

## 📱 Using the Application

### 1. Register a Worker
- Go to `http://localhost:3000`
- Click "Get Started" or navigate to `/onboarding`
- Fill in your details (name, platform, city, earnings, hours)
- System automatically generates your risk profile
- **Note your User ID** - you'll need it for other pages

### 2. View Your Dashboard
- Navigate to `/dashboard`
- Enter your User ID
- View your risk score, active policies, and claims history

### 3. Select an Insurance Plan
- Navigate to `/plans`
- Enter your User ID
- Choose Basic (₹20), Standard (₹35), or Premium (₹50)
- Click "Select This Plan" to activate

### 4. Monitor Disruptions
- Navigate to `/disruptions`
- View real-time weather, AQI, and temperature for all cities
- When disruption is triggered, enter your User ID and file a claim
- Check claim status on the claims page

### 5. View Your Claims
- Navigate to `/claims`
- Enter your User ID
- Filter claims by status (pending, approved, paid, rejected)
- View claim details and payout amounts

### 6. Admin Dashboard
- Navigate to `/admin`
- View system statistics (total users, claims, disruptions, payouts)
- See claims distribution and platform health metrics
- Monitor financial overview and retention rates

## 🔌 API Endpoints

### Users
- `POST /register` - Register a new worker
- `GET /users/{user_id}` - Get user details
- `GET /users` - List all users

### Risk Scoring
- `GET /risk-score/{user_id}` - Get risk profile

### Policies
- `POST /select-plan` - Select and activate a plan
- `GET /policies/{user_id}` - Get user policies
- `GET /policies/{user_id}/active` - Get active policy

### Disruption Monitor
- `GET /monitor/{city}` - Get monitor data for a city
- `GET /monitor-all` - Get disruptions for all cities

### Claims
- `POST /trigger-claim` - Create a claim
- `GET /claims/{user_id}` - Get user claims
- `GET /claims/{user_id}/recent` - Get recent claims
- `POST /claims/{claim_id}/approve` - Approve a claim

### Payouts
- `GET /payouts/{user_id}` - Get user payouts
- `GET /payouts/total/{user_id}` - Get total payout amount

### Admin
- `GET /admin/dashboard` - Get dashboard statistics
- `GET /admin/claims-by-status` - Get claims breakdown
- `GET /admin/fraud-flagged` - Get fraud-flagged claims

## 📊 Database Schema

### Users
```
id, name, platform, city, weekly_earnings, work_hours,
risk_score, risk_level, location_lat, location_lon,
fraud_score, created_at, updated_at
```

### Policies
```
id, user_id, plan_type, coverage_amount, premium,
is_active, created_at, updated_at
```

### Claims
```
id, user_id, policy_id, status, trigger_reason,
payout_amount, fraud_flag, fraud_score,
location_at_claim, created_at, updated_at
```

### Disruption Events
```
id, city, event_type, severity, affected_users, created_at
```

### Payouts
```
id, claim_id, user_id, amount, status, created_at
```

## 🧪 Demo Workflow

1. **Register** a worker (e.g., "Raj", delivering for Uber in Mumbai, ₹8000/week, 45 hours)
2. **Note the User ID** (e.g., 1)
3. **Check dashboard** to see risk profile
4. **Select a plan** (e.g., Standard for ₹35)
5. **Monitor disruptions** and see real-time weather/AQI/temperature
6. **Trigger a claim** when disruption is detected
7. **View claims** with automatic approval and payout
8. **Check admin** dashboard for system overview

## 🔐 Fraud Detection Logic

The system flags claims as suspicious if:
- Location mismatch detected (5% probability)
- Duplicate claim detected (5% probability)
- Unusual claim timing (between 12 AM - 6 AM)
- High frequency of claims (3% probability)

## 🌍 Risk Scoring Factors

- **City Base Risk** - Pre-assigned risk for each city (Mumbai: 0.7, Delhi: 0.6, etc.)
- **Weather Factor** - Random 0-20% weather disruption probability
- **Pollution Factor** - Random 0-15% AQI-based disruption
- **Work Intensity** - Based on work hours per week
- **Earnings Factor** - Lower earnings = higher risk

## 📈 Analytics & Charts

- Risk score distribution
- Claims by status (pie chart)
- Claims over time (line chart)
- Disruption events (tracked in real-time)
- Financial overview (revenue, payouts, loss ratio)

## ⚙️ Configuration

### Switch to PostgreSQL

Edit `backend/database.py`:
```python
DATABASE_URL = "postgresql://user:password@localhost/gigclaimsafe"
```

### Change API URL

Edit `.env.local` in frontend:
```
NEXT_PUBLIC_API_URL=http://your-backend-url:8000
```

### Modify Risk Thresholds

Edit `backend/disruption_monitor.py`:
```python
WEATHER_THRESHOLDS = {"rain_probability": 0.6}  # 60%
AQI_THRESHOLDS = {"severe": 400}
TEMPERATURE_THRESHOLDS = {"extreme_hot": 48, "extreme_cold": 5}
```

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Kill the process if needed (Windows)
taskkill /PID <PID> /F
```

### Frontend won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Database issues
```bash
# Delete the database and restart
rm backend/gigclaimsafe.db
python backend/main.py
```

### API connection issues
```bash
# Verify API is running
curl http://localhost:8000/health

# Check NEXT_PUBLIC_API_URL in .env.local
```

## 📦 Building for Production

### Backend
```bash
cd backend
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## 📝 License

This project is open-source and available for educational and commercial use.

## 👥 Support

For issues or questions, please open an issue or contact the development team.

---

**Happy Insurance! 🛡️** - GigClaimSafe Team
