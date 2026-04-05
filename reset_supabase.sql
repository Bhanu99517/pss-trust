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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);




-- Create attendance table
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'present',
    UNIQUE(student_id, date)
);

-- Create attendance_faces table
CREATE TABLE attendance_faces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    face_descriptor FLOAT8[] NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) - Optional but recommended for Supabase
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_faces ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create basic policies (Allow all for now as per app requirements, but can be hardened)
CREATE POLICY "Allow all access to students" ON students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to attendance" ON attendance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to attendance_faces" ON attendance_faces FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to applications" ON applications FOR ALL USING (true) WITH CHECK (true);

-- Create incharges table
CREATE TABLE IF NOT EXISTS incharges (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  branch TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE incharges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to incharges" ON incharges FOR ALL USING (true) WITH CHECK (true);

-- Create OTP codes table
CREATE TABLE IF NOT EXISTS otp_codes (
  email TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all otp access" ON otp_codes FOR ALL USING (true) WITH CHECK (true);

-- Storage bucket for fee documents
INSERT INTO storage.buckets (id, name, public) VALUES ('fee-documents', 'fee-documents', true) ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true) 
ON CONFLICT (id) DO NOTHING;