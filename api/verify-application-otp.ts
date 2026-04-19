import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

  const { data, error } = await supabase
    .from('otp_codes')
    .select('*')
    .eq('email', email)
    .eq('code', otp)
    .single();

  if (error || !data) {
    return res.status(400).json({ error: 'Invalid OTP. Please try again.' });
  }

  if (new Date(data.expires_at) < new Date()) {
    await supabase.from('otp_codes').delete().eq('email', email);
    return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
  }

  // Clean up used OTP
  await supabase.from('otp_codes').delete().eq('email', email);

  return res.json({ success: true });
}