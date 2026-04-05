import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });

  const { data: stored, error } = await supabase
    .from('otp_codes').select('*').eq('email', email).single();

  if (error || !stored) return res.status(400).json({ error: 'No OTP found' });

  if (new Date() > new Date(stored.expires_at)) {
    await supabase.from('otp_codes').delete().eq('email', email);
    return res.status(400).json({ error: 'OTP expired' });
  }

  if (stored.code === otp) {
    await supabase.from('otp_codes').delete().eq('email', email);
    return res.json({ success: true });
  }

  return res.status(400).json({ error: 'Invalid OTP' });
}