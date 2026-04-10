import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../supabaseClient';
import { 
  LogOut, 
  Users, 
  CheckCircle, 
  Clock, 
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  FileText,
  Check,
  X as CloseIcon,
  Eye,
  Receipt,
  Loader2,
  Settings,
  MessageSquare
} from 'lucide-react';

const PSS_LOGO = "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/a84f56a0-4104-45b1-8c19-e9d129a3f77f.jpg";

interface Student {
  id: string;
  trust_id: string;
  full_name: string;
  father_name: string;
  email: string;
  mobile_number: string;
  college_name: string;
  branch: string;
  trust_branch?: string;
  status?: string;
  photo_url?: string;
  created_at?: string;
}

interface FeeApplication {
  id: string;
  student_id: string;
  full_name: string;
  college_name: string;
  pin_number?: string;
  phone_number?: string;
  email?: string;
  requesting_for: string;
  academic_records?: any[];
  contribution: string;
  file_url: string;
  status: string;
  trust_branch?: string;
  branch_incharge_comment?: string;
  super_incharge_comment?: string;
  chairman_comment?: string;
  created_at: string;
}

interface SuperInchargeDashboardProps {
  onLogout: () => void;
  onChangePassword: () => void;
}

export default function SuperInchargeDashboard({ onLogout, onChangePassword }: SuperInchargeDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<'students' | 'applications'>('applications');
  const [applications, setApplications] = useState<FeeApplication[]>([]);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [selectedApp, setSelectedApp] = useState<FeeApplication | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [approvalComment, setApprovalComment] = useState('');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchStudents(),
        fetchApplications()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudentsList(data || []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setIsUpdating(id);
    try {
      // If super incharge approves, it goes to chairman
      const newStatus = status === 'approved' ? 'pending_chairman' : 'rejected';
      
      const updateData: any = { status: newStatus };
      if (status === 'approved') {
        updateData.super_incharge_comment = approvalComment;
      }
      
      const { error } = await supabase
        .from('applications')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus, super_incharge_comment: approvalComment } : app));
      alert(status === 'approved' ? 'Application approved and forwarded to Chairman!' : 'Application rejected!');
      setShowApprovalModal(false);
      setApprovalComment('');
    } catch (error: any) {
      console.error('Update status error:', error);
      alert('Error updating status: ' + error.message);
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredStudents = studentsList.filter(s => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      s.full_name.toLowerCase().includes(searchLower) || 
      s.trust_id.toLowerCase().includes(searchLower) ||
      s.college_name.toLowerCase().includes(searchLower);
    
    const matchesBranch = branchFilter === 'All' || s.trust_branch === branchFilter;
    return matchesSearch && matchesBranch;
  });

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.student_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter === 'All' || app.trust_branch === branchFilter;
    // Super incharge only sees apps that have passed branch incharge
    const isVisible = app.status !== 'pending_branch';
    return matchesSearch && matchesBranch && isVisible;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-slate-900 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-slate-200 px-4 lg:px-8 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <img src={PSS_LOGO} alt="PSS Logo" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">PSS Super Incharge Dashboard</h1>
            <p className="text-xs font-medium text-slate-500">Central Management Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onChangePassword}
            className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <span className="text-xl font-bold">{studentsList.length}</span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Students</p>
              <p className="text-lg font-bold text-slate-900">Registered</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending My Approval</p>
              <p className="text-lg font-bold text-slate-900">{applications.filter(a => a.status === 'pending_super').length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Forwarded to Chairman</p>
              <p className="text-lg font-bold text-slate-900">{applications.filter(a => a.status === 'pending_chairman' || a.status === 'approved').length}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600">
              <CloseIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rejected</p>
              <p className="text-lg font-bold text-slate-900">{applications.filter(a => a.status === 'rejected').length}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button 
            onClick={() => setActiveTab('applications')}
            className={`px-8 py-4 text-sm font-bold transition-all ${activeTab === 'applications' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Fee Applications ({filteredApps.length})
          </button>
          <button 
            onClick={() => setActiveTab('students')}
            className={`px-8 py-4 text-sm font-bold transition-all ${activeTab === 'students' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            All Students ({filteredStudents.length})
          </button>
        </div>

        {/* Table Controls */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Name, SID, College..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 focus:border-slate-300 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-3 rounded-xl border border-slate-100 focus:border-slate-300 outline-none transition-all text-sm font-medium bg-slate-50"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
          >
            <option value="All">All Branches</option>
            {['BHEL', 'Bollaram', 'MYP', 'MKR', 'ECIL'].map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* List Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {activeTab === 'applications' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Branch</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Request For</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-6">
                        <div>
                          <p className="font-bold text-slate-900">{app.full_name}</p>
                          <p className="text-xs text-slate-500">{app.student_id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-sm font-medium text-slate-700">{app.trust_branch}</span>
                      </td>
                      <td className="px-6 py-6 font-medium text-slate-700">{app.requesting_for}</td>
                      <td className="px-6 py-6 text-sm text-slate-500">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          app.status === 'pending_super' ? 'bg-orange-50 text-orange-600' : 
                          app.status === 'pending_chairman' ? 'bg-blue-50 text-blue-600' :
                          app.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                          'bg-red-50 text-red-600'
                        }`}>
                          {app.status === 'pending_super' ? 'Pending Super' : 
                           app.status === 'pending_chairman' ? 'Pending Chairman' : 
                           app.status}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedApp(app)}
                            className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          {app.status === 'pending_super' && (
                            <>
                              <button 
                                onClick={() => {
                                  setSelectedApp(app);
                                  setShowApprovalModal(true);
                                }}
                                disabled={isUpdating === app.id}
                                className="p-2 text-slate-400 hover:text-emerald-600 transition-colors disabled:opacity-50"
                                title="Approve"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(app.id, 'rejected')}
                                disabled={isUpdating === app.id}
                                className="p-2 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                title="Reject"
                              >
                                <CloseIcon className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">SID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Trust Branch</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">College</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-6">
                        <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                          {student.trust_id}
                        </span>
                      </td>
                      <td className="px-6 py-6 font-bold text-slate-900">{student.full_name}</td>
                      <td className="px-6 py-6 font-medium text-slate-700">{student.trust_branch}</td>
                      <td className="px-6 py-6 text-sm text-slate-600">{student.college_name}</td>
                      <td className="px-6 py-6 text-right">
                        <button 
                          onClick={() => setSelectedStudent(student)}
                          className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Application Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-emerald-400" />
                  <h2 className="text-xl font-bold">Application Details</h2>
                </div>
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</p>
                    <p className="font-bold text-slate-900">{selectedApp.full_name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">SID</p>
                    <p className="font-bold text-slate-900">{selectedApp.student_id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Branch</p>
                    <p className="font-bold text-slate-900">{selectedApp.trust_branch}</p>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    Approval History
                  </h3>
                  <div className="space-y-3">
                    {selectedApp.branch_incharge_comment && (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Branch Incharge Comment</p>
                        <p className="text-sm text-slate-700 italic">"{selectedApp.branch_incharge_comment}"</p>
                      </div>
                    )}
                    {!selectedApp.branch_incharge_comment && (
                      <p className="text-xs text-slate-400 italic">No comments from branch incharge.</p>
                    )}
                  </div>
                </div>

                {selectedApp.file_url && (
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-emerald-900">Attached Document</p>
                      <p className="text-xs text-emerald-600">View student's request letter</p>
                    </div>
                    <a 
                      href={selectedApp.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-all"
                    >
                      View File
                    </a>
                  </div>
                )}
              </div>

              {selectedApp.status === 'pending_super' && (
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                  <button 
                    onClick={() => {
                      handleUpdateStatus(selectedApp.id, 'rejected');
                      setSelectedApp(null);
                    }}
                    className="px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-white transition-all"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => setShowApprovalModal(true)}
                    className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                  >
                    Approve & Forward
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Approval Comment Modal */}
      <AnimatePresence>
        {showApprovalModal && selectedApp && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowApprovalModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-4">Approval Comment</h3>
              <p className="text-sm text-slate-500 mb-4">Add a comment for the Chairman (Optional):</p>
              <textarea 
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all resize-none mb-6"
                rows={4}
                placeholder="Enter your comment here..."
              />
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowApprovalModal(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleUpdateStatus(selectedApp.id, 'approved')}
                  disabled={isUpdating === selectedApp.id}
                  className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center"
                >
                  {isUpdating === selectedApp.id ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Approval'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mx-auto mb-4">
                <LogOut className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Confirm Logout</h3>
              <p className="text-slate-500 mb-8">Are you sure you want to logout from the Super Incharge dashboard?</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={onLogout}
                  className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
