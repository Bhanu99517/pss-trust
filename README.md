<div align="center">
<img width="1200" height="475" alt="GHBanner" src="image link" />

# PSS Trust — Student Management Portal

**POTUKUCHI SOMASUNDARA SOCIAL WELFARE AND CHARITABLE TRUST**

A full-stack NGO web application for managing student registrations, fee applications, face-recognition attendance, and chairman approvals.

![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.1-38BDF8?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel)

</div>

---

## 📋 About

PSS Trust (Reg No: 95/2003) is an NGO established on August 15, 2003, dedicated to breaking financial barriers for students from Below Poverty Line families. This portal digitizes their student registration, fee application, and attendance tracking workflows.

---

## ✨ Features

- **Student Registration** — Full signup with SSC details, course info (Diploma/B.Tech), branch selection
- **Face Recognition Attendance** — Register face once, mark attendance daily using face-api.js
- **Fee Application System** — Students submit fee requests with academic records and document uploads
- **Chairman Dashboard** — Approve/reject fee applications, view attendance logs, manage students
- **Check Application Status** — Students can track their fee application status
- **Student Attendance Report** — View personal attendance history
- **Email Notifications** — Automated approval emails via Nodemailer
- **Supabase Auth** — Secure login for students and chairman

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 6 |
| Styling | Tailwind CSS 4, Framer Motion |
| Backend | Express.js, Node.js (via tsx) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage (face photos) |
| Face Recognition | face-api.js |
| Email | Nodemailer (Gmail SMTP) |
| File Uploads | Multer |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- Gmail account with App Password (for email notifications)

### 1. Clone the repository

```bash
git clone https://github.com/Bhanu99517/pss-trust--2-.git
cd pss-trust--2-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
```

### 4. Set up the database

Run the SQL schema in your Supabase SQL Editor:

```bash
# Copy and run the contents of reset_supabase.sql in Supabase SQL Editor
```

Also run these additional migrations:

```sql
ALTER TABLE students ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS method TEXT DEFAULT 'face_recognition';
ALTER TABLE attendance_faces ADD CONSTRAINT attendance_faces_student_id_unique UNIQUE (student_id);
```

### 5. Create Chairman user

In **Supabase → Authentication → Users → Add user**:
- Email: your chairman email (matches `chairmanEmail` in `App.tsx`)
- Password: your choice

### 6. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
pss-trust--2-/
├── public/
│   └── models/          # face-api.js model weights (local)
├── src/
│   ├── components/
│   │   ├── Attendance.tsx          # Face verification & mark attendance
│   │   ├── ChairmanDashboard.tsx   # Admin panel
│   │   ├── ChairmanLogin.tsx       # Chairman auth
│   │   ├── ChangePassword.tsx      # Password update
│   │   ├── CheckStatus.tsx         # Application status checker
│   │   ├── FaceRegistration.tsx    # Register face for attendance
│   │   ├── FeeApplication.tsx      # Submit fee requests
│   │   ├── Signup.tsx              # Student registration
│   │   └── StudentAttendance.tsx   # Attendance report
│   ├── App.tsx                     # Main app & routing
│   ├── supabaseClient.ts           # Supabase client init
│   ├── index.css                   # Global styles
│   └── main.tsx                    # Entry point
├── server.ts                       # Express backend + Vite middleware
├── reset_supabase.sql              # Database schema
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🗄️ Database Schema

| Table | Description |
|---|---|
| `students` | Student profiles with academic details |
| `attendance` | Daily attendance records |
| `attendance_faces` | Face descriptors for recognition |
| `applications` | Fee application submissions |

---

## 🔒 Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SMTP_HOST` | SMTP server (default: smtp.gmail.com) |
| `SMTP_PORT` | SMTP port (default: 587) |
| `SMTP_USER` | Gmail address for sending emails |
| `SMTP_PASS` | Gmail App Password |

---

## 📜 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # TypeScript type check
```

---

## 🌐 Deployment

This project is deployed on **Vercel**. To deploy your own:

```bash
npm install -g vercel
vercel
```

Make sure to add all environment variables in your Vercel project settings.

---

## 👤 Author

**G Bhanu Prakash**  
Electronics & Communication Engineering, Government Polytechnic College Sangareddy  
GitHub: [@Bhanu99517](https://github.com/Bhanu99517)

---

<div align="center">
Made with ❤️ for PSS Trust — Empowering Students Since 2003
</div>
