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
  MessageSquare,
  GraduationCap,
  School,
  User,
  Trash2,
  Pencil,
  Camera
} from 'lucide-react';
import FaceRegistration from './FaceRegistration';

const PSS_LOGO = "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/a84f56a0-4104-45b1-8c19-e9d129a3f77f.jpg";

interface Student {
  id: string;
  trust_id: string;
  full_name: string;
  father_name: string;
  mother_name?: string;
  father_mobile?: string;
  mother_mobile?: string;
  dob?: string;
  gender?: string;
  email: string;
  mobile_number: string;
  address?: string;
  trust_branch?: string;
  ssc_school?: string;
  ssc_board?: string;
  ssc_year?: number;
  ssc_percentage?: number;
  course_type?: 'diploma' | 'btech';
  college_name: string;
  branch: string;
  year_of_joining?: number;
  pin_number?: string;
  diploma_percentage?: number;
  btech_college?: string;
  btech_year?: string;
  btech_branch?: string;
  btech_pin?: string;
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
  trust_attendance?: string;
  college_attendance?: string;
  academic_year?: string;
  ceep_rank?: string;
  ecet_rank?: string;
  phone_no?: string;
  pin_no?: string;
  date?: string;
  live_trust_attendance?: number | null;
  father_mobile?: string;
  mother_mobile?: string;
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
  const [appFilter, setAppFilter] = useState('pending_super');
  const [activeTab, setActiveTab] = useState<'students' | 'applications'>('applications');
  const [applications, setApplications] = useState<FeeApplication[]>([]);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [selectedApp, setSelectedApp] = useState<FeeApplication | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [approvalComment, setApprovalComment] = useState('');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRecapture, setShowRecapture] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [assignedBranches, setAssignedBranches] = useState<string[]>([]);
  const [allBranches, setAllBranches] = useState<string[]>([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [{ data: authData }, bResp] = await Promise.all([
        supabase.auth.getUser(),
        fetch('/api/branches')
      ]);

      const bData = await bResp.json();
      if (bData.success && bData.branches) {
        setAllBranches(bData.branches.map((b: any) => b.name));
      }

      let branches: string[] = [];
      const user = authData.user;
      if (user) {
        const { data: inchargeData } = await supabase
          .from('incharges')
          .select('branch')
          .eq('id', user.id)
          .single();
        
        if (inchargeData?.branch) {
          branches = inchargeData.branch.split(',').map((b: string) => b.trim());
          setAssignedBranches(branches);
        }
      }
      await fetchData(branches);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async (branches: string[]) => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchStudents(branches),
        fetchApplications(branches)
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async (branches: string[]) => {
    try {
      let query = supabase
        .from('students')
        .select('*');
      
      if (branches.length > 0) {
        query = query.in('trust_branch', branches);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setStudentsList(data || []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    setIsUpdating(editingStudent.id);
    try {
      const { error } = await supabase
        .from('students')
        .update({
          full_name: editingStudent.full_name,
          father_name: editingStudent.father_name,
          mother_name: editingStudent.mother_name,
          father_mobile: editingStudent.father_mobile,
          mother_mobile: editingStudent.mother_mobile,
          dob: editingStudent.dob,
          gender: editingStudent.gender,
          email: editingStudent.email,
          mobile_number: editingStudent.mobile_number,
          address: editingStudent.address,
          trust_branch: editingStudent.trust_branch,
          ssc_school: editingStudent.ssc_school,
          ssc_board: editingStudent.ssc_board,
          ssc_year: editingStudent.ssc_year,
          ssc_percentage: editingStudent.ssc_percentage,
          course_type: editingStudent.course_type,
          college_name: editingStudent.college_name,
          branch: editingStudent.branch,
          year_of_joining: editingStudent.year_of_joining,
          pin_number: editingStudent.pin_number,
          diploma_percentage: editingStudent.diploma_percentage,
          btech_college: editingStudent.btech_college,
          btech_year: editingStudent.btech_year,
          btech_branch: editingStudent.btech_branch,
          btech_pin: editingStudent.btech_pin,
          status: editingStudent.status
        })
        .eq('id', editingStudent.id);

      if (error) throw error;

      setStudentsList(prev => prev.map(s => s.id === editingStudent.id ? editingStudent : s));
      setEditingStudent(null);
      alert('Student updated successfully!');
    } catch (error: any) {
      console.error('Update student error:', error);
      alert('Error updating student: ' + error.message);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStudentsList(prev => prev.filter(s => s.id !== id));
      alert('Student deleted successfully!');
    } catch (error: any) {
      console.error('Delete student error:', error);
      alert('Error deleting student: ' + error.message);
    }
  };

  const fetchApplications = async (branches: string[]) => {
    try {
      let query = supabase
        .from('applications')
        .select('*, students!applications_student_id_fkey(trust_attendance_percentage, father_mobile, mother_mobile)');
      
      if (branches.length > 0) {
        query = query.in('trust_branch', branches);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        // Fallback without join
        let q2 = supabase.from('applications').select('*');
        if (branches.length > 0) q2 = q2.in('trust_branch', branches);
        const { data: fallback, error: e2 } = await q2.order('created_at', { ascending: false });
        if (e2) throw e2;
        setApplications(fallback || []);
        return;
      }

      const enriched = (data || []).map((app: any) => ({
        ...app,
        live_trust_attendance: app.students?.trust_attendance_percentage ?? null,
        father_mobile: app.students?.father_mobile ?? null,
        mother_mobile: app.students?.mother_mobile ?? null,
      }));
      setApplications(enriched);
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
    
    const matchesBranch = branchFilter === 'All' 
      ? (assignedBranches.length > 0 ? assignedBranches.includes(s.trust_branch || '') : true)
      : s.trust_branch === branchFilter;
    return matchesSearch && matchesBranch;
  });

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.student_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter === 'All'
      ? (assignedBranches.length > 0 ? assignedBranches.includes(app.trust_branch || '') : true)
      : app.trust_branch === branchFilter;
    const matchesStatus = appFilter === 'All' || app.status === appFilter;
    return matchesSearch && matchesBranch && matchesStatus;
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
        <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => setActiveTab('applications')}
            className={`px-8 py-4 text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'applications' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Fee Applications ({filteredApps.length})
          </button>
          <button 
            onClick={() => setActiveTab('students')}
            className={`px-8 py-4 text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'students' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
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
            <option value="All">All My Branches</option>
            {(assignedBranches.length > 0 ? assignedBranches : allBranches).map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          {activeTab === 'applications' && (
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="w-5 h-5 text-slate-400" />
              <select 
                value={appFilter}
                onChange={(e) => setAppFilter(e.target.value)}
                className="px-4 py-3 rounded-xl border border-slate-100 focus:border-slate-300 outline-none transition-all bg-white text-sm font-medium"
              >
                <option value="All">All Status</option>
                <option value="pending_branch">Pending Branch</option>
                <option value="pending_super">Pending Super</option>
                <option value="pending_chairman">Pending Chairman</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          )}
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
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedStudent(student)}
                            className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                            title="View Profile"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => setEditingStudent(student)}
                            className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                            title="Edit Student"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteStudent(student.id)}
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                            title="Delete Student"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
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

                {/* ── Section 1: Basic Info ── */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-4 h-px bg-slate-300 inline-block"></span>Student Info
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</p>
                      <p className="font-bold text-slate-900 text-sm">{selectedApp.full_name}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">SID</p>
                      <p className="font-bold text-slate-900 text-sm">{selectedApp.student_id}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Trust Branch</p>
                      <p className="font-bold text-slate-900 text-sm">{selectedApp.trust_branch || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">College Name</p>
                      <p className="font-bold text-slate-900 text-sm">{selectedApp.college_name || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Pin Number</p>
                      <p className="font-bold text-slate-900 text-sm">{selectedApp.pin_no || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Phone</p>
                      <p className="font-bold text-slate-900 text-sm">{selectedApp.phone_no || (selectedApp as any).phone_number || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Email</p>
                      <p className="font-bold text-slate-900 text-sm break-all">{selectedApp.email || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Father Mobile</p>
                      <p className="font-bold text-slate-900 text-sm">{selectedApp.father_mobile || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Mother Mobile</p>
                      <p className="font-bold text-slate-900 text-sm">{selectedApp.mother_mobile || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Requesting For</p>
                      <p className="font-bold text-slate-900 text-sm">{selectedApp.requesting_for || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Date</p>
                      <p className="font-bold text-slate-900 text-sm">{selectedApp.date || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* ── Section 2: Attendance & Academic Year ── */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-4 h-px bg-slate-300 inline-block"></span>Attendance & Academics
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                      <p className="text-[10px] font-bold text-emerald-500 uppercase mb-1">Trust Att. % (Live)</p>
                      <p className="font-bold text-emerald-700 text-lg">
                        {selectedApp.live_trust_attendance !== null && selectedApp.live_trust_attendance !== undefined
                          ? `${parseFloat(String(selectedApp.live_trust_attendance)).toFixed(1)}%`
                          : selectedApp.trust_attendance || 'N/A'}
                      </p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">College Att. %</p>
                      <p className="font-bold text-slate-900 text-sm">{selectedApp.college_attendance || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Academic Year</p>
                      <p className="font-bold text-slate-900 text-sm">{selectedApp.academic_year || 'N/A'}</p>
                    </div>
                    {selectedApp.ceep_rank ? (
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">CEEP Rank</p>
                        <p className="font-bold text-slate-900 text-sm">{selectedApp.ceep_rank}</p>
                      </div>
                    ) : null}
                    {selectedApp.ecet_rank ? (
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">ECET Rank</p>
                        <p className="font-bold text-slate-900 text-sm">{selectedApp.ecet_rank}</p>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* ── Section 3: Academic Records Table ── */}
                {selectedApp.academic_records && selectedApp.academic_records.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-4 h-px bg-slate-300 inline-block"></span>Academic Performance
                    </p>
                    <div className="overflow-x-auto rounded-xl border border-slate-100">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="bg-slate-50">
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase border-b border-slate-100">Semester / Year</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase border-b border-slate-100">GPA / CGPA</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase border-b border-slate-100">Backlogs</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedApp.academic_records.map((rec: any, idx: number) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                              <td className="px-4 py-3 font-medium text-slate-700 border-b border-slate-50">{rec.semester || '-'}</td>
                              <td className="px-4 py-3 text-slate-700 border-b border-slate-50">{rec.gpa || '-'}</td>
                              <td className="px-4 py-3 border-b border-slate-50">
                                <span className={`font-bold ${parseInt(rec.backlogs) > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                                  {rec.backlogs || '0'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ── Section 4: Contribution ── */}
                {selectedApp.contribution && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-4 h-px bg-slate-300 inline-block"></span>Contribution to Trust
                    </p>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-sm text-slate-700 leading-relaxed">{selectedApp.contribution}</p>
                    </div>
                  </div>
                )}

                {/* ── Section 5: Attached Document ── */}
                {selectedApp.file_url && (
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-4 h-px bg-slate-300 inline-block"></span>Attached Document
                    </p>
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-emerald-900">Request Letter / Supporting Document</p>
                        <p className="text-xs text-emerald-600">Click to open in new tab</p>
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

                {/* ── Section 6: Approval History ── */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-4 h-px bg-slate-300 inline-block"></span>Approval History
                  </p>
                  <div className="space-y-3">
                    {selectedApp.branch_incharge_comment ? (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Branch Incharge Comment</p>
                        <p className="text-sm text-slate-700 italic">"{selectedApp.branch_incharge_comment}"</p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No comments from branch incharge.</p>
                    )}
                  </div>
                </div>

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
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
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
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-lg flex-shrink-0">
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
                  <div className="text-center md:text-left pt-4">
                    <h3 className="text-3xl font-bold text-slate-900 mb-1">{selectedStudent.full_name}</h3>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 font-bold rounded-full text-sm">
                        {selectedStudent.trust_id}
                      </span>
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 font-bold rounded-full text-sm">
                        {selectedStudent.trust_branch} Branch
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                        selectedStudent.status === 'Pending' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {selectedStudent.status || 'Active'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-slate-400 mb-4">
                      <User className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Personal Details</span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Father's Name</p>
                        <p className="text-sm font-bold text-slate-700">{selectedStudent.father_name}</p>
                        {selectedStudent.father_mobile && (
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {selectedStudent.father_mobile}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Mother's Name</p>
                        <p className="text-sm font-bold text-slate-700">{selectedStudent.mother_name || 'N/A'}</p>
                        {selectedStudent.mother_mobile && (
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {selectedStudent.mother_mobile}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Date of Birth</p>
                        <p className="text-sm font-bold text-slate-700">{selectedStudent.dob || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Gender</p>
                        <p className="text-sm font-bold text-slate-700 capitalize">{selectedStudent.gender || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Contact</p>
                        <p className="text-sm font-bold text-slate-700">{selectedStudent.mobile_number}</p>
                        <p className="text-xs text-slate-500">{selectedStudent.email}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Address</p>
                        <p className="text-sm font-medium text-slate-700 leading-relaxed">{selectedStudent.address || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-slate-400 mb-4">
                      <GraduationCap className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">Academic Details</span>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Current Course</p>
                        <p className="text-sm font-bold text-slate-900 capitalize">{selectedStudent.course_type}</p>
                        <p className="text-xs text-slate-600 mt-1">{selectedStudent.college_name}</p>
                        <p className="text-xs text-slate-500">{selectedStudent.branch}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2">JOINED: {selectedStudent.year_of_joining}</p>
                      </div>

                      {selectedStudent.course_type === 'diploma' ? (
                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                          <p className="text-[10px] text-blue-400 font-bold uppercase mb-2">Diploma Info</p>
                          <p className="text-sm font-bold text-blue-900">PIN: {selectedStudent.pin_number}</p>
                          <p className="text-sm font-bold text-blue-900">Percentage: {selectedStudent.diploma_percentage}%</p>
                        </div>
                      ) : (
                        <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                          <p className="text-[10px] text-purple-400 font-bold uppercase mb-2">B.Tech Info</p>
                          <p className="text-sm font-bold text-purple-900">{selectedStudent.btech_college}</p>
                          <p className="text-xs text-purple-600">{selectedStudent.btech_branch} - {selectedStudent.btech_year} Year</p>
                          {selectedStudent.btech_pin && (
                            <p className="text-[10px] text-purple-400 mt-1">PIN: {selectedStudent.btech_pin}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SSC Details */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-slate-400 mb-4">
                      <School className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-widest">SSC Details</span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">School Name</p>
                        <p className="text-sm font-bold text-slate-700">{selectedStudent.ssc_school || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Board</p>
                        <p className="text-sm font-bold text-slate-700">{selectedStudent.ssc_board || 'N/A'}</p>
                      </div>
                      <div className="flex gap-8">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Year</p>
                          <p className="text-sm font-bold text-slate-700">{selectedStudent.ssc_year || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Percentage</p>
                          <p className="text-sm font-bold text-slate-700">{selectedStudent.ssc_percentage}%</p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Registration Date</p>
                        <p className="text-sm font-bold text-slate-700">
                          {selectedStudent.created_at ? new Date(selectedStudent.created_at).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => {
                    setEditingStudent(selectedStudent);
                    setSelectedStudent(null);
                  }}
                  className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Student Modal */}
      <AnimatePresence>
        {editingStudent && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 lg:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingStudent(null)}
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
                  <Pencil className="w-6 h-6 text-emerald-400" />
                  <h2 className="text-xl font-bold">Edit Student Profile</h2>
                </div>
                <button 
                  onClick={() => setEditingStudent(null)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateStudent} className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Personal Details */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" />
                      Personal Details
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowRecapture(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all text-xs font-bold"
                    >
                      <Camera className="w-4 h-4" />
                      Recapture Face
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                      <input 
                        type="text" required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all font-medium"
                        value={editingStudent.full_name}
                        onChange={(e) => setEditingStudent({...editingStudent, full_name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Father's Name</label>
                      <input 
                        type="text" required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all font-medium"
                        value={editingStudent.father_name}
                        onChange={(e) => setEditingStudent({...editingStudent, father_name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Father Mobile</label>
                      <input 
                        type="tel"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all font-medium"
                        value={editingStudent.father_mobile || ''}
                        onChange={(e) => setEditingStudent({...editingStudent, father_mobile: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Mother's Name</label>
                      <input 
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all font-medium"
                        value={editingStudent.mother_name || ''}
                        onChange={(e) => setEditingStudent({...editingStudent, mother_name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Mother Mobile</label>
                      <input 
                        type="tel"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all font-medium"
                        value={editingStudent.mother_mobile || ''}
                        onChange={(e) => setEditingStudent({...editingStudent, mother_mobile: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">DOB</label>
                      <input 
                        type="date" required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all font-medium"
                        value={editingStudent.dob || ''}
                        onChange={(e) => setEditingStudent({...editingStudent, dob: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Gender</label>
                      <select 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all font-medium"
                        value={editingStudent.gender || 'male'}
                        onChange={(e) => setEditingStudent({...editingStudent, gender: e.target.value})}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Mobile</label>
                      <input 
                        type="tel" required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all font-medium"
                        value={editingStudent.mobile_number}
                        onChange={(e) => setEditingStudent({...editingStudent, mobile_number: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
                      <input 
                        type="email" required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all font-medium"
                        value={editingStudent.email}
                        onChange={(e) => setEditingStudent({...editingStudent, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase">Trust Branch</label>
                       <select 
                         className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all font-medium"
                         value={editingStudent.trust_branch || ''}
                         onChange={(e) => setEditingStudent({...editingStudent, trust_branch: e.target.value})}
                       >
                         <option value="">Select Branch</option>
                         {(assignedBranches.length > 0 ? assignedBranches : allBranches).map(b => (
                           <option key={b} value={b}>{b}</option>
                         ))}
                       </select>
                     </div>
                    <div className="md:col-span-3 space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Address</label>
                      <textarea 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all font-medium resize-none"
                        rows={2}
                        value={editingStudent.address || ''}
                        onChange={(e) => setEditingStudent({...editingStudent, address: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* SSC Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <School className="w-4 h-4 text-green-500" />
                    SSC Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">School Name</label>
                      <input 
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all font-medium"
                        value={editingStudent.ssc_school || ''}
                        onChange={(e) => setEditingStudent({...editingStudent, ssc_school: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Board</label>
                      <input 
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all font-medium"
                        value={editingStudent.ssc_board || ''}
                        onChange={(e) => setEditingStudent({...editingStudent, ssc_board: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Year</label>
                      <input 
                        type="number"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all font-medium"
                        value={editingStudent.ssc_year || ''}
                        onChange={(e) => setEditingStudent({...editingStudent, ssc_year: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Percentage</label>
                      <input 
                        type="number" step="0.01"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all font-medium"
                        value={editingStudent.ssc_percentage || ''}
                        onChange={(e) => setEditingStudent({...editingStudent, ssc_percentage: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-purple-500" />
                    Academic Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Course Type</label>
                      <select 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all font-medium"
                        value={editingStudent.course_type || 'diploma'}
                        onChange={(e) => setEditingStudent({...editingStudent, course_type: e.target.value as any})}
                      >
                        <option value="diploma">Diploma</option>
                        <option value="btech">B.Tech</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">College Name</label>
                      <input 
                        type="text" required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all font-medium"
                        value={editingStudent.college_name}
                        onChange={(e) => setEditingStudent({...editingStudent, college_name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Branch</label>
                      <input 
                        type="text" required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all font-medium"
                        value={editingStudent.branch}
                        onChange={(e) => setEditingStudent({...editingStudent, branch: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Joining Year</label>
                      <input 
                        type="number" required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all font-medium"
                        value={editingStudent.year_of_joining || ''}
                        onChange={(e) => setEditingStudent({...editingStudent, year_of_joining: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Status</label>
                      <select 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all font-medium"
                        value={editingStudent.status || 'Active'}
                        onChange={(e) => setEditingStudent({...editingStudent, status: e.target.value})}
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </div>
                  </div>

                  {editingStudent.course_type === 'diploma' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-blue-400 uppercase">PIN Number</label>
                        <input 
                          type="text"
                          className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:border-blue-900 outline-none transition-all font-medium"
                          value={editingStudent.pin_number || ''}
                          onChange={(e) => setEditingStudent({...editingStudent, pin_number: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-blue-400 uppercase">Diploma %</label>
                        <input 
                          type="number" step="0.01"
                          className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:border-blue-900 outline-none transition-all font-medium"
                          value={editingStudent.diploma_percentage || ''}
                          onChange={(e) => setEditingStudent({...editingStudent, diploma_percentage: parseFloat(e.target.value)})}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-purple-400 uppercase">B.Tech College</label>
                        <input 
                          type="text"
                          className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-purple-900 outline-none transition-all font-medium"
                          value={editingStudent.btech_college || ''}
                          onChange={(e) => setEditingStudent({...editingStudent, btech_college: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-purple-400 uppercase">Current Year</label>
                        <select 
                          className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-purple-900 outline-none transition-all font-medium"
                          value={editingStudent.btech_year || '1st'}
                          onChange={(e) => setEditingStudent({...editingStudent, btech_year: e.target.value})}
                        >
                          <option value="1st">1st Year</option>
                          <option value="2nd">2nd Year</option>
                          <option value="3rd">3rd Year</option>
                          <option value="4th">4th Year</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-purple-400 uppercase">B.Tech Branch</label>
                        <input 
                          type="text"
                          className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-purple-900 outline-none transition-all font-medium"
                          value={editingStudent.btech_branch || ''}
                          onChange={(e) => setEditingStudent({...editingStudent, btech_branch: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-purple-400 uppercase">B.Tech Pin Number</label>
                        <input 
                          type="text"
                          className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-purple-900 outline-none transition-all font-medium"
                          value={editingStudent.btech_pin || ''}
                          onChange={(e) => setEditingStudent({...editingStudent, btech_pin: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isUpdating === editingStudent.id}
                    className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isUpdating === editingStudent.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Face Recapture Modal */}
      <AnimatePresence>
        {showRecapture && editingStudent && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRecapture(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <div className="relative w-full max-w-md">
              <button 
                onClick={() => setShowRecapture(false)}
                className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
              <FaceRegistration 
                studentId={editingStudent.id}
                onComplete={() => {
                  setShowRecapture(false);
                  fetchStudents(assignedBranches);
                  alert('Face recaptured successfully!');
                }}
              />
            </div>
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