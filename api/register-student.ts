import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

// Use SERVICE ROLE KEY — bypasses all rate limits
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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

  const { formData } = req.body;
  if (!formData) return res.status(400).json({ error: 'formData is required' });

  try {
    // 1. Create auth user using admin API (no rate limit)
    const defaultPassword = `PSS@${formData.mobileNumber}`;
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: formData.email,
      password: defaultPassword,
      email_confirm: true, // auto-confirm email, no verification needed
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error('Signup failed - no user data returned');

    // 2. Validate branch and year before generating Trust ID
    if (!formData.trustBranch || formData.trustBranch.trim() === '') {
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new Error('Trust Branch is required. Please select a branch.');
    }
    if (!formData.yearOfJoining || formData.yearOfJoining.toString().trim() === '') {
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new Error('Year of Joining is required.');
    }

    // 3. Generate Trust ID (Year-Branch-Serial)
    const year = parseInt(formData.yearOfJoining?.toString());
    const branch = formData.trustBranch.trim();

    const { count } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('trust_branch', branch)
      .eq('year_of_joining', year);

    const serial = ((count || 0) + 1).toString().padStart(3, '0');
    const generatedTrustId = `${year}-${branch}-${serial}`;

    // 4. Insert student record
    const { error: dbError } = await supabase
      .from('students')
      .insert([{
        id: authData.user.id,
        full_name: formData.fullName,
        father_name: formData.fatherName,
        mother_name: formData.motherName,
        dob: formData.dob,
        gender: formData.gender,
        mobile_number: formData.mobileNumber,
        father_mobile: formData.fatherMobile || null,
        mother_mobile: formData.motherMobile || null,
        email: formData.email,
        address: formData.address,
        trust_branch: formData.trustBranch,
        trust_id: generatedTrustId,
        ssc_school: formData.sscSchool,
        ssc_board: formData.sscBoard,
        ssc_year: formData.sscYear,
        ssc_percentage: parseFloat(formData.sscPercentage) || null,
        course_type: formData.courseType,
        college_name: formData.collegeName,
        branch: formData.branch,
        year_of_joining: formData.yearOfJoining,
        pin_number: formData.pinNumber,
        diploma_percentage: parseFloat(formData.diplomaPercentage) || null,
        btech_college: formData.btechCollege,
        btech_year: formData.btechYear,
        btech_branch: formData.btechBranch,
        btech_pin: formData.btechPin,
      }]);

    if (dbError) {
    // 5. Rollback: delete the auth user if DB insert fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new Error('Failed to save student profile: ' + dbError.message);
    }

    // 6. Send welcome email with Student ID
    try {
      await transporter.sendMail({
        from: `"PSS Trust" <${process.env.SMTP_USER}>`,
        to: formData.email,
        subject: 'Welcome to PSS Trust — Your Student ID',
        html: `
          <div style="font-family:sans-serif;padding:20px;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;">
            <div style="background:#0f172a;padding:24px;border-radius:8px 8px 0 0;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;letter-spacing:0.5px;">PSS Trust Student Portal</h1>
              <p style="color:#94a3b8;margin:6px 0 0;font-size:13px;">Potukuchi Somasundara Social Welfare & Charitable Trust</p>
            </div>
            <div style="padding:32px 24px;">
              <p style="color:#1e293b;font-size:16px;margin-top:0;">Dear <strong>${formData.fullName}</strong>,</p>
              <p style="color:#475569;font-size:15px;line-height:1.6;">
                Congratulations! Your registration with PSS Trust has been completed successfully.
                Please save your <strong>Student ID</strong> — you will need it for attendance, fee applications, and checking your status.
              </p>
              <div style="background:#f0fdf4;border:2px solid #86efac;border-radius:10px;padding:24px;text-align:center;margin:28px 0;">
                <p style="color:#166534;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Your Student ID</p>
                <p style="color:#15803d;font-size:32px;font-weight:900;letter-spacing:4px;margin:0;">${generatedTrustId}</p>
              </div>
              <table style="width:100%;border-collapse:collapse;font-size:14px;color:#475569;margin-bottom:24px;">
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:10px 4px;font-weight:600;color:#1e293b;width:40%;">Trust Branch</td>
                  <td style="padding:10px 4px;">${formData.trustBranch}</td>
                </tr>
                <tr style="border-bottom:1px solid #f1f5f9;">
                  <td style="padding:10px 4px;font-weight:600;color:#1e293b;">Course Type</td>
                  <td style="padding:10px 4px;">${formData.courseType === 'btech' ? 'B.Tech' : 'Diploma'}</td>
                </tr>
                <tr>
                  <td style="padding:10px 4px;font-weight:600;color:#1e293b;">Registered Email</td>
                  <td style="padding:10px 4px;">${formData.email}</td>
                </tr>
              </table>
              <div style="background:#fefce8;border-left:4px solid #fbbf24;padding:14px 16px;border-radius:4px;margin-bottom:24px;">
                <p style="margin:0;color:#92400e;font-size:13px;">
                  <strong>Important:</strong> Your default password is <strong>PSS@${formData.mobileNumber}</strong>. Please change it after first login.
                </p>
              </div>
            </div>
            <div style="background:#f8fafc;padding:16px 24px;border-radius:0 0 8px 8px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="color:#94a3b8;font-size:12px;margin:0;">
                © ${new Date().getFullYear()} Potukuchi Somasundara Social Welfare & Charitable Trust
              </p>
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Email send error (non-blocking):', emailErr);
    }

    return res.json({ success: true, userId: authData.user.id, trustId: generatedTrustId });

  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: error.message || 'Registration failed' });
  }
}