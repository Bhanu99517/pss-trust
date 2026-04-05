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
  User,
  GraduationCap,
  School
} from 'lucide-react';

const PSS_LOGO = "https://v0-ngo-app-for-studies.vercel.app/images/pss-logo.png";

interface Student {
  id: string;
  trust_id: string;
  full_name: string;
  father_name: string;
  mother_name?: string;
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
  university_name?: string;
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
  created_at: string;
}

interface ChairmanDashboardProps {
  students: Student[];
  onLogout: () => void;
  onChangePassword: () => void;
}

export default function ChairmanDashboard({ students, onLogout, onChangePassword }: ChairmanDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<'students' | 'applications' | 'attendance' | 'incharges'>('students');
  const [applications, setApplications] = useState<FeeApplication[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([]);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [incharges, setIncharges] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<FeeApplication | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAddIncharge, setShowAddIncharge] = useState(false);
  const [newIncharge, setNewIncharge] = useState({ email: '', fullName: '', branch: '', password: '' });
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isFixing, setIsFixing] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchApplications();
    fetchAttendanceLogs();
    fetchIncharges();
  }, []);

  const fetchIncharges = async () => {
    try {
      const { data, error } = await supabase
        .from('incharges')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIncharges(data || []);
    } catch (error) {
      console.error('Failed to fetch incharges:', error);
    }
  };

  const handleAddIncharge = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating('adding-incharge');
    try {
      // 1. Create Auth User (This might fail if no service role key, but we'll try)
      // Actually, we'll use a server endpoint for this to be safe
      const response = await fetch('/api/create-incharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIncharge),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Failed to create incharge');

      alert('Incharge account created successfully!');
      setShowAddIncharge(false);
      setNewIncharge({ email: '', fullName: '', branch: '', password: '' });
      fetchIncharges();
    } catch (error: any) {
      console.error('Add incharge error:', error);
      alert('Error: ' + error.message);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteIncharge = async (id: string, email: string) => {
    if (!window.confirm(`Are you sure you want to delete incharge ${email}?`)) return;

    try {
      const response = await fetch(`/api/delete-incharge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, email }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Failed to delete incharge');

      setIncharges(prev => prev.filter(i => i.id !== id));
      alert('Incharge deleted successfully!');
    } catch (error: any) {
      console.error('Delete incharge error:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
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

  const fetchAttendanceLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*, students(full_name, trust_id, college_name)')
        .gte('created_at', new Date().toISOString().split('T')[0])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAttendanceLogs(data || []);
    } catch (error) {
      console.error('Failed to fetch attendance logs:', error);
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

  const fixLegacyUrls = async () => {
    setIsFixing(true);
    try {
      const { data: apps, error: fetchError } = await supabase
        .from('applications')
        .select('id, file_url')
        .is('file_url', null);

      if (fetchError) throw fetchError;
      alert(`Found ${apps?.length || 0} applications to fix.`);
    } catch (error: any) {
      console.error('Fix URLs error:', error);
      alert('Error fixing URLs: ' + error.message);
    } finally {
      setIsFixing(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setIsUpdating(id);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
      alert(`Application ${status}!`);
    } catch (error: any) {
      console.error('Update status error:', error);
      alert('Error updating status: ' + error.message);
    } finally {
      setIsUpdating(null);
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
          university_name: editingStudent.university_name,
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
    const isVisibleToChairman = app.status !== 'pending_incharge';
    return matchesSearch && matchesBranch && isVisibleToChairman;
  });

  const filteredAttendance = attendanceLogs.filter(log => {
    const student = log.students as any;
    const matchesSearch = 
      student?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.trust_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBranch = branchFilter === 'All' || student?.trust_branch === branchFilter;
    
    return matchesSearch && matchesBranch;
  });

  const filteredIncharges = incharges.filter(i => {
    const matchesSearch = 
      i.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBranch = branchFilter === 'All' || i.branch === branchFilter;
    
    return matchesSearch && matchesBranch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-slate-200 px-4 lg:px-8 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <img src={PSS_LOGO} alt="PSS Logo" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">PSS Admin Dashboard</h1>
            <p className="text-xs font-medium text-slate-500">Chairman: Dr (H.C) P Srinivas</p>
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
              <p className="text-lg font-bold text-slate-900">{applications.filter(a => a.status === 'pending_chairman').length} Applications</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Accepted</p>
              <p className="text-lg font-bold text-slate-900">{applications.filter(a => a.status === 'approved').length} Applications</p>
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
        <div className="flex border-b border-slate-200">
          <button 
            onClick={() => { setActiveTab('students'); setBranchFilter('All'); setFilter('All'); }}
            className={`px-8 py-4 text-sm font-bold transition-all ${activeTab === 'students' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Students ({studentsList.length})
          </button>
          <button 
            onClick={() => { setActiveTab('applications'); setBranchFilter('All'); setFilter('All'); }}
            className={`px-8 py-4 text-sm font-bold transition-all ${activeTab === 'applications' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Fee Applications ({applications.length})
          </button>
          <button 
            onClick={() => { setActiveTab('attendance'); setBranchFilter('All'); setFilter('All'); }}
            className={`px-8 py-4 text-sm font-bold transition-all ${activeTab === 'attendance' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Today's Attendance ({attendanceLogs.length})
          </button>
          <button 
            onClick={() => { setActiveTab('incharges'); setBranchFilter('All'); setFilter('All'); }}
            className={`px-8 py-4 text-sm font-bold transition-all ${activeTab === 'incharges' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Manage Incharges ({incharges.length})
          </button>
        </div>

        {/* Table Controls */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder={`Search...`}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 focus:border-slate-300 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            {activeTab === 'students' && (
              <select 
                className="px-4 py-2 rounded-xl border border-slate-100 focus:border-slate-300 outline-none transition-all text-sm font-medium bg-slate-50"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Logged In">Active</option>
                <option value="Not Logged In">Pending</option>
              </select>
            )}

            {(activeTab === 'students' || activeTab === 'attendance' || activeTab === 'incharges') && (
              <select 
                className="px-4 py-2 rounded-xl border border-slate-100 focus:border-slate-300 outline-none transition-all text-sm font-medium bg-slate-50"
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
              >
                <option value="All">All Branches</option>
                {activeTab === 'incharges' ? (
                  ['BHEL', 'Bollaram', 'MYP', 'MKR', 'ECIL'].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))
                ) : (
                  ['BHEL', 'Bollaram', 'MYP', 'MKR', 'ECIL'].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))
                )}
              </select>
            )}
          </div>

          {activeTab === 'incharges' && (
            <button 
              onClick={() => setShowAddIncharge(true)}
              className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap"
            >
              <Users className="w-4 h-4" />
              <span>Add New Incharge</span>
            </button>
          )}
        </div>

        {/* List Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {activeTab === 'students' ? (
            <div className="overflow-x-auto">
              {/* ... existing students table ... */}
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
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedStudent(student)}
                            className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                            title="View Details"
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
          ) : activeTab === 'applications' ? (
            <div className="overflow-x-auto">
              {/* ... applications table ... */}
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
                          app.status === 'pending_chairman' ? 'bg-orange-50 text-orange-600' : 
                          app.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                          'bg-red-50 text-red-600'
                        }`}>
                          {app.status === 'pending_chairman' ? 'Pending Chairman' : app.status}
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
                          {app.status === 'pending_chairman' && (
                            <>
                              <button 
                                onClick={() => handleUpdateStatus(app.id, 'approved')}
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
                  {filteredAttendance.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                        No attendance marked for today yet.
                      </td>
                    </tr>
                  ) : (
                    filteredAttendance.map((log) => (
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
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Branch</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Created At</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredIncharges.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                        No incharges added yet.
                      </td>
                    </tr>
                  ) : (
                    filteredIncharges.map((incharge) => (
                      <tr key={incharge.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-6 font-bold text-slate-900">{incharge.full_name}</td>
                        <td className="px-6 py-6 text-slate-600">{incharge.email}</td>
                        <td className="px-6 py-6">
                          <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                            {incharge.branch}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-sm text-slate-500">
                          {new Date(incharge.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-6 text-right">
                          <button 
                            onClick={() => handleDeleteIncharge(incharge.id, incharge.email)}
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                            title="Delete Incharge"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add Incharge Modal */}
      <AnimatePresence>
        {showAddIncharge && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddIncharge(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Add New Incharge</h3>
                <button onClick={() => setShowAddIncharge(false)} className="text-slate-400 hover:text-slate-600">
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleAddIncharge} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all"
                    value={newIncharge.fullName}
                    onChange={(e) => setNewIncharge({...newIncharge, fullName: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all"
                    value={newIncharge.email}
                    onChange={(e) => setNewIncharge({...newIncharge, email: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Branch</label>
                  <select 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all"
                    value={newIncharge.branch}
                    onChange={(e) => setNewIncharge({...newIncharge, branch: e.target.value})}
                  >
                    <option value="">Select Branch</option>
                    <option value="BHEL">BHEL</option>
                    <option value="Bollaram">Bollaram</option>
                    <option value="MYP">MYP</option>
                    <option value="MKR">MKR</option>
                    <option value="ECIL">ECIL</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
                  <input 
                    type="password" 
                    required
                    minLength={6}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all"
                    value={newIncharge.password}
                    onChange={(e) => setNewIncharge({...newIncharge, password: e.target.value})}
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={isUpdating === 'adding-incharge'}
                  className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isUpdating === 'adding-incharge' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                </button>
              </form>
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
                {/* Request Form Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-slate-400">
                    <FileText className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Student Request Form</span>
                  </div>
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
                      {selectedApp.phone_number && (
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Phone</p>
                          <p className="font-bold text-slate-900">{selectedApp.phone_number}</p>
                        </div>
                      )}
                      {selectedApp.email && (
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Email</p>
                          <p className="font-bold text-slate-900">{selectedApp.email}</p>
                        </div>
                      )}
                    </div>

                    {selectedApp.academic_records && selectedApp.academic_records.length > 0 && (
                      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Academic Records</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {selectedApp.academic_records.map((rec, i) => (
                            <div key={i} className="bg-white p-3 rounded-xl border border-slate-100">
                              <p className="text-[10px] font-bold text-slate-400 uppercase">{rec.semester}</p>
                              <div className="flex justify-between items-end mt-1">
                                <span className="text-sm font-bold text-slate-900">GPA: {rec.gpa}</span>
                                <span className="text-[10px] text-red-500 font-bold">BK: {rec.backlogs}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Contribution towards Trust</h4>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-700 leading-relaxed italic">
                      "{selectedApp.contribution}"
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
                      
                      <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-100">
                        <iframe 
                          src={selectedApp.file_url} 
                          className="w-full h-[400px] border-none"
                          title="Document Preview"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedApp.status === 'pending_chairman' && (
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                  <button 
                    onClick={() => {
                      handleUpdateStatus(selectedApp.id, 'rejected');
                      setSelectedApp(null);
                    }}
                    className="px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-white transition-all"
                  >
                    Reject Application
                  </button>
                  <button 
                    onClick={() => {
                      handleUpdateStatus(selectedApp.id, 'approved');
                      setSelectedApp(null);
                    }}
                    className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                  >
                    Accept & Notify Student
                  </button>
                </div>
              )}
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
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Mother's Name</p>
                        <p className="text-sm font-bold text-slate-700">{selectedStudent.mother_name || 'N/A'}</p>
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
                          {selectedStudent.university_name && (
                            <p className="text-[10px] text-purple-400 mt-1">{selectedStudent.university_name}</p>
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
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    Personal Details
                  </h3>
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
                      <label className="text-xs font-bold text-slate-400 uppercase">Mother's Name</label>
                      <input 
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-900 outline-none transition-all font-medium"
                        value={editingStudent.mother_name || ''}
                        onChange={(e) => setEditingStudent({...editingStudent, mother_name: e.target.value})}
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
                        value={editingStudent.trust_branch || 'BHEL'}
                        onChange={(e) => setEditingStudent({...editingStudent, trust_branch: e.target.value})}
                      >
                        {['BHEL', 'Bollaram', 'MYP', 'MKR', 'ECIL'].map(b => (
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
                        <label className="text-xs font-bold text-purple-400 uppercase">University</label>
                        <input 
                          type="text"
                          className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:border-purple-900 outline-none transition-all font-medium"
                          value={editingStudent.university_name || ''}
                          onChange={(e) => setEditingStudent({...editingStudent, university_name: e.target.value})}
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

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6">
                <LogOut className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Confirm Logout</h2>
              <p className="text-slate-500 mb-8">Are you sure you want to log out of the PSS Admin Dashboard?</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmLogout}
                  className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100"
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
