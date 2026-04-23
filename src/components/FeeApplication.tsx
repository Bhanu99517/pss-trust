import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../supabaseClient';
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Trash2,
  ArrowRight,
  Receipt,
  Loader2
} from 'lucide-react';

interface FeeApplicationProps {
  onBack: () => void;
}

const PSS_LOGO = "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/a84f56a0-4104-45b1-8c19-e9d129a3f77f.jpg";

export default function FeeApplication({ onBack }: FeeApplicationProps) {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [verifyData, setVerifyData] = useState({ fullName: '', sid: '' });
  const [otp, setOtp] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  
  const [formData, setFormData] = useState({
    trustBranch: '',
    sid: '',
    date: new Date().toISOString().split('T')[0],
    requestingFor: '',
    fullName: '',
    pinNo: '',
    collegeName: '',
    phoneNo: '',
    trustAttendance: '',
    collegeAttendance: '',
    academicYear: '',
    ceepRank: '',
    ecetRank: '',
    contribution: '',
    email: '',
  });

  const [academicRecords, setAcademicRecords] = useState([
    { semester: 'Sem I/I', gpa: '', backlogs: '' },
    { semester: 'Sem I/II', gpa: '', backlogs: '' },
    { semester: 'Sem II/I', gpa: '', backlogs: '' },
    { semester: 'Sem II/II', gpa: '', backlogs: '' },
    { semester: 'Sem III/I', gpa: '', backlogs: '' },
    { semester: 'Sem III/II', gpa: '', backlogs: '' },
  ]);

  const [file, setFile] = useState<File | null>(null);
  const [branches, setBranches] = useState<string[]>([]);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const resp = await fetch('/api/branches');
      const data = await resp.json();
      if (data.success && data.branches) {
        setBranches(data.branches.map((b: any) => b.name));
      }
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    
    const cleanSid = verifyData.sid.trim().toUpperCase();
    console.log("Entered:", cleanSid);

    try {
      const { data: student, error: fetchError } = await supabase
        .from('students')
        .select('*')
        .eq('trust_id', cleanSid)
        .single();

      if (fetchError) throw new Error('Student not found. Please check your SID.');
      
      console.log('Verified student for fee application:', student);

      // Calculate Attendance Score using the exact same formula as the Student Attendance page:
      //   Attendance Score = (presentDays / 365) * 100  →  toFixed(1) + "%"
      // present = 1, H/HP = 0.5, everything else = 0
      const { data: attendanceLogs } = await supabase
        .from('attendance')
        .select('status')
        .eq('student_id', student.id);

      const presentDays = (attendanceLogs || []).reduce((acc: number, log: any) => {
        if (log.status === 'present') return acc + 1;
        if (log.status === 'H' || log.status === 'HP') return acc + 0.5;
        return acc;
      }, 0);
      const trustAttendanceValue = `${((presentDays / 365) * 100).toFixed(1)}%`;

      const studentEmail = student.email;
      setFormData(prev => ({
        ...prev,
        trustBranch: student.trust_branch,
        sid: student.trust_id,
        fullName: student.full_name,
        pinNo: student.pin_number, 
        collegeName: student.college_name,
        phoneNo: student.mobile_number,
        email: studentEmail,
        trustAttendance: trustAttendanceValue,
      }));
      
      if (!studentEmail) {
        throw new Error('Email not found in your student record. Please contact the office.');
      }
      
      setIsSendingOtp(true);
      const resp = await fetch('/api/application-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email: studentEmail }),
      });
      const otpData = await resp.json();
      if (otpData.success) {
        setIsOtpSent(true);
      } else {
        throw new Error(otpData.error || 'Failed to send OTP');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      alert(error.message);
    } finally {
      setIsVerifying(false);
      setIsSendingOtp(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      alert('Email not found in your student record. Please contact the office.');
      return;
    }
    setIsSendingOtp(true);
    setOtpError('');
    try {
      const resp = await fetch('/api/application-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email: formData.email }),
      });
      const data = await resp.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to send OTP');
      }
    } catch (error: any) {
      alert('Error sending OTP: ' + error.message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) return;
    setIsVerifyingOtp(true);
    setOtpError('');
    try {
      const resp = await fetch('/api/application-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email: formData.email, otp }),
      });
      const data = await resp.json();
      if (data.success) {
        setIsVerified(true);
        setIsOtpSent(false);
      } else {
        setOtpError(data.error || 'Invalid OTP');
      }
    } catch (error: any) {
      setOtpError(error.message);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleAcademicChange = (index: number, field: string, value: string) => {
    const newRecords = [...academicRecords];
    newRecords[index] = { ...newRecords[index], [field]: value };
    setAcademicRecords(newRecords);
  };

  const addAcademicRow = () => {
    setAcademicRecords([...academicRecords, { semester: '', gpa: '', backlogs: '' }]);
  };

  const removeAcademicRow = (index: number) => {
    setAcademicRecords(academicRecords.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmitInternal = async () => {
    if (!file) return;
    setIsSubmitting(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${formData.sid}_${Date.now()}.${fileExt}`;
      const filePath = `applications/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('applications')
        .insert([{
          student_id: formData.sid,
          full_name: formData.fullName,
          requesting_for: formData.requestingFor,
          college_name: formData.collegeName,
          academic_year: formData.academicYear,
          contribution: formData.contribution,
          file_url: publicUrl,
          status: 'pending_branch',
          trust_branch: formData.trustBranch,
          academic_records: academicRecords,
          phone_no: formData.phoneNo,
          email: formData.email,
          trust_attendance: formData.trustAttendance,
          college_attendance: formData.collegeAttendance,
          ceep_rank: formData.ceepRank,
          ecet_rank: formData.ecetRank,
        }])

      if (insertError) throw insertError;

      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Error submitting application:', error);
      alert('An error occurred: ' + (error.message || 'Please check your connection.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmitInternal();
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h2>
          <p className="text-slate-500 mb-8">
            Your fee application has been received. The Trust will review your request and get back to you soon.
          </p>
          <button 
            onClick={onBack}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>

          <AnimatePresence mode="wait">
            {!isOtpSent ? (
              <motion.div 
                key="verify"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
              >
                <div className="bg-slate-900 p-8 text-white text-center">
                  <h1 className="text-2xl font-bold mb-2">Student Verification</h1>
                  <p className="text-slate-400 text-sm">Enter your details to apply for fee</p>
                </div>

                <form onSubmit={handleVerify} className="p-8 space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={verifyData.fullName}
                      onChange={(e) => setVerifyData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="As per registration"
                      className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">SID</label>
                    <input 
                      required
                      type="text" 
                      value={verifyData.sid}
                      onChange={(e) => setVerifyData(prev => ({ ...prev, sid: e.target.value }))}
                      placeholder="Enter SID"
                      className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isVerifying || isSendingOtp}
                    className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isVerifying || isSendingOtp ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span>Verify & Proceed</span>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="otp"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
              >
                <div className="bg-slate-900 p-8 text-white text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Receipt className="w-8 h-8 text-blue-400" />
                  </div>
                  <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
                  <p className="text-slate-400 text-sm">We've sent an OTP to {formData.email}</p>
                </div>

                <div className="p-8 space-y-6">
                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">Enter 6-Digit OTP</label>
                      <input 
                        required
                        type="text" 
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-center text-3xl font-bold tracking-[1rem] py-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                        placeholder="000000"
                      />
                    </div>

                    {otpError && (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl text-sm justify-center">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>{otpError}</p>
                      </div>
                    )}

                    <button 
                      type="submit"
                      disabled={isVerifyingOtp || otp.length < 6}
                      className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isVerifyingOtp ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <span>Verify & Continue</span>
                      )}
                    </button>
                  </form>

                  <div className="flex flex-col gap-4 text-center">
                    <button 
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isSendingOtp}
                      className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors"
                    >
                      Didn't receive code? Resend OTP
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsOtpSent(false)}
                      className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Change SID/Name
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-4">
            {[1, 2].map((s) => (
              <div 
                key={s}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step === s 
                    ? 'bg-slate-900 text-white scale-110 shadow-lg' 
                    : step > s 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-slate-200 text-slate-400'
                }`}
              >
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
            >
              <div className="bg-slate-900 p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <FileText className="w-8 h-8 text-emerald-400" />
                  <h1 className="text-2xl font-bold">Student Request Form</h1>
                </div>
                <p className="text-slate-400 text-sm">Fee Application & Provisions Request</p>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Trust Branch</label>
                    <select 
                      required
                      name="trustBranch"
                      value={formData.trustBranch}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all font-medium"
                    >
                      <option value="">Select Branch</option>
                      {branches.length === 0 ? (
                        <option value="">Loading branches...</option>
                      ) : (
                        branches.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">SID</label>
                    <input 
                      readOnly
                      type="text" 
                      name="sid"
                      value={formData.sid}
                      className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-100 text-slate-500 cursor-not-allowed outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date</label>
                    <input 
                      required
                      type="date" 
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Requesting For</label>
                    <select 
                      required
                      name="requestingFor"
                      value={formData.requestingFor}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all font-medium"
                    >
                      <option value="">Select Request Type</option>
                      <option value="Semester Fee">Semester Fee</option>
                      <option value="Bus Pass">Bus Pass</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                    <input 
                      readOnly
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-100 text-slate-500 cursor-not-allowed outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pin Number</label>
                    <input 
                      readOnly
                      type="text" 
                      name="pinNo"
                      value={formData.pinNo}
                      className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-100 text-slate-500 cursor-not-allowed outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">College Name</label>
                    <input 
                      required
                      type="text" 
                      name="collegeName"
                      value={formData.collegeName}
                      className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                    <input 
                      readOnly
                      type="tel" 
                      name="phoneNo"
                      value={formData.phoneNo}
                      className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-100 text-slate-500 cursor-not-allowed outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Trust Att. % <span className="text-emerald-500 normal-case font-normal">(auto)</span></label>
                    <input 
                      readOnly
                      type="text" 
                      name="trustAttendance"
                      value={formData.trustAttendance}
                      title="Auto-calculated from attendance records"
                      className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-100 text-slate-500 cursor-not-allowed outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">College Att. %</label>
                    <input 
                      type="text" 
                      name="collegeAttendance"
                      value={formData.collegeAttendance}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">A.Y (e.g. 23-26)</label>
                    <input 
                      type="text" 
                      name="academicYear"
                      value={formData.academicYear}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                    <input 
                      readOnly
                      type="email" 
                      name="email"
                      value={formData.email}
                      className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-100 text-slate-500 cursor-not-allowed outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">CEEP Rank</label>
                    <input 
                      type="text" 
                      name="ceepRank"
                      value={formData.ceepRank}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">ECET Rank</label>
                    <input 
                      type="text" 
                      name="ecetRank"
                      value={formData.ecetRank}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Academic Performance</h3>
                    <button 
                      type="button"
                      onClick={addAcademicRow}
                      className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                      Add Row
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider border border-slate-100">Semester/Year</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider border border-slate-100">GPA/CGPA</th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider border border-slate-100">No. Backlogs</th>
                          <th className="px-4 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider border border-slate-100 w-16"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {academicRecords.map((record, idx) => (
                          <tr key={idx}>
                            <td className="border border-slate-100 p-0">
                              <input 
                                type="text" 
                                value={record.semester}
                                onChange={(e) => handleAcademicChange(idx, 'semester', e.target.value)}
                                className="w-full px-4 py-3 outline-none focus:bg-blue-50/30 transition-all"
                                placeholder="e.g., Sem I/I"
                              />
                            </td>
                            <td className="border border-slate-100 p-0">
                              <input 
                                type="text" 
                                value={record.gpa}
                                onChange={(e) => handleAcademicChange(idx, 'gpa', e.target.value)}
                                className="w-full px-4 py-3 outline-none focus:bg-blue-50/30 transition-all"
                                placeholder="e.g., 8.5"
                              />
                            </td>
                            <td className="border border-slate-100 p-0">
                              <input 
                                type="text" 
                                value={record.backlogs}
                                onChange={(e) => handleAcademicChange(idx, 'backlogs', e.target.value)}
                                className="w-full px-4 py-3 outline-none focus:bg-blue-50/30 transition-all"
                                placeholder="0"
                              />
                            </td>
                            <td className="border border-slate-100 p-2 text-center">
                              <button 
                                type="button"
                                onClick={() => removeAcademicRow(idx)}
                                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Your contribution towards Trust:</label>
                  <textarea 
                    required
                    name="contribution"
                    value={formData.contribution}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe how you help or involve in Trust works (e.g., cooking, cleaning, teaching...)"
                    className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={() => setStep(2)}
                    className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-3 shadow-xl shadow-slate-200"
                  >
                    <span>Next: Upload Letter</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
            >
              <div className="bg-slate-900 p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <Upload className="w-8 h-8 text-emerald-400" />
                  <h1 className="text-2xl font-bold">Document Upload</h1>
                </div>
                <p className="text-slate-400 text-sm">Upload your signed request letter</p>
              </div>

              <div className="p-8 space-y-8">
                <div className="bg-blue-50/50 p-12 rounded-3xl border-2 border-dashed border-blue-100">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                      <Upload className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Request Letter</h3>
                    <p className="text-slate-500 text-sm mb-8 max-w-xs">
                      Please upload a scanned copy of your signed request letter or supporting documents.
                    </p>
                    
                    <label className="cursor-pointer">
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <div className="px-12 py-4 bg-white border border-blue-200 text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-sm">
                        {file ? file.name : 'Choose File'}
                      </div>
                    </label>
                    {file && (
                      <p className="mt-4 text-sm text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> File selected successfully
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                  >
                    Back to Form
                  </button>
                  <button 
                    onClick={handleSubmitInternal}
                    disabled={isSubmitting || !file}
                    className="px-12 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-3 shadow-xl shadow-emerald-100 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}