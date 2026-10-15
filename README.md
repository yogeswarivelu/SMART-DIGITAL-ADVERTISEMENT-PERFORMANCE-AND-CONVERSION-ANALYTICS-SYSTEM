# CloudShield AI — Cloud-Native Cybersecurity & Incident Response Platform

CloudShield AI is a modern cybersecurity operations dashboard and automated threat management platform built with **React**, **Vite**, **TypeScript**, **FastAPI**, and **SQLite**.

> **Note on Data Mode:** This initial release operates using **clearly labelled synthetic demo data** (`is_synthetic: true`, `[DEMO]` prefix) reflecting realistic cloud security incidents, MITRE ATT&CK® tactics, and network anomalies.  
> **AWS Notice:** Cloud integration is running in standalone mock mode; **AWS is not yet integrated** as requested.

---

## 🛡️ Key Features

- **Security Posture Score & Metrics:** Dynamic security score calculation based on unresolved critical and high-severity threat vectors.
- **Visual Threat Analytics:**
  - **Threat Volume Timeline:** Area chart displaying critical, high, medium, and low incidents over time intervals.
  - **MITRE ATT&CK® Distribution:** Bar chart showing tactic alignments (Initial Access, Credential Access, Privilege Escalation, Exfiltration, etc.).
  - **Threat Vectors Breakdown:** Categorical donut/pie chart distribution.
- **Alert Management Console:**
  - Filtering by Severity (`Critical`, `High`, `Medium`, `Low`) and Status (`Open`, `Investigating`, `Resolved`, `Dismissed`).
  - Search by alert title, description, and forensic notes.
  - Quick 1-click **Resolve** action.
  - Interactive **Investigation Modal** to inspect risk scores, assign SecOps analysts, and save playbook notes.
- **Real-Time Security Event Stream:**
  - Synthetic telemetry log stream capturing source/destination IPs, target cloud resources, severity, and automated enforcement actions (`Blocked`, `Quarantined`, `Monitored`, `Logged`).
- **Active Incident Response Strip:**
  - Incident response cards with **One-Click Threat Containment** for rapid mitigation.
- **FastAPI REST API with SQLite:**
  - Relational database schema with SQLAlchemy models and Pydantic v2 validation.
  - Automatic seed population on first boot.
  - Interactive OpenAPI / Swagger UI at `/docs`.

---

## 📁 Project Architecture

```
CPPE PROJECT -2/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app with CORS & lifespan DB init
│   │   ├── database.py          # SQLite engine and session factory
│   │   ├── models.py            # SQLAlchemy models (SecurityEvent, Alert, Incident)
│   │   ├── schemas.py           # Pydantic v2 schemas and validation
│   │   ├── seed_data.py         # Realistic synthetic cybersecurity demo data seeder
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── overview.py      # Summary metrics and analytics
│   │       ├── alerts.py        # Alert triage, filtering, and CRUD
│   │       ├── events.py        # Event stream queries and search
│   │       └── incidents.py     # Incident containment and history
│   ├── test_api.py              # Pytest automated API test suite
│   ├── requirements.txt         # Python dependencies
│   ├── run.py                   # Backend entry point (uvicorn on port 8000)
│   └── cloudshield.db           # SQLite database
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx           # Brand, live status badges, manual sync
│   │   │   ├── SummaryCards.tsx     # Posture score, active threats, open alerts
│   │   │   ├── ThreatCharts.tsx     # Recharts timeline, MITRE ATT&CK, vectors
│   │   │   ├── AlertManagement.tsx  # Filterable alert table with quick actions
│   │   │   ├── EventLogTable.tsx    # Live telemetry event stream table
│   │   │   ├── IncidentBanner.tsx   # Active incidents with One-Click Containment
│   │   │   └── AlertDetailModal.tsx # Full triage & analyst notes modal
│   │   ├── services/
│   │   │   └── api.ts           # REST API client connecting to FastAPI
│   │   ├── types/
│   │   │   └── index.ts         # TypeScript interfaces and domain types
│   │   ├── App.tsx              # Main dashboard application
│   │   ├── main.tsx             # React DOM entry
│   │   └── index.css            # Dark cybersecurity theme and glassmorphic styling
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts           # Configured with proxy to http://127.0.0.1:8000
├── run-backend.ps1              # Windows PowerShell backend launcher
├── run-frontend.ps1             # Windows PowerShell frontend launcher
├── start-all.ps1                # All-in-one launcher for both services
└── README.md
```

---

## ⚡ Windows PowerShell Quickstart

### 1. Launch All Services (Recommended)
Open a Windows PowerShell terminal in the project directory and run:

```powershell
.\start-all.ps1
```
This script starts both the FastAPI backend and the Vite dev server in separate background windows.

---

### 2. Manual Component Setup & Launch

#### Backend (FastAPI + SQLite)
```powershell
cd backend

# Create virtual environment (if not already created)
python -m venv venv

# Activate and install dependencies
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Run backend API
python run.py
```
- **Backend API:** `http://127.0.0.1:8000`
- **Swagger Documentation:** `http://127.0.0.1:8000/docs`
- **Alternative launcher script:** `.\run-backend.ps1` from root directory.

#### Frontend (React + Vite + TypeScript)
```powershell
cd frontend

# Install packages
npm install

# Start Vite dev server
npm run dev
```
- **React Dashboard:** `http://localhost:5173`
- **Alternative launcher script:** `.\run-frontend.ps1` from root directory.

---

## 🧪 Testing & Verification

### Run Backend Tests (pytest)
```powershell
cd backend
.\venv\Scripts\pytest.exe -v
```
All endpoints (`/api/health`, `/api/overview`, `/api/alerts`, `/api/events`, `/api/incidents`) are verified with automated tests.

### Run Frontend Production Build & TypeScript Typecheck
```powershell
cd frontend
npm run build
```
Compiled with zero TypeScript errors or warnings.

---

## 🌐 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check and synthetic mode status |
| `GET` | `/api/overview` | Posture score, hourly trends, MITRE tactics distribution |
| `GET` | `/api/alerts` | Query alerts (supports `?severity=`, `?status=`, `?search=`) |
| `GET` | `/api/alerts/{id}` | Retrieve individual alert details |
| `PATCH`| `/api/alerts/{id}` | Update alert status, analyst assignment, or notes |
| `POST`| `/api/alerts/{id}/quick-resolve` | Instant quick resolution action |
| `GET` | `/api/events` | Telemetry log stream (supports `?severity=`, `?search=`, `?limit=`) |
| `GET` | `/api/incidents` | List security incident records |
| `POST`| `/api/incidents/{id}/contain` | Trigger incident containment action |

---

## 🚀 Phase 2 Roadmap
- [ ] Connect live AWS CloudTrail, GuardDuty, and Security Hub integrations.
- [ ] Add real-time WebSocket stream for high-frequency security events.
- [ ] Implement multi-tenant authentication with OAuth 2.0 / JWT.
