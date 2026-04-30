[![PSS Trust Banner](https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/974e4549-30b9-4cce-9a10-4ea107da6b4f.png)](https://pss-trust.vercel.app)

# 🎓 PSS Trust — Student Management Portal

### POTUKUCHI SOMASUNDARA SOCIAL WELFARE AND CHARITABLE TRUST

**Reg No: 95/2003 · Est. August 15, 2003**

*Digitizing welfare for students from Below Poverty Line (BPL) families*

---

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel&logoColor=white)](https://pss-trust.vercel.app)
[![CI](https://github.com/Bhanu99517/pss-trust/actions/workflows/ci.yml/badge.svg)](https://github.com/Bhanu99517/pss-trust/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

**[🌐 Live Demo](https://pss-trust.vercel.app)** · **[🐛 Report Bug](https://github.com/Bhanu99517/pss-trust-original/issues/new?template=bug_report.md)** · **[✨ Request Feature](https://github.com/Bhanu99517/pss-trust-original/issues/new?template=feature_request.md)**

---

## 📑 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Admin Hierarchy](#-admin-hierarchy)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Environment Variables](#-environment-variables-reference)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Clone & Install](#1-clone-the-repository)
  - [Environment Setup](#3-configure-environment-variables)
  - [Database Setup](#4-set-up-the-database)
  - [Chairman Account](#5-create-the-chairman-user)
  - [face-api.js Models](#6-download-face-apijs-model-weights)
  - [Running Locally](#7-start-the-development-server)
- [Available Scripts](#-available-scripts)
- [Deployment (Vercel)](#-deployment-vercel)
- [PWA Installation](#-pwa-installation)
- [User Flows](#-user-flows)
- [Security](#-security)
- [Planned Features](#-planned-features)
- [Contributing](#-contributing)
- [Contributors](#-contributors)
- [Support](#-support)
- [License](#-license)

---

## 📖 About the Project

**PSS Trust** (Potukuchi Somasundara Social Welfare and Charitable Trust) is a registered NGO (Reg No: 95/2003) founded on **August 15, 2003**, dedicated to breaking financial barriers for underprivileged students from **Below Poverty Line (BPL) families** across multiple branches in Telangana.

This full-stack web portal replaces slow, error-prone manual paperwork with a seamless digital workflow — covering everything from student registration and biometric face-based attendance to fee applications and a **three-tier admin approval hierarchy**. It is designed to be accessible, fast, and reliable for both students and administrators.

### Why PSS Trust Portal?

- **Before:** Paper-based fee applications, manual attendance registers, and physical document submission meant long delays, errors, and administrative overhead.
- **After:** Students can register, apply for fee support, and track status from their phone. Admins can review, approve, or reject applications in a structured hierarchy — entirely online.

> Built with ❤️ to empower students who deserve a fair chance at education.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧑‍🎓 **Student Registration** | Full signup with SSC details, course info (Diploma / B.Tech), and branch selection — invite-code protected via OTP email flow |
| 🤖 **Face Recognition Attendance** | Register your face once; mark attendance daily using `face-api.js` with real-time in-browser detection (no server round-trips for inference) |
| 📄 **Fee Application System** | Submit fee requests with academic records and document uploads stored in Supabase Storage |
| 🏛️ **Three-Tier Admin Approval** | Chairman → Super Incharge → Branch Incharge approval hierarchy with role-based routing and comment threads |
| 🔐 **OTP-Based Admin Login** | All admin logins require a two-step email OTP verification flow after password entry |
| 🌿 **Multi-Branch Management** | Support for branches (BHEL, Bollaram, MYP, MKR, ECIL) with geo-fencing via latitude / longitude / radius configuration |
| 🔍 **Application Status Tracker** | Students check real-time fee application status without logging in — just their Student ID |
| 📊 **Attendance Reports** | View personal attendance history with dates and recognition method |
| 📧 **Email Notifications** | Automated approval/rejection emails sent via Nodemailer with Gmail SMTP |
| 🔑 **Secure Password Change** | Two-step OTP-verified password change flow for admins |
| 🔒 **Row Level Security** | Supabase Auth + PostgreSQL RLS policies enforce role-based data isolation |
| 📲 **Progressive Web App (PWA)** | Fully installable on mobile and desktop; works offline with pre-cached assets |
| 🖼️ **Gallery & Success Stories** | Showcase trust events and student achievements with animated layouts |
| 🏠 **Public Pages** | Home, About Us, Our Impact, Contact Us — fully animated with Framer Motion |
| 📱 **Mobile Responsive** | Tailwind CSS responsive design optimised for all screen sizes |

---

## 🏗️ Admin Hierarchy

The portal features a **three-tier admin approval** workflow:

```
Chairman  (full access — manages branches, incharges, and all applications)
  └── Super Incharge  (cross-branch review — sees escalated applications)
        └── Branch Incharge  (first-level review per assigned branch)
```

### Role Breakdown

| Role | Responsibilities |
|---|---|
| **Chairman** | Create / delete Branch Incharges, manage branches, final approve/reject applications, generate student invite codes, view all data |
| **Super Incharge** | Review fee applications from all branches that have been processed by Branch Incharges; escalate to Chairman |
| **Branch Incharge** | First review of fee applications for their assigned branch only; add review comments |

### Authentication

- All admin roles log in at `/admin` using email + password.
- After password verification, a **6-digit OTP** is emailed and must be entered to complete login.
- OTPs are short-lived and stored in the `otp_codes` table with expiry timestamps.
- The Chairman account is a special Supabase Auth user whose email is set in `VITE_CHAIRMAN_EMAIL`.

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Frontend** | React | 19.0 |
| **Language** | TypeScript | ~5.8.2 |
| **Build Tool** | Vite | 6.2 |
| **Styling** | Tailwind CSS | 4.1 |
| **Animations** | Framer Motion (via `motion`) | 12.x |
| **Routing** | React Router DOM | 7.x |
| **Icons** | Lucide React | 0.546 |
| **Backend** | Express.js | 4.x |
| **Runtime** | Node.js (via `tsx`) | 18+ |
| **Database** | Supabase (PostgreSQL) | — |
| **Auth** | Supabase Auth | — |
| **Storage** | Supabase Storage | — |
| **Face Recognition** | face-api.js (SSD MobileNet v1) | 0.22.2 |
| **Email** | Nodemailer + Gmail SMTP | 8.x |
| **File Uploads** | Multer | 2.x |
| **PWA** | vite-plugin-pwa | 1.x |
| **Linting** | ESLint + typescript-eslint | 9.x |
| **Formatting** | Prettier | 3.x |
| **CI/CD** | GitHub Actions | — |
| **Deployment** | Vercel (frontend + serverless functions) | — |

---

## 🏛️ Architecture Overview

```
┌───────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                        │
│   React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion │
│                                                               │
│  ┌──────────┐  ┌────────────┐  ┌──────────────────────────┐  │
│  │ Public   │  │  Student   │  │       Admin Panels        │  │
│  │ Pages    │  │  Flows     │  │  Chairman / Super /       │  │
│  │ (Home,   │  │ (Signup,   │  │  Branch Incharge          │  │
│  │  About,  │  │  Attendance│  │  Dashboards               │  │
│  │  Impact, │  │  Fee App,  │  │                           │  │
│  │  Gallery)│  │  Status)   │  │                           │  │
│  └──────────┘  └────────────┘  └──────────────────────────┘  │
│                                                               │
│  face-api.js runs entirely in-browser (WebGL / WASM)          │
└────────────────────┬──────────────────────────────────────────┘
                     │ HTTP/REST
         ┌───────────▼─────────────┐
         │   Vercel Serverless API  │
         │   /api/* functions       │
         │   (Node.js + Express)    │
         │                         │
         │  Nodemailer → Gmail SMTP │
         └───────┬─────────────────┘
                 │
    ┌────────────▼────────────────────┐
    │           Supabase              │
    │  ┌───────────┐  ┌────────────┐  │
    │  │PostgreSQL │  │  Storage   │  │
    │  │  + RLS    │  │  Buckets   │  │
    │  └───────────┘  └────────────┘  │
    │  ┌───────────┐                  │
    │  │   Auth    │                  │
    │  └───────────┘                  │
    └─────────────────────────────────┘
```

**Key design decisions:**
- Face recognition inference runs **entirely in the browser** using `face-api.js` + SSD MobileNet v1 model weights served from `public/models/`. No face images are sent to the server for inference.
- The Express `server.ts` acts as a local dev server that also serves Vite's dev middleware. In production, Vercel converts the `api/` directory into serverless functions automatically.
- Supabase Row Level Security (RLS) policies ensure that even if the anon key is exposed, users can only access data permitted by their role.

---

## 📁 Project Structure

```
pss-trust-original/
├── .github/
│   ├── workflows/
│   │   └── ci.yml                        # GitHub Actions CI pipeline (lint + build)
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md                 # Bug report issue template
│   │   └── feature_request.md            # Feature request issue template
│   └── pull_request_template.md          # PR template
│
├── public/
│   ├── models/                           # face-api.js SSD MobileNet v1 weights (required!)
│   │   ├── ssd_mobilenetv1_model-weights_manifest.json
│   │   ├── ssd_mobilenetv1_model-shard1
│   │   ├── face_landmark_68_model-weights_manifest.json
│   │   ├── face_landmark_68_model-shard1
│   │   ├── face_recognition_model-weights_manifest.json
│   │   └── face_recognition_model-shard1
│   ├── icon-192.png                      # PWA icon (192×192)
│   ├── icon-512.png                      # PWA icon (512×512)
│   └── screenshot-*.png                  # PWA install screenshots
│
├── src/
│   ├── components/
│   │   ├── AdminLogin.tsx                # OTP-based admin authentication UI
│   │   ├── AdminOtp.tsx                  # OTP entry step for admin 2FA
│   │   ├── Attendance.tsx                # Live face verification & attendance marking
│   │   ├── ChairmanDashboard.tsx         # Chairman panel — full system access
│   │   ├── SuperInchargeDashboard.tsx    # Super Incharge panel — cross-branch review
│   │   ├── InchargeDashboard.tsx         # Branch Incharge panel — branch-level review
│   │   ├── ChangePassword.tsx            # OTP-verified password update for admins
│   │   ├── CheckStatus.tsx               # Public application status tracker (no login)
│   │   ├── FaceRegistration.tsx          # One-time face capture & descriptor storage
│   │   ├── FeeApplication.tsx            # Student fee request submission form
│   │   ├── Signup.tsx                    # Student registration (invite-code + OTP protected)
│   │   └── StudentAttendance.tsx         # Personal attendance history view
│   │
│   ├── pages/
│   │   ├── Home.tsx                      # Animated landing page
│   │   ├── About.tsx                     # About PSS Trust history & mission
│   │   ├── Impact.tsx                    # Our Impact — statistics & reach
│   │   ├── Gallery.tsx                   # Trust events photo gallery
│   │   ├── SuccessStories.tsx            # Student success stories
│   │   └── Contact.tsx                   # Contact form & details
│   │
│   ├── App.tsx                           # Root component with React Router routes
│   ├── config.ts                         # Shared constants (CHAIRMAN_EMAIL, branch list, etc.)
│   ├── supabaseClient.ts                 # Supabase client initialisation
│   ├── index.css                         # Global Tailwind + custom CSS
│   └── main.tsx                          # React app entry point (ReactDOM.createRoot)
│
├── api/                                  # Vercel serverless API functions
│   ├── branches/
│   │   └── index.ts                      # GET / POST / PUT / DELETE branches
│   ├── application-otp.ts               # Send OTP for fee application actions
│   ├── create-incharge.ts               # Chairman creates a new Branch/Super Incharge
│   ├── delete-incharge.ts               # Chairman deletes an Incharge account
│   ├── generate-signup-code.ts          # Chairman generates student invite codes
│   ├── get-signup-code.ts               # Retrieve active signup invite code
│   ├── register-student.ts              # Create student record in DB after OTP verification
│   ├── send-login-otp.ts                # Send 2FA OTP to admin email at login
│   ├── send-signup-otp.ts               # Send OTP to student email during signup
│   ├── send-student-id.ts               # Email student their generated Student ID
│   ├── verify-login-otp.ts              # Validate admin OTP and complete login
│   └── verify-signup-otp.ts             # Validate student signup OTP
│
├── server.ts                             # Express dev server (serves Vite + API locally)
├── index.html                            # Vite HTML entry point
├── vite.config.ts                        # Vite config (React plugin, PWA plugin, proxy)
├── tsconfig.json                         # TypeScript compiler configuration
├── eslint.config.js                      # ESLint flat config
├── .prettierrc                           # Prettier formatting rules
├── .prettierignore                       # Prettier ignore patterns
├── .gitignore                            # Git ignore (node_modules, dist, .env, etc.)
├── .env.example                          # Environment variable template
├── vercel.json                           # Vercel deployment & routing config
├── metadata.json                         # PWA / app metadata
├── package.json                          # npm scripts & dependencies
├── package-lock.json                     # Lockfile
├── reset_supabase.sql                    # Full DB schema — drops & recreates all tables
├── supabase_setup.sql                    # Additional / incremental migrations
├── supabase-blueprint.json               # Supabase project export blueprint
├── LICENSE                               # MIT License
├── CONTRIBUTING.md                       # Contribution guidelines
├── CODE_OF_CONDUCT.md                    # Community code of conduct
├── SECURITY.md                           # Security vulnerability policy
└── CHANGELOG.md                          # Project changelog
```

---

## 🗄️ Database Schema

All tables are in the public schema of your Supabase PostgreSQL instance, with **Row Level Security (RLS) enabled** on every table.

![Database Schema](./docs/schema.svg)
 
> *Entity-relationship diagram generated from Supabase Schema Visualizer.*

### `students`
Stores student profiles created at signup.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary key (auto-generated) |
| `student_id` | `text` | Unique human-readable ID (e.g. `PSS-2024-001`) |
| `full_name` | `text` | Student full name |
| `email` | `text` | Contact email |
| `phone` | `text` | Phone number |
| `branch_id` | `uuid` | FK → `branches.id` |
| `course` | `text` | `Diploma` or `B.Tech` |
| `branch_name` | `text` | Engineering branch (e.g. CSE, ECE) |
| `ssc_percentage` | `numeric` | SSC marks percentage |
| `aadhar` | `text` | Aadhar number (masked) |
| `photo_url` | `text` | Supabase Storage URL for profile photo |
| `created_at` | `timestamptz` | Registration timestamp |

---

### `attendance`
Records each attendance event.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary key |
| `student_id` | `text` | FK → `students.student_id` |
| `marked_at` | `timestamptz` | When attendance was marked |
| `method` | `text` | `face` or `manual` |
| `branch_id` | `uuid` | FK → `branches.id` |

---

### `attendance_faces`
Stores the 128-dimensional face descriptor for each student, used by face-api.js during recognition.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary key |
| `student_id` | `text` | FK → `students.student_id` (unique) |
| `descriptor` | `float8[]` | 128-value face embedding array |
| `created_at` | `timestamptz` | When face was registered |

---

### `applications`
Fee application submissions with approval workflow state.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary key |
| `student_id` | `text` | FK → `students.student_id` |
| `branch_id` | `uuid` | FK → `branches.id` |
| `academic_year` | `text` | e.g. `2024-25` |
| `fee_amount` | `numeric` | Fee amount applied for |
| `document_url` | `text` | Supabase Storage URL for uploaded fee receipt |
| `status` | `text` | `pending` / `approved` / `rejected` |
| `incharge_comment` | `text` | Branch Incharge review comment |
| `super_comment` | `text` | Super Incharge review comment |
| `chairman_comment` | `text` | Chairman review comment |
| `incharge_status` | `text` | Branch Incharge decision |
| `super_status` | `text` | Super Incharge decision |
| `created_at` | `timestamptz` | Submission timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

---

### `branches`
Trust branch locations with geo-fence configuration.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary key |
| `name` | `text` | Branch name (e.g. `BHEL`, `Bollaram`) |
| `latitude` | `float8` | Geo-fence centre latitude |
| `longitude` | `float8` | Geo-fence centre longitude |
| `radius_metres` | `integer` | Allowed radius in metres for attendance |
| `created_at` | `timestamptz` | Creation timestamp |

> **Seeded branches:** BHEL, Bollaram, MYP, MKR, ECIL

---

### `incharges`
Admin accounts (Branch Incharge and Super Incharge).

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary key (matches Supabase Auth UID) |
| `email` | `text` | Login email |
| `role` | `text` | `branch_incharge` or `super_incharge` |
| `branch_id` | `uuid` | FK → `branches.id` (null for Super Incharge) |
| `created_at` | `timestamptz` | Creation timestamp |

---

### `otp_codes`
Short-lived OTP codes for admin login and student signup.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary key |
| `email` | `text` | Target email address |
| `otp` | `text` | 6-digit code |
| `purpose` | `text` | `login` / `signup` / `password_change` |
| `expires_at` | `timestamptz` | Expiry time (typically 10 minutes) |
| `used` | `boolean` | Whether OTP has been consumed |

---

## 🔌 API Reference

All API endpoints are located in `api/` and run as Vercel Serverless Functions in production. Locally, they are served by `server.ts` via Express.

### Branches

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/branches` | List all branches | None |
| `POST` | `/api/branches` | Create a new branch | Service Role |
| `PUT` | `/api/branches/:id` | Update branch details | Service Role |
| `DELETE` | `/api/branches/:id` | Delete a branch | Service Role |

### OTP & Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/send-login-otp` | Send 6-digit OTP to admin email |
| `POST` | `/api/verify-login-otp` | Verify admin OTP; returns success/failure |
| `POST` | `/api/send-signup-otp` | Send OTP to student email during registration |
| `POST` | `/api/verify-signup-otp` | Verify student signup OTP |
| `POST` | `/api/application-otp` | Send OTP for fee application actions |

### Student Management

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/register-student` | Insert validated student record into DB |
| `POST` | `/api/send-student-id` | Email the generated Student ID to the student |
| `GET` | `/api/get-signup-code` | Retrieve active invite code (Chairman only) |
| `POST` | `/api/generate-signup-code` | Generate new student invite code |

### Incharge Management

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/create-incharge` | Create Branch / Super Incharge account (Chairman only) |
| `POST` | `/api/delete-incharge` | Delete an Incharge account and revoke Supabase Auth (Chairman only) |

> All endpoints that modify data validate the `SUPABASE_SERVICE_ROLE_KEY` server-side. The anon key is never used server-side.

---

## 🔒 Environment Variables Reference

Copy `.env.example` to `.env` and fill in all values before running the project.

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | ✅ | Your Supabase project URL (e.g. `https://xxxx.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Supabase anon/public API key — safe to expose in browser |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key — **server-side only, never expose to browser** |
| `SMTP_HOST` | ✅ | SMTP server hostname (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | ✅ | SMTP port — use `587` for TLS / STARTTLS |
| `SMTP_USER` | ✅ | Gmail address used for sending emails |
| `SMTP_PASS` | ✅ | Gmail **App Password** (not your account password — [generate here](https://support.google.com/accounts/answer/185833)) |
| `VITE_CHAIRMAN_EMAIL` | ✅ | Email address of the Chairman Supabase Auth user |

> ⚠️ The `.env` file is in `.gitignore` — it will never be committed. Only `.env.example` is tracked.

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following:

- **Node.js 18+** — [Download](https://nodejs.org/). Verify with `node -v`.
- **npm 9+** — Bundled with Node.js. Verify with `npm -v`.
- A **[Supabase](https://supabase.com)** account with a new project created (free tier works).
- A **Gmail account** with **[App Password](https://support.google.com/accounts/answer/185833)** enabled for sending emails via SMTP.
- face-api.js model weights (see Step 6 below).

---

### 1. Clone the Repository

```bash
git clone https://github.com/Bhanu99517/pss-trust-original.git
cd pss-trust-original
```

---

### 2. Install Dependencies

```bash
npm install
```

This installs all production and development dependencies listed in `package.json`.

---

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password

VITE_CHAIRMAN_EMAIL=chairman-email@gmail.com
```

**Where to find Supabase keys:**
1. Go to [supabase.com](https://supabase.com) → Your Project → **Project Settings** → **API**
2. Copy **Project URL** → `VITE_SUPABASE_URL`
3. Copy **anon / public** key → `VITE_SUPABASE_ANON_KEY`
4. Copy **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

---

### 4. Set Up the Database

1. In **Supabase Dashboard** → **SQL Editor**, click **New Query**
2. Open `reset_supabase.sql` from the repo root, paste its entire contents, and click **Run**

This script:
- Creates all required tables (`students`, `attendance`, `attendance_faces`, `applications`, `branches`, `incharges`, `otp_codes`)
- Enables Row Level Security (RLS) on all tables
- Creates RLS policies for each role
- Seeds the five default branches: **BHEL, Bollaram, MYP, MKR, ECIL**

> If you have a previously configured project and only need incremental changes, run `supabase_setup.sql` instead.

**Supabase Storage Buckets:**

Create the following storage buckets in **Supabase → Storage → New Bucket**:

| Bucket Name | Public? | Purpose |
|---|---|---|
| `student-photos` | Yes | Student profile photos |
| `application-documents` | Yes | Fee application uploaded documents |
| `face-photos` | No | Face registration source images |

---

### 5. Create the Chairman User

1. In **Supabase Dashboard** → **Authentication** → **Users** → **Add User**
2. Set **Email** to the value you put in `VITE_CHAIRMAN_EMAIL`
3. Set a **Password** of your choice
4. The system will automatically recognise this email as the Chairman

---

### 6. Download face-api.js Model Weights

The face recognition models must be present in `public/models/`. These are **not included in the repository** due to their file size.

Download the required weights from the official face-api.js repository:

```bash
# From the project root
mkdir -p public/models

# Download SSD MobileNet v1 (face detection)
curl -L https://github.com/justadudewhohacks/face-api.js/raw/master/weights/ssd_mobilenetv1_model-weights_manifest.json \
  -o public/models/ssd_mobilenetv1_model-weights_manifest.json

curl -L https://github.com/justadudewhohacks/face-api.js/raw/master/weights/ssd_mobilenetv1_model-shard1 \
  -o public/models/ssd_mobilenetv1_model-shard1

# Download Face Landmark 68 model
curl -L https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_landmark_68_model-weights_manifest.json \
  -o public/models/face_landmark_68_model-weights_manifest.json

curl -L https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_landmark_68_model-shard1 \
  -o public/models/face_landmark_68_model-shard1

# Download Face Recognition model
curl -L https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_recognition_model-weights_manifest.json \
  -o public/models/face_recognition_model-weights_manifest.json

curl -L https://github.com/justadudewhohacks/face-api.js/raw/master/weights/face_recognition_model-shard1 \
  -o public/models/face_recognition_model-shard1
```

Or download them directly from: https://github.com/justadudewhohacks/face-api.js/tree/master/weights

> ⚠️ Without these files, face registration and attendance marking will fail silently.

---

### 7. Start the Development Server

```bash
npm run dev
```

Open **http://localhost:3000** 🎉

The dev server runs Express (`server.ts`) which proxies API requests and serves the Vite dev server with Hot Module Replacement (HMR).

---

## 📜 Available Scripts

| Script | Command | Description |
|---|---|---|
| **Dev server** | `npm run dev` | Start Express + Vite dev server with HMR on port 3000 |
| **Build** | `npm run build` | Compile TypeScript and bundle for production via Vite |
| **Preview** | `npm run preview` | Serve the production `dist/` build locally |
| **Type check** | `npm run lint` | Run `tsc --noEmit` — TypeScript type validation only |
| **ESLint** | `npm run eslint` | Run ESLint on all files in `src/` |
| **Format** | `npm run format` | Format all files with Prettier (writes changes) |
| **Format check** | `npm run format:check` | Check formatting without writing changes (used in CI) |
| **Clean** | `npm run clean` | Remove the `dist/` directory |

---

## 🌐 Deployment (Vercel)

This project is **pre-configured for Vercel** via `vercel.json`. The configuration handles:

- **Build:** `vite build` outputs to `dist/`
- **API routes:** `api/*.ts` files are deployed as serverless functions
- **SPA routing:** All non-API requests are rewritten to `index.html` for React Router
- **PWA assets:** `.well-known/` paths are served with correct CORS headers

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (follow prompts for first-time setup)
vercel
```

Or connect your GitHub repository directly in the [Vercel Dashboard](https://vercel.com/dashboard) for automatic deployments on every push to `main`.

### Vercel Environment Variables

Add all variables from `.env.example` in:
**Vercel Dashboard → Project → Settings → Environment Variables**

> ⚠️ Do NOT prefix `SUPABASE_SERVICE_ROLE_KEY` with `VITE_` — this keeps it server-side only.

Live deployment: **https://pss-trust.vercel.app**

---

## 📲 PWA Installation

PSS Trust is a fully installable **Progressive Web App (PWA)** powered by `vite-plugin-pwa`.

### On Mobile (Android / iOS)
1. Open https://pss-trust.vercel.app in Chrome (Android) or Safari (iOS)
2. Tap the browser menu → **"Add to Home Screen"**
3. The app icon appears on your home screen and opens like a native app

### On Desktop (Chrome / Edge)
1. Open the site
2. Click the **install icon (⊕)** in the browser address bar
3. Click **Install** in the prompt

### Offline Support
Once installed, the service worker pre-caches all UI assets and static files. The app loads instantly even without a network connection. Dynamic data (attendance, applications) requires connectivity.

---

## 🗺️ User Flows

### Student — New Registration

```
Home → Signup → Enter invite code → Verify email OTP
    → Fill profile (name, email, phone, Aadhar, course, branch, SSC %)
    → Upload photo → Submit → Receive Student ID by email
```

### Student — Mark Attendance

```
Home → Attendance → Enter Student ID
    → Camera opens → face-api.js detects & matches face
    → Attendance marked → Confirmation shown
```

### Student — Fee Application

```
Home → Fee Application → Enter Student ID → Fill academic details
    → Upload fee receipt document → Submit
    → Track status via "Check Status" using Student ID
```

### Admin — Login (all roles)

```
/admin → Enter email + password → Receive OTP email
       → Enter 6-digit OTP → Redirect to role dashboard
```

### Chairman — Approve Application

```
Chairman Dashboard → View all pending applications
    → Review student details + documents
    → Add comment → Approve / Reject
    → Student receives email notification
```

---

## 🔐 Security

### Security Best Practices in This Project

- **`SUPABASE_SERVICE_ROLE_KEY`** is only used server-side in API functions and is never prefixed with `VITE_`, keeping it out of the browser bundle.
- **Row Level Security (RLS)** is enabled on all Supabase tables. Each role can only see and modify data it is permitted to.
- **OTP verification** is required for all admin logins and student signups. OTPs expire after 10 minutes.
- **Invite codes** prevent unauthorized student registrations.
- **Face descriptors** (128-float arrays) are stored instead of raw face images wherever possible.
- The `.env` file is in `.gitignore` and the example template contains only placeholder values.

### Reporting Vulnerabilities

If you discover a security vulnerability, **please do not open a public GitHub issue**. Instead, read the [Security Policy](./SECURITY.md) and report privately. We take all reports seriously and aim to respond within 48 hours.

---

## 🗺️ Planned Features

- [ ] PDF download for approved fee receipts
- [ ] Multi-language support (Telugu, Hindi, English)
- [ ] Student dashboard with application analytics
- [ ] Email reminders for applications pending >7 days
- [ ] Admin mobile app (React Native)
- [ ] Bulk student import via CSV
- [ ] Audit log for all admin actions

---

## 🤝 Contributing

Contributions are welcome and appreciated! Please read the full [Contributing Guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md) before opening a PR.

### Quick Contribution Steps

1. **Fork** the repository
2. **Create** your feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make changes** and commit using [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m 'feat: add your feature description'
   ```
4. **Push** to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** against `main` using the PR template

### Commit Message Convention

| Prefix | Use for |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation change |
| `style:` | Formatting / whitespace |
| `refactor:` | Code restructure without feature change |
| `test:` | Adding or fixing tests |
| `chore:` | Build system or CI changes |

### CI Checks

All pull requests must pass:
- `npm run lint` — TypeScript type check
- `npm run eslint` — ESLint
- `npm run format:check` — Prettier formatting
- `npm run build` — Production build

---

## 👥 Contributors

| Contributor | Role |
|---|---|
| **[G Bhanu Prakash](https://github.com/Bhanu99517)** | frontend and Backend Development / Maintainer |
| **[Praveen7343](https://github.com/Praveen7343)** | Partner — frontend pages design and Face Recognition |

Want to be listed here? Contribute and open a PR! 🙌

---

## 💖 Support

If this project helped you or you'd like to support the cause of empowering underprivileged students:

- ☕ [Buy Me a Coffee](https://buymeacoffee.com/bhanu99517)
- 🍵 [Ko-fi](https://ko-fi.com/bhanu99517)
- ⭐ Star this repository — it helps more people discover the project!

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for full details.

```
MIT License

Copyright (c) 2024 G Bhanu Prakash

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

<div align="center">

Made with ❤️ for **PSS Trust** — *Empowering Students Since 2003*

[🌐 Live Demo](https://pss-trust.vercel.app) · [📧 Contact](https://pss-trust.vercel.app/contact-us) · [⭐ Star on GitHub](https://github.com/Bhanu99517/pss-trust-web)

</div>
