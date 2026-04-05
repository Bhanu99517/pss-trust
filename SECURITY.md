# 🔒 Security Policy

## Supported Versions

The following versions of the PSS Trust Student Management Portal are currently supported with security updates:

| Version | Supported |
|---|---|
| Latest (`main` branch) | ✅ Actively supported |
| Older branches | ❌ Not supported |

Always make sure you are running the latest version from the `main` branch for the most up-to-date security patches.

---

## 🛡️ Reporting a Vulnerability

We take security seriously — especially since this portal handles sensitive student data, face recognition records, and fee applications for underprivileged students.

**Please do NOT report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability, please report it responsibly by contacting the maintainer directly:

👉 **GitHub:** [@Bhanu99517](https://github.com/Bhanu99517)

### What to include in your report:

- **Description** of the vulnerability and its potential impact
- **Steps to reproduce** the issue
- **Affected component** (e.g., authentication, face recognition, fee application, database)
- **Possible fix** if you have one in mind
- **Your contact details** (optional, but helpful for follow-up)

---

## ⏱️ Response Timeline

| Stage | Timeframe |
|---|---|
| Initial acknowledgement | Within **48 hours** |
| Vulnerability assessment | Within **5 business days** |
| Fix development & testing | Within **14 days** (critical issues prioritized) |
| Public disclosure | After fix is deployed |

We will keep you informed throughout the process and credit you in the release notes (unless you prefer to remain anonymous).

---

## 🔐 Security Best Practices for Deployers

If you are self-hosting or forking this project, please follow these guidelines:

### Environment Variables
- Never commit your `.env` file — it is listed in `.gitignore`
- Use strong, unique passwords for your Supabase and Gmail accounts
- Rotate your `VITE_SUPABASE_ANON_KEY` and Gmail App Password periodically
- Use environment variable managers (e.g., Vercel's built-in secrets manager) in production

### Supabase
- Enable **Row Level Security (RLS)** on all tables — especially `students`, `applications`, and `attendance_faces`
- Restrict public access to storage buckets containing face photos and documents
- Use Supabase Auth for all authenticated routes — never bypass it
- Regularly review your Supabase Auth logs for suspicious login attempts

### Face Recognition Data
- Face descriptors stored in `attendance_faces` are sensitive biometric data
- Ensure only authenticated students can register or update their own face data
- Do not expose face descriptor data through public API endpoints

### Gmail SMTP
- Use a **Gmail App Password** — never use your main Gmail password
- Consider using a dedicated Gmail account for the application (not your personal one)

### Deployment (Vercel)
- Add all environment variables via **Vercel's dashboard** — never hardcode them
- Enable **HTTPS only** (Vercel does this by default)
- Review Vercel's deployment logs periodically for anomalies

---

## 🚨 Known Security Considerations

| Area | Current Status | Recommendation |
|---|---|---|
| Supabase RLS | Depends on setup | Enable RLS on all tables |
| Face data storage | Stored as descriptors | Restrict bucket access in Supabase |
| Email credentials | Via `.env` | Use App Password, never plain password |
| File uploads (Multer) | Validated server-side | Keep file type/size restrictions in place |
| Auth tokens | Managed by Supabase | Do not store tokens in localStorage manually |

---

## 🙏 Responsible Disclosure

We appreciate the security research community and responsible disclosure. Researchers who report valid vulnerabilities will be:

- Acknowledged in the project's `CHANGELOG.md`
- Credited in the relevant release notes
- Thanked publicly (with their permission)

We kindly ask that you:

- Give us reasonable time to fix the issue before any public disclosure
- Do not access, modify, or delete any student data during testing
- Do not perform denial-of-service attacks

---

<div align="center">

**Protecting student data is our responsibility. Thank you for helping us do that.** 💙

**PSS Trust — Empowering Students Since 2003**

</div>
