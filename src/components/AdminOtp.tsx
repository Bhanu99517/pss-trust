import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Lock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { CHAIRMAN_EMAIL } from '../config';
const PSS_LOGO = "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/a84f56a0-4104-45b1-8c19-e9d129a3f77f.jpg";

export default function AdminOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const password = sessionStorage.getItem('_tmp_pwd');
  
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    // Small delay to let sessionStorage settle
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem('_tmp_pwd') || !email) {
        navigate('/admin-login');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [email, navigate]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Step 1: Verify OTP on server
      const response = await fetch('/api/verify-login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (data.success) {
        sessionStorage.removeItem('_tmp_pwd');
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError('Authentication failed. Please try again.');
          return;
        }

        // Success! Global auth state will update and App.tsx will allow dashboard access
        // Redirect based on email and role
        if (email === CHAIRMAN_EMAIL) {
          navigate('/chairman-dashboard');
        } else {
          // Fetch role to redirect correctly
          const { data: roleData } = await supabase
            .from('incharges')
            .select('role')
            .eq('email', email)
            .single();
          
          if (roleData?.role === 'super_incharge') {
            navigate('/super-incharge-dashboard');
          } else {
            navigate('/incharge-dashboard');
          }
        }
      } else {
        setError(data.error || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      sessionStorage.removeItem('_tmp_pwd');
      console.error('OTP verification error:', err);
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch('/api/send-login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) {
        setResendCooldown(60); // 60 seconds cooldown
        setError('');
      } else {
        setError('Failed to resend OTP.');
      }
    } catch (err) {
      setError('Error resending OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 lg:px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src={PSS_LOGO} alt="PSS Logo" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">PSS</h1>
            <p className="text-xs font-medium text-slate-500">Social Welfare</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/admin-login')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8 lg:p-10"
        >
          <div className="text-center mb-10">
            <img src={PSS_LOGO} alt="PSS Logo" className="w-20 h-20 mx-auto mb-6 rounded-full border-4 border-slate-50 shadow-sm" referrerPolicy="no-referrer" />
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Verify Identity</h2>
            <p className="text-slate-500">OTP Verification</p>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-2">
                <Lock className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Enter Verification Code</h3>
              <p className="text-sm text-slate-500">
                A 6-digit code has been sent to<br/>
                <span className="font-bold text-slate-900">{email}</span>
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="000000"
                required
                autoFocus
                maxLength={6}
                className="w-full px-4 py-5 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50/50 outline-none transition-all text-center text-4xl tracking-[0.5em] font-black text-slate-900 placeholder:text-slate-200"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
              
              {error && (
                <p className="text-red-500 text-sm font-bold text-center bg-red-50 py-2 rounded-lg">{error}</p>
              )}
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Log In'
                )}
              </button>
              
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading || resendCooldown > 0}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-bold transition-colors disabled:opacity-50"
                >
                  {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Resend Code'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin-login')}
                  className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
                >
                  Use different account
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
