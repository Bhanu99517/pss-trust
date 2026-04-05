-- Run this SQL in your Supabase SQL Editor to create the necessary table for OTP verification

CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_otp_codes_email_code ON otp_codes(email, code);

-- Enable RLS (Row Level Security)
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- Allow the API (using anon key) to manage OTP codes
-- Note: In production, you should use a service role key for backend operations.
CREATE POLICY "Allow public insert" ON otp_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON otp_codes FOR SELECT USING (true);
CREATE POLICY "Allow public delete" ON otp_codes FOR DELETE USING (true);
