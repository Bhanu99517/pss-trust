/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useNavigate, 
  useLocation,
  Outlet,
  Navigate
} from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ChevronDown, 
  Menu, 
  X,
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Twitter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import Signup from './components/Signup';
import FaceRegistration from './components/FaceRegistration';
import Attendance from './components/Attendance';
import AdminLogin from './components/AdminLogin';
import AdminOtp from './components/AdminOtp';
import ChairmanDashboard from './components/ChairmanDashboard';
import SuperInchargeDashboard from './components/SuperInchargeDashboard';
import InchargeDashboard from './components/InchargeDashboard';
import FeeApplication from './components/FeeApplication';
import CheckStatus from './components/CheckStatus';
import StudentAttendance from './components/StudentAttendance';
import ChangePassword from './components/ChangePassword';

import Home from './pages/Home';
import About from './pages/About';
import Impact from './pages/Impact';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import SuccessStories from './pages/SuccessStories';

import { supabase } from './supabaseClient';
import { User } from '@supabase/supabase-js';

import { CHAIRMAN_EMAIL } from './config';

const PSS_LOGO = "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/a84f56a0-4104-45b1-8c19-e9d129a3f77f.jpg";
const CHAIRMAN_PHOTO = "https://wojpyqvcargyffkyxfln.supabase.co/storage/v1/object/public/shared-files/42cb9343-6c24-4522-8ac5-0c27336aff3c/09572fd3-89d2-44ec-a9ad-be7ef63729bf.jpg";

