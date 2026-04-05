# 🤝 Contributing to PSS Trust — Student Management Portal

Thank you for your interest in contributing to the PSS Trust portal! This project exists to serve underprivileged students, and every contribution — big or small — makes a real difference. 🎓

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Project Structure](#project-structure)
- [Need Help?](#need-help)

---

## 📜 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Please:

- Be kind and constructive in all communications
- Respect differing opinions and experiences
- Focus on what is best for the students and community this project serves
- Report any unacceptable behavior to the maintainer

---

## 🚀 Getting Started

Before contributing, make sure you can run the project locally:

1. **Fork** the repository by clicking the "Fork" button on GitHub
2. **Clone** your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/pss-trust--5-.git
   cd pss-trust--5-
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Set up environment variables** (see `.env.example`):
   ```bash
   cp .env.example .env
   # Fill in your Supabase and SMTP credentials
   ```
5. **Run the development server:**
   ```bash
   npm run dev
   ```

> See the full setup guide in [README.md](./README.md) for database setup and chairman user creation.

---

## 💡 How to Contribute

There are many ways you can help:

| Type | Examples |
|---|---|
| 🐛 **Bug fixes** | Fix broken face recognition, form validation errors, routing issues |
| ✨ **New features** | Analytics dashboard, PDF fee receipts, multi-language support |
| 🎨 **UI/UX improvements** | Better mobile responsiveness, accessibility, animations |
| 📖 **Documentation** | Improve README, add code comments, write tutorials |
| 🔒 **Security** | Identify vulnerabilities, improve auth flows, data protection |
| ⚡ **Performance** | Optimize queries, reduce bundle size, lazy loading |
| 🧪 **Testing** | Add unit tests, integration tests, E2E coverage |

---

## 🐛 Reporting Bugs

Found a bug? Please [open an issue](https://github.com/Bhanu99517/pss-trust--5-/issues/new) and include:

- **A clear title** describing the problem
- **Steps to reproduce** the bug
- **Expected behavior** vs what actually happened
- **Screenshots or screen recordings** if applicable
- **Your environment** (browser, OS, Node.js version)

```markdown
## Bug Report

**Describe the bug:**
A clear description of what the bug is.

**Steps to reproduce:**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior:**
What you expected to happen.

**Screenshots:**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Node.js: [e.g. 18.17.0]
```

---

## 💬 Suggesting Features

Have an idea? [Open a feature request](https://github.com/Bhanu99517/pss-trust--5-/issues/new) and include:

- **What problem does it solve?** (especially for students or the chairman)
- **Describe the feature** in as much detail as possible
- **Any alternatives** you've considered
- **Mockups or examples** if you have them

---

## 🔄 Pull Request Process

1. **Create a branch** from `main` with a descriptive name:
   ```bash
   git checkout -b feature/pdf-fee-receipt
   # or
   git checkout -b fix/face-registration-crash
   ```

2. **Make your changes** — keep commits small and focused:
   ```bash
   git add .
   git commit -m "feat: add PDF download for approved fee receipts"
   ```

3. **Follow commit message conventions:**

   | Prefix | Use for |
   |---|---|
   | `feat:` | A new feature |
   | `fix:` | A bug fix |
   | `docs:` | Documentation changes |
   | `style:` | Formatting, no logic change |
   | `refactor:` | Code restructure, no feature change |
   | `perf:` | Performance improvements |
   | `chore:` | Build process, dependencies |

4. **Run the type checker** before pushing:
   ```bash
   npm run lint
   ```

5. **Push your branch** and open a Pull Request:
   ```bash
   git push origin feature/pdf-fee-receipt
   ```

6. In your **Pull Request description**, include:
   - What changes you made and why
   - Screenshots for any UI changes
   - Any related issue numbers (e.g. `Closes #12`)

7. Wait for review — the maintainer will respond as soon as possible.

---

## 🧹 Coding Standards

Please follow these guidelines to keep the codebase consistent:

**TypeScript**
- Always type your props, state, and function return values
- Avoid using `any` — use proper types or generics
- Run `npm run lint` and fix all TypeScript errors before submitting

**React**
- Use functional components with hooks only
- Keep components small and focused on a single responsibility
- Name component files in `PascalCase.tsx`

**Styling**
- Use Tailwind CSS utility classes
- Avoid inline styles unless absolutely necessary
- Keep mobile responsiveness in mind for all UI changes

**General**
- Write self-documenting code with clear variable and function names
- Add comments for complex logic
- Don't commit `.env` files or secrets — ever

---

## 📁 Project Structure

Key areas to be aware of when contributing:

```
src/components/     → All React UI components
server.ts           → Express backend (email, file uploads)
reset_supabase.sql  → Full database schema
api/                → Vercel serverless functions
public/models/      → face-api.js model weights (do not modify)
```

---

## 🙋 Need Help?

If you're stuck or have questions:

- Open a [GitHub Discussion](https://github.com/Bhanu99517/pss-trust--5-/issues)
- Reach out to the maintainer: **[@Bhanu99517](https://github.com/Bhanu99517)**

---

<div align="center">

Thank you for helping empower students through technology. 💙

**PSS Trust — Empowering Students Since 2003**

</div>
