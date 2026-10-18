# Nagorik Bhumi — Frontend

> Land Services for a Better Bangladesh · নাগরিক ভূমি

A modern Next.js 15 web application for managing land records, applications, documents, and tax payments in Bangladesh.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 3.4
- **State**: React Context (UserContext + LanguageContext)
- **Notifications**: Sonner
- **Language**: Bilingual — English & Bangla

---

## Features

| Module | Description |
|--------|-------------|
| Auth | NID-based register / login with JWT |
| Land Records | Full CRUD — add, edit, delete land properties |
| Applications | Submit and track land service applications |
| Documents | Upload and manage land documents |
| Land Tax | View and pay land tax online |
| Admin Panel | Manage users, review records, verify documents |

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/isratemma/nagorik-bhumi-frontend.git
cd nagorik-bhumi-frontend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your backend URL
```

### 3. Run

```bash
npm run dev
# Open http://localhost:3000
```

---

## Project Structure

```
app/                  # Next.js pages (App Router)
  login/              # Citizen login
  register/           # New user registration
  dashboard/          # Citizen portal
    land-records/     # CRUD land records
    applications/     # Submit & track applications
    documents/        # Upload documents
    land-tax/         # View & pay tax
    settings/         # Profile settings
  admin/              # Admin portal
    land-records/     # Approve/reject records
    applications/     # Review applications
    users/            # Manage users
    documents/        # Verify documents
    land-tax/         # Tax overview
    reports/          # Analytics & reports
components/           # Reusable UI components
  dashboard/          # Dashboard sidebar, topbar, content
  admin/              # Admin shell
context/              # React Context providers
  UserContext.js      # Auth state + localStorage
  LanguageContext.js  # EN/BN i18n
public/               # Static assets (logo, bg)
```

---

## Backend

This frontend connects to the Nagorik Bhumi backend API.
See: [nagorik-bhumi-backend](https://github.com/isratemma/nagorik-bhumi-backend)

Default API base: `http://localhost:5000/api`

---

## Demo Credentials

| Role | NID | Password |
|------|-----|----------|
| Citizen | `1234567890` | `password123` |
| Admin | `19901234567890000` | `password123` |

> Run the backend seeder first: `npm run seed`

---

## Deploy

Designed for deployment on **Vercel**. Set `NEXT_PUBLIC_API_URL` to your production backend URL.
