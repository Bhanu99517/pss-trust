import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password, fullName, branch } = req.body;

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email, password, email_confirm: true,
    user_metadata: { full_name: fullName, role: 'incharge', branch }
  });

  if (authError) return res.status(500).json({ success: false, error: authError.message });

  const { error: dbError } = await supabaseAdmin
    .from('incharges')
    .insert([{ id: authData.user.id, email, full_name: fullName, branch }]);

  if (dbError) return res.status(500).json({ success: false, error: dbError.message });

  return res.json({ success: true });
}