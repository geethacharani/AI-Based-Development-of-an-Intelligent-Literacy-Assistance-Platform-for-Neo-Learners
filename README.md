# 🌟 LingoPath AI — Intelligent Literacy Assistance Platform

> **AI-Based Development of an Intelligent Literacy Assistance Platform for Neo-Learners**  
> An installable, adaptive, multi-lingual literacy learning platform powered by React, Django REST Framework, and AI diagnostics.

---

## 📐 1. Architecture Overview

```text
                 LINGOPATH AI
                      |
          +-----------+-----------+
          |                       |
      FRONTEND                 BACKEND
  React 18 + Vite          Django 5.0 + DRF
      (TypeScript)            (Python 3.11)
          |                       |
       Vercel                  Render
          |                       |
     (PWA Enabled)            PostgreSQL
```

- **Frontend Application**: React 18, Vite 6, TypeScript, Tailwind CSS, Lucide React, PWA Service Worker. Hosted on **Vercel**.
- **Backend REST API**: Django 5.0, Django REST Framework, CORS Headers, WhiteNoise. Hosted on **Render**.
- **Production Database**: PostgreSQL (configured via `DATABASE_URL` with SQLite fallback for local development).
- **PWA Features**: Service Worker (`sw.js`), Web App Manifest (`manifest.json`), Offline Caching, `beforeinstallprompt` Install Card, iOS Safari install banner fallback.

---

## 🚀 2. Quick Start & Local Run Commands

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **Python**: `3.10` or `3.11`
- **Git**

### Backend Setup (Django REST API)
```bash
# 1. Navigate to backend directory (or stay in root)
cd backend

# 2. Create virtual environment (optional but recommended)
python -m venv env
# On Windows:
env\Scripts\activate
# On macOS/Linux:
source env/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run database migrations & seed initial data
python manage.py migrate
python seed_all_data.py

# 5. Start Django development server (Port 8000)
python manage.py runserver 8000
```
Backend API will be live at: `http://127.0.0.1:8000/`

---

### Frontend Setup (React + Vite PWA)
```bash
# 1. In project root folder:
npm install

# 2. Start Vite development server (Port 3000)
npx vite
# or
npm run dev
```
Frontend web application will be live at: `http://localhost:3000/`

---

## 🔑 3. Environment Variables Configuration

### Frontend `.env` (Project Root)
```ini
# Base API URL pointing to backend
VITE_API_BASE_URL=http://localhost:8000/api

# For Production (Vercel):
# VITE_API_BASE_URL=https://lingopath-backend.onrender.com/api
```

### Backend `.env` (`backend/.env`)
```ini
SECRET_KEY=your-production-django-secret-key-here
DEBUG=False
ALLOWED_HOSTS=.onrender.com,your-custom-domain.com,localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
CSRF_TRUSTED_ORIGINS=https://*.onrender.com,https://your-frontend.vercel.app

# Database URL for PostgreSQL on Render
DATABASE_URL=postgres://user:password@hostname:5432/dbname
```

---

## 📱 4. Progressive Web App (PWA) & Mobile Installation

LingoPath AI is fully PWA-enabled:

- **Automatic Install Card**: Displays an interactive **"Install App"** card on Dashboard, Profile, and post-registration.
- **iOS Safari Support**: Detects iOS devices and shows step-by-step instructions (*Share button -> Add to Home Screen*).
- **Standalone Mode**: Detects if the app is already installed and hides prompt automatically.
- **Offline Caching**: Caches static assets, app shell, and provides graceful offline notices for API calls.

---

## ⚡ 5. Admin Management System

Access the Admin Dashboard directly from the application sidebar or via URL:
- **Admin Dashboard**: `http://localhost:3000/admin`
- **Django Admin Interface**: `http://127.0.0.1:8000/admin/`

### Features:
- **Learner Management**: Dropdown action menu for viewing learner details, editing profile, enabling/disabling accounts, resetting passwords, progress inspection, and account deletion.
- **Assessment Management**: Create, edit, and audit diagnostic questions and detailed learner test attempts.
- **Curriculum & Lessons**: Unit breakdown, lesson node ordering, XP rewards, and skill types.
- **Progress Monitoring & Reports**: Analytics charts, proficiency distribution, game play breakdown, and weekly active trends.

---

## 🌐 6. Production Deployment Steps

### A. Deploy Frontend on Vercel
1. Import repository on [Vercel](https://vercel.com).
2. Set **Framework Preset** to `Vite`.
3. Set **Build Command** to `npm run build` and **Output Directory** to `dist`.
4. Add environment variable:
   - `VITE_API_BASE_URL` = `https://<YOUR-RENDER-BACKEND-NAME>.onrender.com/api`
5. Deploy! Vercel handles SPA routes via `vercel.json`.

### B. Deploy Backend on Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your GitHub repository.
3. Set **Root Directory** to `backend`.
4. Set **Build Command** to `./build.sh` (or `pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate`).
5. Set **Start Command** to `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`.
6. Add environment variables:
   - `DATABASE_URL` (from Render PostgreSQL Database)
   - `SECRET_KEY` (Generated secure string)
   - `DEBUG` = `False`
   - `ALLOWED_HOSTS` = `.onrender.com,<YOUR-VERCEL-DOMAIN>`
   - `CORS_ALLOWED_ORIGINS` = `https://<YOUR-VERCEL-DOMAIN>`
   - `CSRF_TRUSTED_ORIGINS` = `https://*.onrender.com,https://<YOUR-VERCEL-DOMAIN>`

---

## 🛠️ 7. Build Verification Commands

- **TypeScript Type Check**:
  ```bash
  npx tsc --noEmit
  ```
- **Frontend Production Build**:
  ```bash
  npm run build
  ```
- **Backend System & Migration Check**:
  ```bash
  python backend/manage.py check
  ```
