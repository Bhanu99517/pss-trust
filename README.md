<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/974e4549-30b9-4cce-9a10-4ea107da6b4f.png" />

# 🎓 PSS Trust — Student Management Portal

### POTUKUCHI SOMASUNDARA SOCIAL WELFARE AND CHARITABLE TRUST
**Reg No: 95/2003 · Est. August 15, 2003**

*Digitizing welfare for students from Below Poverty Line families*

---

![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38BDF8?logo=tailwindcss&logoColor=white)
![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel&logoColor=white)
![CI](https://github.com/Bhanu99517/pss-trust--5-/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/License-MIT-green)

**[🌐 Live Demo](https://pss-trust-5.vercel.app)** · **[🐛 Report Bug](https://github.com/Bhanu99517/pss-trust--5-/issues/new?template=bug_report.md)** · **[✨ Request Feature](https://github.com/Bhanu99517/pss-trust--5-/issues/new?template=feature_request.md)**

</div>

---

## 📖 About

**PSS Trust** is a registered NGO dedicated to breaking financial barriers for underprivileged students. This full-stack portal replaces manual paperwork with a seamless digital workflow — from student registration and face-based attendance to fee applications and chairman approvals.

> Built with ❤️ to empower students who deserve a fair chance at education.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧑‍🎓 **Student Registration** | Full signup with SSC details, course info (Diploma / B.Tech), and branch selection |
| 🤖 **Face Recognition Attendance** | Register your face once, mark attendance daily using `face-api.js` with real-time detection |
| 📄 **Fee Application System** | Submit fee requests with academic records and document uploads |
| 🏛️ **Chairman Dashboard** | Approve/reject applications, view attendance logs, manage all students |
| 🔍 **Application Status Tracker** | Students can check their fee application status in real time |
| 📊 **Attendance Reports** | View personal attendance history with dates and methods |
| 📧 **Email Notifications** | Automated approval/rejection emails via Nodemailer (Gmail SMTP) |
| 🔑 **OTP Security** | Two-step password change with OTP verification via email |
| 🔒 **Secure Auth** | Supabase Auth for both student and chairman roles |
| 🖼️ **Gallery & Success Stories** | Showcase trust events and student success stories |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript 5.8, Vite 6.2 |
| **Styling** | Tailwind CSS 4.1, Framer Motion (via `motion`) |
| **Backend** | Express.js, Node.js (served via `tsx`) |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Storage** | Supabase Storage (face photos, documents) |
| **Face Recognition** | face-api.js (SSD MobileNet v1) |
| **Email** | Nodemailer with Gmail SMTP |
| **File Uploads** | Multer |
| **Routing** | React Router DOM v7 |
| **Icons** | Lucide React |
| **CI/CD** | GitHub Actions |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
pss-trust--5-/
├── .github/
│   ├── workflows/
│   │   └── ci.yml                  # GitHub Actions CI pipeline
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md           # Bug report template
│   │   └── feature_request.md      # Feature request template
│   └── pull_request_template.md    # PR checklist template
├── public/
│   └── models/                     # face-api.js model weights (local)
├── src/
│   ├── components/
│   │   ├── Attendance.tsx          # Face verification & mark attendance
│   │   ├── ChairmanDashboard.tsx   # Admin panel for approvals
│   │   ├── ChairmanLogin.tsx       # Chairman authentication
│   │   ├── ChangePassword.tsx      # OTP-based password update
│   │   ├── CheckStatus.tsx         # Application status tracker
│   │   ├── FaceRegistration.tsx    # Register face for attendance
│   │   ├── FeeApplication.tsx      # Submit fee requests
│   │   ├── Gallery.tsx             # Trust events gallery
│   │   ├── Signup.tsx              # Student registration
│   │   ├── StudentAttendance.tsx   # Personal attendance report
│   │   └── SuccessStories.tsx      # Student success stories
│   ├── App.tsx                     # Main app & routing logic
│   ├── supabaseClient.ts           # Supabase client initialization
│   ├── index.css                   # Global styles
│   └── main.tsx                    # App entry point
├── api/                            # Vercel serverless API functions
├── server.ts                       # Express backend + Vite middleware
├── reset_supabase.sql              # Full database schema
├── supabase_setup.sql              # Additional migrations
├── supabase-blueprint.json         # Supabase project blueprint
├── eslint.config.js                # ESLint configuration
├── .prettierrc                     # Prettier formatting rules
├── .env.example                    # Environment variable template
├── LICENSE                         # MIT License
├── CONTRIBUTING.md                 # Contribution guidelines
├── SECURITY.md                     # Security & vulnerability policy
├── CHANGELOG.md                    # Version history
├── CODE_OF_CONDUCT.md              # Community standards
├── vite.config.ts
├── tsconfig.json
├── vercel.json
└── package.json
```

---

## 🗄️ Database Schema

| Table | Description |
|---|---|
| `students` | Student profiles with academic details and course info |
| `attendance` | Daily attendance records with timestamps and method |
| `attendance_faces` | Stored face descriptors for recognition (unique per student) |
| `applications` | Fee application submissions with approval status |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- A [Supabase](https://supabase.com) project (free tier works)
- A **Gmail account** with an [App Password](https://support.google.com/accounts/answer/185833) enabled

---

### 1. Clone the repository

```bash
git clone https://github.com/Bhanu99517/pss-trust--5-.git
cd pss-trust--5-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
```

### 4. Set up the database

Open your **Supabase SQL Editor** and run:

```bash
# Copy and paste reset_supabase.sql into Supabase SQL Editor
```

Then run these additional migrations:

```sql
ALTER TABLE students ADD COLUMN IF NOT EXISTS photo_url TEXT;

ALTER TABLE attendance
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS method TEXT DEFAULT 'face_recognition';

ALTER TABLE attendance_faces
  ADD CONSTRAINT attendance_faces_student_id_unique UNIQUE (student_id);
```

### 5. Create the Chairman user

In **Supabase → Authentication → Users → Add User**:
- **Email:** your chairman email (must match `chairmanEmail` in `src/App.tsx`)
- **Password:** your choice

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📜 Scripts

```bash
npm run dev            # Start dev server (Express + Vite)
npm run build          # Build for production
npm run preview        # Preview the production build locally
npm run lint           # TypeScript type check (tsc --noEmit)
npm run eslint         # Run ESLint on src/
npm run format         # Format code with Prettier
npm run format:check   # Check formatting without writing
npm run clean          # Remove the dist/ directory
```

---

## 🔒 Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Supabase anon/public API key |
| `SMTP_HOST` | ✅ | SMTP server (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | ✅ | SMTP port (usually `587`) |
| `SMTP_USER` | ✅ | Gmail address used for sending emails |
| `SMTP_PASS` | ✅ | Gmail App Password (not your login password) |

---

## 🌐 Deployment (Vercel)

This project is pre-configured for Vercel with `vercel.json`.

```bash
npm install -g vercel
vercel
```

> ⚠️ Add all environment variables in **Vercel → Project Settings → Environment Variables**.

Live at: **[https://pss-trust-5.vercel.app](https://pss-trust-5.vercel.app)**

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) first.

1. Fork the repository
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m 'feat: add some feature'`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 🔐 Security

If you discover a security vulnerability, please read our [Security Policy](SECURITY.md) and report it responsibly — **do not** open a public issue.

---

## 👥 Contributors

| Contributor | Role |
|---|---|
| **[G Bhanu Prakash](https://github.com/Bhanu99517)** | Creator & Maintainer |
| **[Praveen7343](https://github.com/Praveen7343)** | Contributor — Gallery & Success Stories |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ for **PSS Trust** — *Empowering Students Since 2003*

</div>
