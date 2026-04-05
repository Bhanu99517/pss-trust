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

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  await supabase.from('otp_codes').delete().eq('email', email);
  const { error: otpError } = await supabase
    .from('otp_codes')
    .insert({ email, code: otp, expires_at: expiresAt });

  if (otpError) {
    console.error('OTP insert error:', otpError);
    return res.status(500).json({ error: 'Failed to generate OTP. Please try again.' });
  }
  await supabase.from('otp_codes').insert({ email, code: otp, expires_at: expiresAt });

  try {
    await transporter.sendMail({
      from: `"PSS Trust" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Login OTP - PSS Trust',
      html: `
        <div style="font-family:sans-serif;padding:20px;">
          <h2>Your OTP Code</h2>
          <div style="font-size:32px;font-weight:bold;letter-spacing:4px;color:#059669;">${otp}</div>
          <p>This code expires in 5 minutes.</p>
        </div>
      `
    });
  } catch (err) {
    console.error('Email error:', err);
  }

  return res.json({ success: true });
}