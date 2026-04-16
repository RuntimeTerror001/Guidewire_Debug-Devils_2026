# GigClaimSafe

GigClaimSafe is a professional full-stack parametric insurance platform for gig delivery workers in India. It pairs a FastAPI backend with a Next.js 14 frontend, live disruption detection, fraud intelligence, and instant UPI-style payout flows.

## 🚀 What’s Included

- Worker onboarding with platform, city, earnings, hours, and UPI registration
- Automatic risk profile generation
- Plan selection: Basic, Standard, Premium
- Live disruption monitor for rain, AQI, and temperature thresholds
- Claim filing, automated claim processing, and payout history
- Fraud detection for GPS spoofing, duplicate claims, and rapid claim frequency
- Admin analytics for active policies, payouts, and fraud alerts
- Modern, responsive UI built with Tailwind CSS and Recharts

## 🧩 Tech Stack

- **Backend**: FastAPI, SQLAlchemy, SQLite, Pydantic v2, Uvicorn
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, lucide-react, Recharts, react-hot-toast
- **Dev Tools**: Environment variables, seed demo data, centralized API client

## 🛠 Prerequisites

- Python 3.10+ (Python 3.13 tested)
- Node.js 16+ / npm
- Git

## ⚙️ Setup

### Backend

```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1   # PowerShell
# or .\venv\Scripts\activate.bat for CMD
pip install -r requirements.txt
```

Copy the backend example env file if needed:

```bash
copy .env.example .env
```

Run the API server from the repository root:

```bash
cd ..
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

Open API docs:
- `http://localhost:8000/docs`
- `http://localhost:8000/redoc`

### Frontend

```bash
cd frontend
npm install
```

Copy the example frontend env file:

```bash
copy .env.example .env.local
```

Run the frontend:

```bash
npm run dev
```

The app is available at:
- `http://localhost:3000`

## 📍 Frontend Pages

- `/` — Landing page
- `/onboard` — Register a worker
- `/dashboard` — Worker dashboard
- `/plans` — Plan selection
- `/monitor` — Disruption monitor
- `/claims` — Claim filing and history
- `/payout` — Payout ledger
- `/admin` — Admin overview

## 🔌 Backend API Endpoints

### Users
- `POST /register`
- `GET /worker/{user_id}`
- `GET /risk-score/{user_id}`

### Plans
- `GET /plans`
- `POST /select-plan`

### Monitor
- `GET /monitor`
- `GET /disruptions/active`
- `POST /admin/trigger`

### Claims
- `POST /trigger-claim`
- `GET /claims/{user_id}`
- `GET /claims`

### Payouts
- `POST /payout/initiate`
- `GET /payouts/{user_id}`
- `GET /payouts`

### Admin
- `GET /admin/stats`
- `GET /admin/fraud-log`
- `GET /admin/forecast`

### Notifications
- `GET /notifications/{user_id}`
- `PATCH /notifications/{notification_id}/read`

## 📁 Repository Structure

- `backend/` — API, ORM models, services, demo seed data
- `frontend/` — Next.js application, shared UI components
- `frontend/lib/api.ts` — environment-backed API client
- `backend/.env.example` — backend configuration template
- `frontend/.env.example` — frontend runtime config template

## ✅ Professional Notes

- The frontend uses `NEXT_PUBLIC_API_URL` with a fallback to `http://localhost:8000`
- The backend seeds demo worker and disruption data automatically on startup
- The repo is ready for local development, testing, or Docker deployment
- Backend imports have been standardized for package stability

## 🎯 Recommended Workflow

1. Start backend: `python main.py`
2. Start frontend: `npm run dev`
3. Register a worker on `/onboard`
4. Activate a plan on `/plans`
5. Monitor live triggers on `/monitor`
6. File a claim on `/claims`
7. Review settlement on `/payout`
8. Inspect platform performance on `/admin`
