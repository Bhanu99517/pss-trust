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
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  FileText,
  Check,
  X as CloseIcon,
  Eye,
  Receipt,
  Loader2,
  Lock,
  Pencil,
  Trash2,
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

interface Notice {
  id: string;
  title: string;
  content: string;
  branches: string[];
  created_at: string;
  created_by: string;
}

interface InchargeDashboardProps {
  onLogout: () => void;
  onChangePassword: () => void;
}

export default function InchargeDashboard({ onLogout, onChangePassword }: InchargeDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');
  const [appFilter, setAppFilter] = useState('pending_branch');
  const [activeTab, setActiveTab] = useState<'students' | 'applications' | 'attendance' | 'notices'>('students');
  const [applications, setApplications] = useState<FeeApplication[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([]);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedApp, setSelectedApp] = useState<FeeApplication | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [approvalComment, setApprovalComment] = useState('');
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const [inchargeBranches, setInchargeBranches] = useState<string[]>([]);
  const [isLoadingBranch, setIsLoadingBranch] = useState(true);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          const { data: inchargeData, error: inchargeError } = await supabase
            .from('incharges')
            .select('branch')
            .eq('email', user.email)
            .single();
          
          if (inchargeError) throw inchargeError;
          if (inchargeData) {
            const branches = inchargeData.branch.split(',').map((b: string) => b.trim());
            setInchargeBranches(branches);
            // Fetch data after getting the branches
            fetchStudents(branches);
            fetchApplications(branches);
            fetchAttendanceLogs(branches);
            fetchNotices(branches);
          }
        }
      } catch (error) {
        console.error('Error initializing dashboard:', error);
      } finally {
        setIsLoadingBranch(false);
      }
    };

    initializeDashboard();
  }, []);

  const fetchNotices = async (branches: string[]) => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .overlaps('branches', branches)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotices(data || []);
    } catch (error) {
      console.error('Failed to fetch notices:', error);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  const fetchStudents = async (branches: string[]) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .in('trust_branch', branches)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudentsList(data || []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const fetchAttendanceLogs = async (branches: string[]) => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*, students!inner(full_name, trust_id, college_name, trust_branch)')
        .in('students.trust_branch', branches)
        .gte('created_at', new Date().toISOString().split('T')[0])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAttendanceLogs(data || []);
    } catch (error) {
      console.error('Failed to fetch attendance logs:', error);
    }
  };

  const fetchApplications = async (branches: string[]) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .in('trust_branch', branches)
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
      // If incharge approves, it goes to super incharge
      const newStatus = status === 'approved' ? 'pending_super' : 'rejected';
      
      const updateData: any = { status: newStatus };
      if (status === 'approved') {
        updateData.branch_incharge_comment = approvalComment;
      }
      
      const { error } = await supabase
        .from('applications')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus, branch_incharge_comment: approvalComment } : app));
      alert(status === 'approved' ? 'Application approved and forwarded to Super Incharge!' : 'Application rejected!');
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
      s.email.toLowerCase().includes(searchLower) ||
      s.trust_id.toLowerCase().includes(searchLower) ||
      s.father_name.toLowerCase().includes(searchLower) ||
      s.mobile_number.toLowerCase().includes(searchLower) ||
      s.college_name.toLowerCase().includes(searchLower) ||
      s.branch.toLowerCase().includes(searchLower);
    
    const matchesFilter = filter === 'All' || (filter === 'Logged In' && s.status === 'Active') || (filter === 'Not Logged In' && s.status === 'Pending');
    const matchesBranch = branchFilter === 'All' || s.trust_branch === branchFilter;
    return matchesSearch && matchesFilter && matchesBranch;
  });

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (app.email && app.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBranch = branchFilter === 'All' || app.trust_branch === branchFilter;
    
    // Only show pending_branch, approved, and rejected for branch incharge
    const allowedStatuses = ['pending_branch', 'approved', 'rejected'];
    if (!allowedStatuses.includes(app.status)) return false;

    const matchesStatus = appFilter === 'All' || app.status === appFilter;
    return matchesSearch && matchesStatus && matchesBranch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-slate-200 px-4 lg:px-8 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <img src={PSS_LOGO} alt="PSS Logo" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">PSS Incharge Dashboard</h1>
            <p className="text-xs font-medium text-slate-500">{inchargeBranches.join(', ')} Branch Portal</p>
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
            onClick={handleLogoutClick}
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
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending</p>
              <p className="text-lg font-bold text-slate-900">{applications.filter(a => a.status === 'pending_branch').length} Applications</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved</p>
              <p className="text-lg font-bold text-slate-900">{applications.filter(a => ['pending_super', 'pending_chairman', 'approved'].includes(a.status)).length} Applications</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600">
              <CloseIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rejected</p>
              <p className="text-lg font-bold text-slate-900">{applications.filter(a => a.status === 'rejected').length} Applications</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => setActiveTab('students')}
            className={`px-8 py-4 text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'students' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Students ({studentsList.length})
          </button>
          <button 
            onClick={() => setActiveTab('applications')}
            className={`px-8 py-4 text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'applications' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Fee Applications ({applications.length})
          </button>
          <button 
            onClick={() => setActiveTab('attendance')}
            className={`px-8 py-4 text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'attendance' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Today's Attendance ({attendanceLogs.length})
          </button>
          <button 
            onClick={() => setActiveTab('notices')}
            className={`px-8 py-4 text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'notices' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Notices ({notices.length})
          </button>
        </div>

        {/* Table Controls */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder={`Search by Name, Father's Name, Email, Mobile, College, Branch...`}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 focus:border-slate-300 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-5 h-5 text-slate-400" />
            <select 
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-100 focus:border-slate-300 outline-none transition-all bg-white text-sm font-medium"
            >
              <option value="All">All My Branches</option>
              {inchargeBranches.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {activeTab === 'students' && (
            <div className="flex items-center gap-2 w-full md:w-auto">
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 rounded-xl border border-slate-100 focus:border-slate-300 outline-none transition-all bg-white text-sm font-medium"
              >
                <option value="All">All Status</option>
                <option value="Logged In">Active</option>
                <option value="Not Logged In">Pending</option>
              </select>
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="w-5 h-5 text-slate-400" />
              <select 
                value={appFilter}
                onChange={(e) => setAppFilter(e.target.value)}
                className="px-4 py-3 rounded-xl border border-slate-100 focus:border-slate-300 outline-none transition-all bg-white text-sm font-medium"
              >
                <option value="All">All Status</option>
                <option value="pending_branch">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          )}
        </div>

        {/* List Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {activeTab === 'students' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">SID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Trust Branch</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Info</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Signup Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider"></th>
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
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                            {student.photo_url ? (
                              <img 
                                src={student.photo_url} 
                                alt={student.full_name} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.full_name)}&background=random`;
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Users className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{student.full_name}</p>
                            <p className="text-xs text-slate-500">{student.mobile_number}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-sm font-medium text-slate-700">{student.trust_branch}</span>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-sm font-medium text-slate-700">
                          {student.college_name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {student.branch}
                        </p>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{student.created_at ? new Date(student.created_at).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          student.status === 'Pending' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {student.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <button 
                          onClick={() => setSelectedStudent(student)}
                          className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'applications' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">College</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Request For</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
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
                        <p className="text-sm font-medium text-slate-700">{app.college_name}</p>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-sm font-medium text-slate-700">{app.requesting_for}</p>
                      </td>
                      <td className="px-6 py-6">
                        <span className="font-bold text-slate-900">N/A</span>
                      </td>
                      <td className="px-6 py-6 text-sm text-slate-500">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          app.status === 'pending_branch' ? 'bg-orange-50 text-orange-600' : 
                          app.status === 'pending_super' ? 'bg-blue-50 text-blue-600' :
                          app.status === 'pending_chairman' ? 'bg-indigo-50 text-indigo-600' :
                          app.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                          'bg-red-50 text-red-600'
                        }`}>
                          {app.status === 'pending_branch' ? 'Pending Branch' : 
                           app.status === 'pending_super' ? 'Pending Super' : 
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
                          {app.status === 'pending_branch' && (
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
          ) : activeTab === 'attendance' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">SID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">College</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {attendanceLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                        No attendance marked for today yet.
                      </td>
                    </tr>
                  ) : (
                    attendanceLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-6">
                          <p className="font-bold text-slate-900">{(log.students as any)?.full_name || 'Unknown'}</p>
                        </td>
                        <td className="px-6 py-6">
                          <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                            {(log.students as any)?.trust_id || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-6">
                          <p className="text-sm text-slate-600">{(log.students as any)?.college_name || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-6 text-sm text-slate-500">
                          {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-6">
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Present
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8">
              <div className="grid grid-cols-1 gap-6">
                {notices.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No notices for your branch yet.</p>
                  </div>
                ) : (
                  notices.map((notice) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={notice.id} 
                      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 mb-1">{notice.title}</h3>
                          <p className="text-xs text-slate-400 font-medium">
                            {new Date(notice.created_at).toLocaleDateString()} • From Chairman
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {notice.branches.map(b => (
                            <span key={b} className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded-full text-[10px] font-bold uppercase">
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{notice.content}</p>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>

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
              <p className="text-slate-500 mb-8">Are you sure you want to logout from the Incharge dashboard?</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmLogout}
                  className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">College</p>
                    <p className="font-bold text-slate-900">{selectedApp.college_name}</p>
                  </div>
                </div>

                {selectedApp.file_url && (
                  <div className="space-y-4">
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
                  </div>
                )}
              </div>

              {selectedApp.status === 'pending_branch' && (
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
                    onClick={() => {
                      setShowApprovalModal(true);
                    }}
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
              <p className="text-sm text-slate-500 mb-4">Add a comment for the Super Incharge (Optional):</p>
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

      {/* Student Detail Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-emerald-400" />
                  <h2 className="text-xl font-bold">Student Profile</h2>
                </div>
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <div className="flex flex-col items-center mb-8">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-lg mb-4">
                    {selectedStudent.photo_url ? (
                      <img 
                        src={selectedStudent.photo_url} 
                        alt={selectedStudent.full_name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Users className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{selectedStudent.full_name}</h3>
                  <p className="text-emerald-600 font-bold">{selectedStudent.trust_id}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Personal Information</p>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Father's Name</p>
                            <p className="text-sm font-bold text-slate-700">{selectedStudent.father_name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Email Address</p>
                            <p className="text-sm font-bold text-slate-700">{selectedStudent.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                            <Phone className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Phone Number</p>
                            <p className="text-sm font-bold text-slate-700">{selectedStudent.mobile_number}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Academic Information</p>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                            <Receipt className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">College Name</p>
                            <p className="text-sm font-bold text-slate-700">{selectedStudent.college_name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Branch</p>
                            <p className="text-sm font-bold text-slate-700">{selectedStudent.branch}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}