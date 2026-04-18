import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import nodemailer from "nodemailer";
import fs from "fs";
import dotenv from "dotenv";
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase Client
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey; // Fallback to anon for now, but service role is needed for auth management
const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// In-memory OTP storage (for demo purposes)
const loginOtps = new Map<string, { code: string, expires: number }>();
const applicationOtps = new Map<string, { code: string, expires: number }>();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // OTP Endpoints for Chairman Login
  app.post("/api/send-login-otp", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "Email is required" });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

      loginOtps.set(email, { code: otp, expires });

      // ALWAYS log to console for the user to see in AI Studio logs
      console.log("------------------------------------------");
      console.log(`CHAIRMAN LOGIN OTP FOR ${email}: ${otp}`);
      console.log("------------------------------------------");

      const isPlaceholder = process.env.SMTP_USER?.includes('your-email') || process.env.SMTP_PASS?.includes('your-gmail');

      if (process.env.SMTP_USER && process.env.SMTP_PASS && !isPlaceholder) {
        try {
          const mailOptions = {
            from: `"PSS Trust" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Chairman Login OTP - PSS Trust",
            text: `Your OTP for Chairman Login is: ${otp}. It will expire in 5 minutes.`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #0f172a;">Chairman Login OTP</h2>
                <p>Your verification code is:</p>
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #059669; margin: 20px 0;">${otp}</div>
                <p>This code will expire in 5 minutes.</p>
                <br/>
                <p>Regards,<br/><strong>PSS Trust Team</strong></p>
              </div>
            `
          };

          await transporter.sendMail(mailOptions);
          console.log(`OTP sent to ${email}`);
        } catch (mailError) {
          console.error("SMTP Error - falling back to console log:", mailError);
          // In development/preview, we fall back to console log if SMTP fails
          // so the user isn't blocked by credential issues.
          console.log(`[FALLBACK OTP] To: ${email}, Code: ${otp}`);
        }
      } else {
        // Mock for dev
        console.log(`[MOCK OTP] To: ${email}, Code: ${otp}`);
      }

      res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  });

  app.post("/api/send-application-otp", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "Email is required" });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

      applicationOtps.set(email, { code: otp, expires });

      console.log("------------------------------------------");
      console.log(`APPLICATION SUBMISSION OTP FOR ${email}: ${otp}`);
      console.log("------------------------------------------");

      const isPlaceholder = process.env.SMTP_USER?.includes('your-email') || process.env.SMTP_PASS?.includes('your-gmail');

      if (process.env.SMTP_USER && process.env.SMTP_PASS && !isPlaceholder) {
        try {
          const mailOptions = {
            from: `"PSS Trust" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Fee Application Verification OTP - PSS Trust",
            text: `Your OTP for Fee Application submission is: ${otp}. It will expire in 10 minutes.`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; color: #333 text-align: center;">
                <h2 style="color: #0f172a;">Application Verification</h2>
                <p>Use the following code to verify your email for fee application:</p>
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #3b82f6; margin: 20px 0;">${otp}</div>
                <p>This code will expire in 10 minutes.</p>
                <br/>
                <p>Regards,<br/><strong>PSS Trust Team</strong></p>
              </div>
            `
          };
          await transporter.sendMail(mailOptions);
        } catch (mailError) {
          console.error("SMTP Error sending application OTP:", mailError);
        }
      }

      res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
      console.error("Error sending application OTP:", error);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  });

  app.post("/api/verify-application-otp", async (req, res) => {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required" });

      const stored = applicationOtps.get(email);
      if (!stored) return res.status(400).json({ error: "No OTP found for this email" });

      if (Date.now() > stored.expires) {
        applicationOtps.delete(email);
        return res.status(400).json({ error: "OTP has expired" });
      }

      if (stored.code === otp) {
        applicationOtps.delete(email);
        res.json({ success: true });
      } else {
        res.status(400).json({ error: "Invalid OTP" });
      }
    } catch (error) {
      console.error("Error verifying application OTP:", error);
      res.status(500).json({ error: "Verification failed" });
    }
  });

  app.post("/api/verify-login-otp", async (req, res) => {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required" });

      const stored = loginOtps.get(email);
      if (!stored) return res.status(400).json({ error: "No OTP found for this email" });

      if (Date.now() > stored.expires) {
        loginOtps.delete(email);
        return res.status(400).json({ error: "OTP has expired" });
      }

      if (stored.code === otp) {
        loginOtps.delete(email);
        res.json({ success: true });
      } else {
        res.status(400).json({ error: "Invalid OTP" });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ error: "Verification failed" });
    }
  });

  // Incharge Management Endpoints
  app.post("/api/create-incharge", async (req, res) => {
    try {
      const { email, password, fullName, branch } = req.body;
      
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return res.status(500).json({ 
          success: false, 
          error: "SUPABASE_SERVICE_ROLE_KEY is not configured. Please add it to environment variables to manage incharge accounts." 
        });
      }

      // 1. Create Auth User
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName, role: 'incharge', branch }
      });

      if (authError) throw authError;

      // 2. Create Incharge Record in public table
      const { error: dbError } = await supabaseAdmin
        .from('incharges')
        .insert([{
          id: authData.user.id,
          email,
          full_name: fullName,
          branch
        }]);

      if (dbError) throw dbError;

      res.json({ success: true });
    } catch (error: any) {
      console.error("Error creating incharge:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/delete-incharge", async (req, res) => {
    try {
      const { id, email } = req.body;

      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return res.status(500).json({ 
          success: false, 
          error: "SUPABASE_SERVICE_ROLE_KEY is not configured." 
        });
      }

      // 1. Delete Auth User
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
      if (authError) throw authError;

      // 2. Delete Incharge Record
      const { error: dbError } = await supabaseAdmin
        .from('incharges')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting incharge:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Branch Management Endpoints
  app.get("/api/branches", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      res.json({ success: true, branches: data });
    } catch (error: any) {
      console.error("Error fetching branches:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/branches", async (req, res) => {
    try {
      const { name, latitude, longitude, radius } = req.body;
      if (!name) return res.status(400).json({ success: false, error: "Branch name is required" });

      const { data, error } = await supabase
        .from('branches')
        .insert([{ 
          name, 
          latitude: latitude || null, 
          longitude: longitude || null, 
          radius: radius || 100 
        }])
        .select()
        .single();

      if (error) throw error;
      res.json({ success: true, branch: data });
    } catch (error: any) {
      console.error("Error creating branch:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.patch("/api/branches/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { name, latitude, longitude, radius } = req.body;
      
      const { data, error } = await supabase
        .from('branches')
        .update({ 
          name, 
          latitude, 
          longitude, 
          radius 
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json({ success: true, branch: data });
    } catch (error: any) {
      console.error("Error updating branch:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.delete("/api/branches/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting branch:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // API Routes
  app.get("/api/students", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  app.post("/api/students", async (req, res) => {
    try {
      const student = req.body;
      const { error } = await supabase
        .from('students')
        .insert([student]);

      if (error) throw error;
      res.status(201).json({ message: "Student registered successfully" });
    } catch (error) {
      console.error("Error saving student:", error);
      res.status(500).json({ error: "Failed to save student" });
    }
  });

  // Serve uploads
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  app.post("/api/fee-applications", upload.single('file'), async (req, res) => {
    try {
      const appData = JSON.parse(req.body.data);
      const fileName = req.file ? req.file.filename : null;

      // In a real app, we would upload the file to Supabase Storage
      // For now, we'll keep it local or just store the filename
      
      const { error } = await supabase
        .from('applications')
        .insert([{
          ...appData,
          file_url: fileName ? `/uploads/${fileName}` : null,
          academic_data: appData.academicRecords
        }]);

      if (error) throw error;
      res.status(201).json({ message: "Fee application submitted successfully" });
    } catch (error) {
      console.error("Error saving fee application:", error);
      res.status(500).json({ error: "Failed to save fee application" });
    }
  });

  app.post("/api/verify-student", async (req, res) => {
    try {
      const { fullName, trustId } = req.body;
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('full_name', fullName)
        .eq('trust_id', trustId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"

      if (data) {
        res.json({ success: true, student: data });
      } else {
        res.status(404).json({ success: false, message: "Student not found with these credentials." });
      }
    } catch (error) {
      console.error("Error verifying student:", error);
      res.status(500).json({ error: "Verification failed" });
    }
  });

  app.get("/api/fee-applications", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data.map(app => ({
        ...app,
        academicRecords: app.academic_data || []
      })));
    } catch (error) {
      console.error("Error fetching fee applications:", error);
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  app.patch("/api/fee-applications/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const { data: application, error: fetchError } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !application) {
        return res.status(404).json({ error: "Application not found" });
      }

      const { error: updateError } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id);

      if (updateError) throw updateError;

      if (status === 'approved' && process.env.SMTP_USER) {
        const mailOptions = {
          from: `"PSS Trust" <${process.env.SMTP_USER}>`,
          to: application.email,
          subject: "Fee Application Approved - PSS Trust",
          text: `Dear ${application.full_name},\n\nYour fee application (ID: ${application.student_id}) has been approved by the Chairman.\n\nPlease contact the office for further instructions.\n\nRegards,\nPSS Trust Team`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #0f172a;">Application Approved</h2>
              <p>Dear <strong>${application.full_name}</strong>,</p>
              <p>Your fee application (ID: <strong>${application.student_id}</strong>) has been <strong>approved</strong> by the Chairman.</p>
              <p>Please contact the office for further instructions regarding the next steps.</p>
              <br/>
              <p>Regards,<br/><strong>PSS Trust Team</strong></p>
            </div>
          `
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      } else if (status === 'approved') {
        console.log(`[MOCK EMAIL] To: ${application.email}`);
        console.log(`Subject: Fee Application Approved - PSS Trust`);
        console.log(`Body: Dear ${application.full_name}, your fee application (ID: ${application.student_id}) has been approved by the Chairman. Please contact the office for further details.`);
      }

      res.json({ success: true, message: `Application ${status.toLowerCase()} successfully` });
    } catch (error) {
      console.error("Error updating application status:", error);
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  // Send Student ID email after successful registration
  app.post('/api/send-student-id', async (req, res) => {
    const { email, fullName, trustId, trustBranch, courseType } = req.body;

    if (!email || !fullName || !trustId) {
      return res.status(400).json({ error: 'email, fullName, and trustId are required' });
    }

    // Always log to console
    console.log('------------------------------------------');
    console.log(`STUDENT REGISTRATION SUCCESS`);
    console.log(`Name    : ${fullName}`);
    console.log(`Email   : ${email}`);
    console.log(`Trust ID: ${trustId}`);
    console.log('------------------------------------------');

    const isPlaceholder =
      process.env.SMTP_USER?.includes('your-email') ||
      process.env.SMTP_PASS?.includes('your-gmail');

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || isPlaceholder) {
      console.log('[MOCK EMAIL] SMTP not configured — skipping student ID email.');
      return res.json({ success: true, mock: true });
    }

    const mailOptions = {
      from: `"PSS Trust" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Welcome to PSS Trust — Your Student ID',
      html: `
        <div style="font-family:sans-serif;padding:20px;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;">
          
          <div style="background:#0f172a;padding:24px;border-radius:8px 8px 0 0;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:22px;letter-spacing:0.5px;">PSS Trust Student Portal</h1>
            <p style="color:#94a3b8;margin:6px 0 0;font-size:13px;">Potukuchi Somasundara Social Welfare & Charitable Trust</p>
          </div>

          <div style="padding:32px 24px;">
            <p style="color:#1e293b;font-size:16px;margin-top:0;">Dear <strong>${fullName}</strong>,</p>
            <p style="color:#475569;font-size:15px;line-height:1.6;">
              Congratulations! Your registration with PSS Trust has been completed successfully.
              Please save your <strong>Student ID</strong> — you will need it for attendance, fee applications, and checking your status.
            </p>

            <div style="background:#f0fdf4;border:2px solid #86efac;border-radius:10px;padding:24px;text-align:center;margin:28px 0;">
              <p style="color:#166534;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Your Student ID</p>
              <p style="color:#15803d;font-size:32px;font-weight:900;letter-spacing:4px;margin:0;">${trustId}</p>
            </div>

            <table style="width:100%;border-collapse:collapse;font-size:14px;color:#475569;margin-bottom:24px;">
              <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:10px 4px;font-weight:600;color:#1e293b;width:40%;">Trust Branch</td>
                <td style="padding:10px 4px;">${trustBranch}</td>
              </tr>
              <tr style="border-bottom:1px solid #f1f5f9;">
                <td style="padding:10px 4px;font-weight:600;color:#1e293b;">Course Type</td>
                <td style="padding:10px 4px;">${courseType === 'btech' ? 'B.Tech' : 'Diploma'}</td>
              </tr>
              <tr>
                <td style="padding:10px 4px;font-weight:600;color:#1e293b;">Registered Email</td>
                <td style="padding:10px 4px;">${email}</td>
              </tr>
            </table>

            <div style="background:#fefce8;border-left:4px solid #fbbf24;padding:14px 16px;border-radius:4px;margin-bottom:24px;">
              <p style="margin:0;color:#92400e;font-size:13px;">
                <strong>Important:</strong> Please keep your Student ID safe. You will need it every time you mark attendance or submit a fee application.
              </p>
            </div>

            <p style="color:#64748b;font-size:14px;">
              Your next step is to complete your <strong>Face Registration</strong> so you can use the daily attendance feature.
            </p>
          </div>

          <div style="background:#f8fafc;padding:16px 24px;border-radius:0 0 8px 8px;border-top:1px solid #e2e8f0;text-align:center;">
            <p style="color:#94a3b8;font-size:12px;margin:0;">
              This is an automated message from PSS Trust. Please do not reply to this email.<br/>
              © ${new Date().getFullYear()} Potukuchi Somasundara Social Welfare & Charitable Trust
            </p>
          </div>

        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.json({ success: true });
    } catch (err) {
      console.error('Error sending student ID email:', err);
      // Non-blocking: registration already completed, email is best-effort
      return res.json({ success: true, emailError: true });
    }
  });

  // Email notification for approval
  app.post('/api/notify-approval', async (req, res) => {
    const { email, fullName, trustId } = req.body;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Fee Application Approved - PSS Trust',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #059669;">Application Approved!</h2>
          <p>Dear <strong>${fullName}</strong> (Trust ID: ${trustId}),</p>
          <p>Your application has been approved. You can proceed with fee payment.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
            <p>This is an automated message from PSS Trust. Please do not reply to this email.</p>
          </div>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      res.json({ success: true });
    } catch (error) {
      console.error('Error sending approval email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
