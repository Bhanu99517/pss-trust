-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop old tables with CASCADE to remove all dependencies
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS attendance_faces CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS attendance_logs CASCADE;
DROP TABLE IF EXISTS student_profiles CASCADE;
DROP TABLE IF EXISTS face_data CASCADE;
DROP TABLE IF EXISTS daily_attendance CASCADE;
DROP TABLE IF EXISTS incharges CASCADE;
DROP TABLE IF EXISTS branches CASCADE;
DROP TABLE IF EXISTS otp_codes CASCADE;

-- Create students table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trust_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    father_name TEXT,
    mother_name TEXT,
    dob DATE NOT NULL,
    gender TEXT,
    mobile_number TEXT NOT NULL,
    email TEXT,
    address TEXT,
    trust_branch TEXT NOT NULL,
    ssc_school TEXT,
    ssc_board TEXT,
    ssc_year INTEGER,
    ssc_percentage NUMERIC,
    course_type TEXT CHECK (course_type IN ('diploma', 'btech')),
    college_name TEXT,
    branch TEXT,
    year_of_joining INTEGER,
    pin_number TEXT,
    diploma_percentage NUMERIC,
    btech_college TEXT,
    btech_year TEXT,
    btech_branch TEXT,
    university_name TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create attendance table
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'present',
    method TEXT DEFAULT 'face_recognition',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, date)
);

-- Create attendance_faces table
CREATE TABLE attendance_faces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    face_descriptor FLOAT8[] NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT attendance_faces_student_id_unique UNIQUE (student_id)
);

-- Storage bucket for faces
INSERT INTO storage.buckets (id, name, public) VALUES ('faces', 'faces', true) ON CONFLICT (id) DO NOTHING;

-- Create applications table for fee requests
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT NOT NULL,
    full_name TEXT NOT NULL,
    college_name TEXT,
    pin_no TEXT,
    phone_no TEXT,
    email TEXT NOT NULL,
    requesting_for TEXT,
    academic_data JSONB,
    academic_records JSONB,
    academic_year TEXT,
    trust_branch TEXT,
    trust_attendance TEXT,
    college_attendance TEXT,
    ceep_rank TEXT,
    ecet_rank TEXT,
    date TEXT,
    contribution TEXT,
    file_url TEXT,
    status TEXT DEFAULT 'pending',
    -- FIX: Added missing comment columns used by InchargeDashboard and SuperInchargeDashboard
    branch_incharge_comment TEXT,
    super_incharge_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_faces ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create basic policies
CREATE POLICY "Allow all access to students" ON students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to attendance" ON attendance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to attendance_faces" ON attendance_faces FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to applications" ON applications FOR ALL USING (true) WITH CHECK (true);

-- Create branches table
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    latitude NUMERIC,
    longitude NUMERIC,
    radius NUMERIC DEFAULT 100, -- Default radius in meters
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to branches" ON branches FOR ALL USING (true) WITH CHECK (true);

-- Insert initial branches
INSERT INTO branches (name) VALUES 
('BHEL'), 
('Bollaram'), 
('MYP'), 
('MKR'), 
('ECIL')
ON CONFLICT (name) DO NOTHING;

-- Create incharges table
-- FIX: Added 'role' column (was missing, but used throughout the app for branch_incharge / super_incharge routing)
CREATE TABLE IF NOT EXISTS incharges (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  branch TEXT,
  role TEXT NOT NULL DEFAULT 'branch_incharge' CHECK (role IN ('branch_incharge', 'super_incharge')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE incharges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to incharges" ON incharges FOR ALL USING (true) WITH CHECK (true);

-- Create OTP codes table
CREATE TABLE otp_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_otp_codes_email_code ON otp_codes(email, code);
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON otp_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON otp_codes FOR SELECT USING (true);
CREATE POLICY "Allow public delete" ON otp_codes FOR DELETE USING (true);

-- Storage buckets for fee documents
INSERT INTO storage.buckets (id, name, public) VALUES ('fee-documents', 'fee-documents', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true) ON CONFLICT (id) DO NOTHING;