import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!
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

  // Check SMTP first before doing anything else
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return res.status(500).json({ error: 'Email service is not configured. Please set SMTP_USER and SMTP_PASS.' });
  }

  // Check if student already exists
  const { data: existingStudent } = await supabase
    .from('students')
    .select('id')
    .eq('email', email)
    .single();

  if (existingStudent) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  // Delete any existing OTP for this email, then insert fresh
  try {
    await supabase.from('otp_codes').delete().eq('email', email);

    const { error: otpError } = await supabase
      .from('otp_codes')
      .insert({ email, code: otp, expires_at: expiresAt });

    if (otpError) {
      console.error('Supabase OTP error:', otpError);
      return res.status(500).json({ error: 'Failed to save verification code. Please check if otp_codes table exists in Supabase.' });
    }
  } catch (err) {
    console.error('Supabase error:', err);
    return res.status(500).json({ error: 'Failed to save verification code.' });
  }

  // Verify SMTP connection
  try {
    await transporter.verify();
  } catch (err) {
    console.error('Transporter verify error:', err);
    return res.status(500).json({ error: 'Email service is not responding. Please check your SMTP credentials.' });
  }

  // Send the email
  try {
    await transporter.sendMail({
      from: `"PSS Trust" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Verify your email - PSS Trust Registration',
      html: `
        <div style="font-family:sans-serif;padding:20px;max-width:600px;margin:0 auto;border:1px solid #eee;border-radius:10px;">
          <h2 style="color:#0f172a;text-align:center;">Email Verification</h2>
          <p style="color:#475569;font-size:16px;line-height:1.6;">Thank you for registering with PSS Trust. Please use the following code to verify your email address:</p>
          <div style="background:#f8fafc;padding:20px;border-radius:8px;text-align:center;margin:30px 0;">
            <span style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#059669;">${otp}</span>
          </div>
          <p style="color:#64748b;font-size:14px;text-align:center;">This code will expire in 10 minutes.</p>
          <hr style="border:0;border-top:1px solid #eee;margin:30px 0;" />
          <p style="color:#94a3b8;font-size:12px;text-align:center;">If you didn't request this, please ignore this email.</p>
        </div>
      `
    });
    return res.json({ success: true });
  } catch (err) {
    console.error('Email error:', err);
    return res.status(500).json({ error: 'Failed to send verification email.' });
  }
}