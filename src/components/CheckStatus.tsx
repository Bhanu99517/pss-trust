import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../supabaseClient';
import { Search, Loader2, CheckCircle2, XCircle, Clock, ArrowLeft } from 'lucide-react';

interface CheckStatusProps {
  onBack: () => void;
}

export default function CheckStatus({ onBack }: CheckStatusProps) {
  const [sid, setSid] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [application, setApplication] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sid.trim()) return;

    setIsSearching(true);
    setError(null);
    setApplication(null);

    try {
      const cleanId = sid.trim().toUpperCase();
      console.log('Searching application for SID:', cleanId);
      
      const { data, error: fetchError } = await supabase
        .from('applications')
        .select('*')
        .eq('student_id', cleanId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new Error('No application found for this SID.');
        }
        throw fetchError;
      }

      setApplication(data);
    } catch (err: any) {
      console.error('Error searching application:', err);
      setError(err.message || 'An error occurred while searching. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
      <div className="max-w-md mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-wider">Back to Home</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="p-8 bg-slate-900 text-white">
            <h2 className="text-2xl font-bold mb-2">Check Application Status</h2>
            <p className="text-slate-400 text-sm">Enter your SID to track your fee application</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  SID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={sid}
                    onChange={(e) => setSid(e.target.value)}
                    placeholder="Enter SID"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all font-bold text-slate-900 placeholder:text-slate-300"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="absolute right-2 top-2 bottom-2 px-4 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center"
                  >
                    {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </form>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600"
                >
                  <XCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-bold">{error}</p>
                </motion.div>
              )}

              {application && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-8 space-y-6"
                >
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Status</p>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        application.status.startsWith('pending') ? 'bg-orange-100 text-orange-600' : 
                        application.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 
                        'bg-red-100 text-red-600'
                      }`}>
                        {application.status === 'pending_incharge' ? 'Pending Incharge' : 
                         application.status === 'pending_chairman' ? 'Pending Chairman' : 
                         application.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      {application.status.startsWith('pending') && (
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                          <Clock className="w-6 h-6" />
                        </div>
                      )}
                      {application.status === 'approved' && (
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      )}
                      {application.status === 'rejected' && (
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                          <XCircle className="w-6 h-6" />
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-bold text-slate-900">
                          {application.status === 'pending_incharge' ? 'Review by Incharge' : 
                           application.status === 'pending_chairman' ? 'Review by Chairman' :
                           application.status === 'approved' ? 'Application Approved!' : 
                           'Application Rejected'}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          {application.status === 'pending_incharge' ? 'Your branch incharge is currently reviewing your application.' : 
                           application.status === 'pending_chairman' ? 'Your application has been approved by the incharge and is now with the Chairman.' :
                           application.status === 'approved' ? 'Your application has been approved by the Chairman. You can now proceed.' : 
                           'Unfortunately, your application was not approved at this time.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {application.status === 'approved' && (
                    <button className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2">
                      Proceed to Fee Payment
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