function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const path = location.pathname.substring(1) || 'home';
    setActiveSection(path);
  }, [location]);

  const navItems = [
    { id: '', label: 'Home', path: '/' },
    { id: 'about-us', label: 'About Us', path: '/about-us' },
    { id: 'our-impact', label: 'Our Impact', path: '/our-impact' },
    { id: 'success-stories', label: 'Success Stories', path: '/success-stories' },
    { id: 'gallery', label: 'Gallery', path: '/gallery' },
    { id: 'contact-us', label: 'Contact Us', path: '/contact-us' },
    { 
      id: 'student', 
      label: 'Student', 
      hasDropdown: true,
      subItems: [
        { label: 'Daily Attendance', path: '/daily-attendance' },
        { label: 'Student Attendance', path: '/student-attendance' },
        { label: 'Fee Application', path: '/fee-application' },
        { label: 'Check Application Status', path: '/check-status' }
      ]
    },
  ];

  const branches = [
    "BHEL", "Bollaram", "MYP", "MKR", "ECIL"
  ];

  const isDashboard = location.pathname.includes('dashboard') || 
                      location.pathname === '/change-password' || 
                      location.pathname === '/admin-login' || 
                      location.pathname === '/admin-otp';

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      {/* Top Header Info Bar */}
      {!isDashboard && (
        <div className="hidden lg:flex justify-between items-center px-8 py-3 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <img src={PSS_LOGO} alt="PSS Logo" className="w-12 h-12 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
              <div>
                <h1 className="text-lg font-bold text-slate-800 leading-tight">Potukuchi Somasundara</h1>
                <p className="text-xs font-medium text-slate-500">Social Welfare & Charitable Trust</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <img src={CHAIRMAN_PHOTO} alt="Chairman" className="w-10 h-10 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
              <div>
                <p className="text-xs font-bold text-slate-800">Dr (H.C) P Srinivas</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">CHAIRMAN</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-200/50 px-4 py-2 rounded-lg">
              <Phone className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-bold text-slate-700">9346206332</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      {!isDashboard && (
        <nav className="sticky top-0 z-50 bg-slate-900 text-white px-4 lg:px-8 py-3 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Mobile Logo/Title */}
            <Link to="/" className="lg:hidden flex items-center gap-2">
              <img src={PSS_LOGO} alt="PSS Logo" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
              <span className="font-bold text-sm">PSS Trust</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <div key={item.id || 'home-link'} className="relative group">
                  {item.hasDropdown ? (
                    <button
                      className={`text-sm font-medium transition-colors flex items-center gap-1 hover:text-emerald-400 py-4 ${activeSection === item.id ? 'text-emerald-400' : 'text-slate-300'}`}
                    >
                      {item.label}
                      <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                    </button>
                  ) : (
                    <Link
                      to={item.path!}
                      className={`text-sm font-medium transition-colors flex items-center gap-1 hover:text-emerald-400 py-4 ${activeSection === item.id ? 'text-emerald-400' : 'text-slate-300'}`}
                    >
                      {item.label}
                    </Link>
                  )}

                  {item.hasDropdown && (
                    <div className="absolute top-full left-0 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top scale-95 group-hover:scale-100 z-[100]">
                      {item.subItems?.map((sub, idx) => (
                        <Link 
                          key={idx}
                          to={sub.path}
                          className="w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link 
                to="/admin-login"
                className="hidden sm:block px-4 py-1.5 text-xs font-bold bg-white text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
              >
                Admin Login
              </Link>
              <Link 
                to="/signup"
                className="px-4 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-md hover:bg-emerald-500 transition-colors"
              >
                Sign Up
              </Link>
              <button 
                className="lg:hidden p-1 text-slate-300 hover:text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-[280px] bg-slate-900 z-[110] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img src={PSS_LOGO} alt="PSS Logo" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                  <span className="font-bold text-white">PSS Trust</span>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <div key={item.id || 'home-link-mobile'}>
                      {item.hasDropdown ? (
                        <div className="text-left text-base font-medium py-3 px-4 rounded-xl text-slate-300 flex items-center justify-between">
                          {item.label}
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      ) : (
                        <Link
                          to={item.path!}
                          onClick={() => setIsMenuOpen(false)}
                          className={`text-left text-base font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-between group w-full ${
                            activeSection === item.id 
                              ? 'bg-emerald-600/10 text-emerald-400' 
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          {item.label}
                          <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${activeSection === item.id ? 'opacity-100' : 'opacity-0'}`} />
                        </Link>
                      )}
                      
                      {item.hasDropdown && (
                        <div className="ml-4 mt-2 flex flex-col gap-1 border-l border-slate-800 pl-4">
                          {item.subItems?.map((sub, idx) => (
                            <Link 
                              key={idx} 
                              to={sub.path}
                              onClick={() => setIsMenuOpen(false)}
                              className="text-left py-2 text-sm flex items-center gap-3 text-slate-400 hover:text-white"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-slate-800 space-y-4">
                <Link 
                  to="/admin-login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-3 text-center text-sm font-bold bg-white text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Admin Login
                </Link>
                <Link 
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full py-3 text-center text-sm font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer / Bottom Info Section */}
      {!isDashboard && (
        <footer className="bg-slate-50 py-6 px-6 lg:px-8 border-t border-slate-200">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-[10px] lg:text-xs font-bold uppercase tracking-widest text-center md:text-left">
              © {new Date().getFullYear()} Potukuchi Somasundara Social Welfare & Charitable Trust. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              <a href="/privacy_policy.html" className="text-slate-400 hover:text-slate-600 text-[10px] lg:text-xs font-medium transition-colors">Privacy Policy</a>
              <span className="text-slate-300">|</span>
              <a href="/terms_of_service.html" className="text-slate-400 hover:text-slate-600 text-[10px] lg:text-xs font-medium transition-colors">Terms of Service</a>
              <span className="text-slate-300">|</span>
              <a href="/data_retention.html" className="text-slate-400 hover:text-slate-600 text-[10px] lg:text-xs font-medium transition-colors">Data Retention</a>
              <span className="text-slate-300">|</span>
              <a href="/cookie_policy.html" className="text-slate-400 hover:text-slate-600 text-[10px] lg:text-xs font-medium transition-colors">Cookie Policy</a>
              <span className="text-slate-200 hidden md:inline">|</span>
              <a href="https://www.facebook.com/people/PssTrust/100080242307255/" className="text-slate-400 hover:text-blue-600 transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://in.linkedin.com/company/potukuchi-somasundara-social-welfare-and-charitable-trust#" className="text-slate-400 hover:text-blue-700 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://www.youtube.com/@psstrust" className="text-slate-400 hover:text-red-600 transition-colors" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

function AppContent() {
  const [registeredStudentId, setRegisteredStudentId] = useState<string | null>(() => {
    return sessionStorage.getItem('registeredStudentId');
  });
  const [students, setStudents] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const chairmanEmail = CHAIRMAN_EMAIL;
  const navigate = useNavigate();

  useEffect(() => {
    if (registeredStudentId) {
      sessionStorage.setItem('registeredStudentId', registeredStudentId);
    } else {
      sessionStorage.removeItem('registeredStudentId');
    }
  }, [registeredStudentId]);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.email!);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.email!);
      } else {
        setUserRole(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (email: string) => {
    if (email === chairmanEmail) {
      setUserRole('chairman');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('incharges')
        .select('role')
        .eq('email', email)
        .single();

      if (error) throw error;
      setUserRole(data?.role || 'branch_incharge');
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('branch_incharge');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStudents();
    }
  }, [user]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/our-impact" element={<Impact />} />
        <Route path="/success-stories" element={<SuccessStories />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact-us" element={<Contact />} />
        
        <Route path="/signup" element={
          <Signup 
            onBack={() => navigate(-1)} 
            onSuccess={(id) => {
              setRegisteredStudentId(id);
              navigate('/face-registration');
            }} 
          />
        } />
        
        <Route path="/face-registration" element={
          registeredStudentId ? (
            <FaceRegistration 
              studentId={registeredStudentId}
              onSuccess={() => {
                setRegisteredStudentId(null);
                alert('Registration complete! You can now mark your attendance.');
                navigate('/');
              }}
            />
          ) : (
            <div className="p-20 text-center">
              <p className="mb-4 text-slate-600">Please sign up first to register your face.</p>
              <Link to="/signup" className="text-emerald-600 font-bold hover:underline">Go to Sign Up</Link>
            </div>
          )
        } />

        <Route path="/daily-attendance" element={<Attendance onBack={() => navigate(-1)} />} />
        <Route path="/student-attendance" element={<StudentAttendance onBack={() => navigate(-1)} />} />
        <Route path="/fee-application" element={<FeeApplication onBack={() => navigate(-1)} />} />
        <Route path="/check-status" element={<CheckStatus onBack={() => navigate(-1)} />} />
        
        <Route path="/admin-login" element={
          user ? (
            <div className="p-20 text-center">
              <p className="mb-4 text-slate-600">You are already logged in.</p>
              <button 
                onClick={() => {
                  if (userRole === 'chairman') navigate('/chairman-dashboard');
                  else if (userRole === 'super_incharge') navigate('/super-incharge-dashboard');
                  else navigate('/incharge-dashboard');
                }}
                className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <AdminLogin 
              onBack={() => navigate(-1)} 
            />
          )
        } />
        
        <Route path="/admin-otp" element={<AdminOtp />} />
        
        {/* Redirect old routes to new admin login */}
        <Route path="/chairman-login" element={<Navigate to="/admin-login" replace />} />
        <Route path="/incharge-login" element={<Navigate to="/admin-login" replace />} />
        <Route path="/chairman-otp" element={<Navigate to="/admin-login" replace />} />
        <Route path="/incharge-otp" element={<Navigate to="/admin-login" replace />} />
        
        <Route path="/chairman-dashboard" element={
          user && userRole === 'chairman' ? (
            <ChairmanDashboard 
              students={students} 
              onLogout={async () => {
                await supabase.auth.signOut();
                navigate('/');
              }} 
              onChangePassword={() => navigate('/change-password')}
            />
          ) : (
            <div className="p-20 text-center">
              <p className="mb-4 text-slate-600">Access denied. Please login as Chairman.</p>
              <Link to="/admin-login" className="text-slate-900 font-bold hover:underline">Admin Login</Link>
            </div>
          )
        } />

        <Route path="/super-incharge-dashboard" element={
          user && userRole === 'super_incharge' ? (
            <SuperInchargeDashboard 
              onLogout={async () => {
                await supabase.auth.signOut();
                navigate('/');
              }} 
              onChangePassword={() => navigate('/change-password')}
            />
          ) : (
            <div className="p-20 text-center">
              <p className="mb-4 text-slate-600">Access denied. Please login as Super Incharge.</p>
              <Link to="/admin-login" className="text-slate-900 font-bold hover:underline">Admin Login</Link>
            </div>
          )
        } />

        <Route path="/incharge-dashboard" element={
          user && userRole === 'branch_incharge' ? (
            <InchargeDashboard 
              onLogout={async () => {
                await supabase.auth.signOut();
                navigate('/');
              }} 
              onChangePassword={() => navigate('/change-password')}
            />
          ) : (
            <div className="p-20 text-center">
              <p className="mb-4 text-slate-600">Access denied. Please login as Incharge.</p>
              <Link to="/admin-login" className="text-emerald-600 font-bold hover:underline">Admin Login</Link>
            </div>
          )
        } />
        
        <Route path="/change-password" element={
          user ? (
            <ChangePassword 
              chairmanEmail={chairmanEmail}
              onBack={() => navigate('/chairman-dashboard')} 
            />
          ) : (
            <div className="p-20 text-center">
              <p className="mb-4 text-slate-600">Access denied. Please login as Chairman.</p>
              <Link to="/admin-login" className="text-slate-900 font-bold hover:underline">Admin Login</Link>
            </div>
          )
        } />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}


