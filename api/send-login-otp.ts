import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  // Check SMTP is configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('SMTP not configured');
    return res.status(500).json({ error: 'Email service not configured on server.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  // Delete old OTP and insert fresh one
  await supabase.from('otp_codes').delete().eq('email', email);
  const { error: otpError } = await supabase
    .from('otp_codes')
    .insert({ email, code: otp, expires_at: expiresAt });

  if (otpError) {
    console.error('OTP insert error:', otpError);
    return res.status(500).json({ error: 'Failed to generate OTP. Please try again.' });
  }

  // Send email
  try {
    await transporter.sendMail({
      from: `"PSS Trust" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Login OTP - PSS Trust',
      html: `
        <div style="font-family:sans-serif;padding:20px;max-width:500px;margin:0 auto;border:1px solid #eee;border-radius:10px;">
          <h2 style="color:#0f172a;">PSS Trust Login</h2>
          <p>Your OTP verification code is:</p>
          <div style="font-size:36px;font-weight:bold;letter-spacing:6px;color:#059669;background:#f0fdf4;padding:20px;border-radius:8px;text-align:center;margin:20px 0;">${otp}</div>
          <p style="color:#64748b;font-size:14px;">This code expires in <strong>5 minutes</strong>. Do not share it with anyone.</p>
        </div>
      `
    });
  } catch (err) {
    console.error('Email send error:', err);
    // OTP is saved in DB, but email failed
    return res.status(500).json({ error: 'OTP generated but email failed to send. Check SMTP settings.' });
  }

  return res.json({ success: true });
}