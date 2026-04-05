import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, ArrowLeft, Loader2, AlertCircle, Download, Filter, ChevronRight, ChevronLeft, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../supabaseClient';

interface StudentAttendanceProps {
  onBack: () => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const STATUS_COLORS: Record<string, string> = {
  'present': 'bg-emerald-500 text-white',
  'absent': 'bg-red-500 text-white',
  'W': 'bg-amber-500 text-white',
  'E': 'bg-blue-500 text-white',
  'H': 'bg-purple-500 text-white',
  'HP': 'bg-purple-500 text-white',
};

export default function StudentAttendance({ onBack }: StudentAttendanceProps) {
  const [sid, setSid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [student, setStudent] = useState<any>(null);
  const [faceImageUrl, setFaceImageUrl] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');

  const fetchAttendance = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!sid.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('trust_id', sid.trim().toUpperCase())
        .single();

      if (studentError) throw new Error('Student not found.');
      
      setStudent(studentData);
      console.log('Fetched student for report:', studentData);

      const { data: attendanceLogs, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentData.id)
        .order('created_at', { ascending: true });

      if (attendanceError) throw attendanceError;

      const formattedLogs = (attendanceLogs || []).map(log => ({
        date: log.created_at,
        status: log.status
      }));

      setAttendanceData(formattedLogs);
      setFaceImageUrl(null); // Fallback to icon
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const attendanceMap = useMemo(() => {
    const map: Record<string, string> = {};
    attendanceData.forEach(record => {
      const date = new Date(record.date);
      const key = `${date.getMonth()}-${date.getDate()}`;
      map[key] = record.status;
    });
    return map;
  }, [attendanceData]);

  const stats = useMemo(() => {
    const totalWorkingDays = 365;
    const presentDays = attendanceData.reduce((acc, curr) => {
      if (curr.status === 'present') return acc + 1;
      if (curr.status === 'H' || curr.status === 'HP') return acc + 0.5;
      return acc;
    }, 0);
    const percentage = (presentDays / totalWorkingDays) * 100;
    const lastUpdated = attendanceData.length > 0 
      ? new Date(attendanceData[attendanceData.length - 1].date).toLocaleString('en-US', { 
          month: 'short', day: '2-digit', year: 'numeric', 
          hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true 
        })
      : 'N/A';

    return {
      totalWorkingDays,
      presentDays,
      percentage,
      lastUpdated
    };
  }, [attendanceData]);

  const exportReport = () => {
    if (!student) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Month,Day,Status\n"
      + attendanceData.map(r => `${MONTHS[new Date(r.date).getMonth()]},${new Date(r.date).getDate()},${r.status}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_${student.sid}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-8 no-print group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        {!student ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-10 border border-slate-200 max-w-xl mx-auto"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Attendance Report</h2>
                <p className="text-sm text-slate-500">Access student attendance records</p>
              </div>
            </div>

            <form onSubmit={fetchAttendance} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student SID</label>
                <input
                  type="text"
                  value={sid}
                  onChange={(e) => setSid(e.target.value)}
                  placeholder="Enter SID"
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-mono text-lg"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <span>GENERATE REPORT</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm flex items-center gap-3 border border-red-100"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="font-medium">{error}</p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Student Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 lg:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 overflow-hidden border border-slate-200">
                    {faceImageUrl ? (
                      <img 
                        src={faceImageUrl} 
                        alt={student.full_name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Users className="w-10 h-10" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 uppercase tracking-tight">{student.full_name}</h1>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">
                        <span className="uppercase tracking-wider">SID:</span>
                        <span className="font-mono">{student.trust_id}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                        <span className="uppercase tracking-wider">EMAIL:</span>
                        <span className="font-mono">{student.email}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-slate-700">
                        {student.course_type === 'diploma' ? student.college_name : student.btech_college}
                      </p>
                      <p className="text-xs text-slate-500">
                        {student.course_type === 'diploma' ? student.branch : student.btech_branch} ({student.course_type?.toUpperCase()})
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Attendance Score</span>
                  <div className="text-5xl font-serif font-bold text-indigo-600">
                    {stats.percentage.toFixed(1)}<span className="text-2xl ml-1">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-[11px] font-serif italic text-slate-400 uppercase tracking-wider mb-2">Working Days</p>
                <p className="text-3xl font-mono font-bold text-slate-900">{stats.totalWorkingDays}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-[11px] font-serif italic text-slate-400 uppercase tracking-wider mb-2">Days Present</p>
                <p className="text-3xl font-mono font-bold text-emerald-600">{stats.presentDays}</p>
              </div>
            </div>

            {/* Main Attendance Grid */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Monthly Attendance Record
                </h3>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Last Updated: {stats.lastUpdated}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-3 border-r border-slate-200 w-12 text-center text-slate-400 font-mono">#</th>
                      <th className="p-3 border-r border-slate-200 text-left w-32 font-serif italic text-slate-500 uppercase tracking-wider">Month</th>
                      {DAYS.map(d => (
                        <th key={d} className="p-2 border-r border-slate-100 font-mono text-center min-w-[32px] text-slate-400">
                          {d.toString().padStart(2, '0')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MONTHS.map((month, mIdx) => (
                      <tr key={month} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 border-r border-slate-200 text-center font-mono text-slate-400">{mIdx + 1}</td>
                        <td className="p-3 border-r border-slate-200 font-bold text-slate-700 uppercase tracking-tight">{month}</td>
                        {DAYS.map(day => {
                          const status = attendanceMap[`${mIdx}-${day}`];
                          return (
                            <td 
                              key={day} 
                              className={`p-2 border-r border-slate-50 text-center font-bold min-w-[32px] transition-all ${
                                status === 'present' ? 'text-emerald-600 bg-emerald-50/30' : 
                                status === 'absent' ? 'text-red-600 bg-red-50/30' : 
                                status === 'W' ? 'text-amber-600 bg-amber-50/30' : 
                                status === 'E' ? 'text-blue-600 bg-blue-50/30' : 
                                status === 'H' || status === 'HP' ? 'text-purple-600 bg-purple-50/30' : 
                                'text-slate-200'
                              }`}
                            >
                              {status === 'present' ? 'P' : status === 'absent' ? 'A' : status || '·'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col lg:flex-row justify-end items-start lg:items-center gap-8 pt-4 no-print">
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 lg:flex-none px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                >
                  Print Report
                </button>
                <button 
                  onClick={exportReport}
                  className="flex-1 lg:flex-none px-6 py-3 border border-slate-200 bg-white text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
                <button 
                  onClick={() => setStudent(null)}
                  className="flex-1 lg:flex-none px-6 py-3 border border-slate-200 bg-white text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
                >
                  New Search
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; padding: 0 !important; }
          .max-w-6xl { max-width: 100% !important; }
          .rounded-2xl { border-radius: 0 !important; }
          .shadow-sm, .shadow-xl { box-shadow: none !important; }
          .border { border-color: #eee !important; }
        }
      `}</style>
    </div>
  );
}
