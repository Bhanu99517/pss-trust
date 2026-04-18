import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, CheckCircle2, AlertCircle, RefreshCw, ArrowLeft, Hash, MapPin, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import * as faceapi from 'face-api.js';

interface AttendanceProps {
  onBack: () => void;
}

const MODEL_URL = '/models';

// ── Haversine formula — returns distance in meters between two coordinates ──
function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function Attendance({ onBack }: AttendanceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const faceapiRef = useRef<any>(null);

  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [sid, setSid] = useState('');
  const [student, setStudent] = useState<any>(null);
  const [step, setStep] = useState(1);

  // ── Geofence state ────────────────────────────────────────────────────────
  const [geoStatus, setGeoStatus] = useState<'idle' | 'checking' | 'allowed' | 'denied'>('idle');
  const [geoMessage, setGeoMessage] = useState<string | null>(null);

  // ── Load face-api models ─────────────────────────────────────────────────
  useEffect(() => {
    const loadModels = async () => {
      try {
        faceapiRef.current = faceapi;
        await faceapi.tf.ready();
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setIsModelsLoaded(true);
      } catch (err) {
        console.error('Model load error:', err);
        setError('Failed to load face detection models. Please refresh the page.');
      }
    };
    loadModels();
    return () => { stopVideo(); };
  }, []);

  // ── Start/stop camera ────────────────────────────────────────────────────
  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setError('Could not access camera. Please check permissions.'));
  };

  const stopVideo = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    }
  };

  useEffect(() => {
    if (step === 2) startVideo();
  }, [step]);

  // ── Face detection loop ──────────────────────────────────────────────────
  useEffect(() => {
    let intervalId: any;
    if (step === 2 && isModelsLoaded && faceapiRef.current) {
      intervalId = setInterval(async () => {
        if (videoRef.current && videoRef.current.readyState === 4) {
          const detections = await faceapiRef.current
            .detectSingleFace(videoRef.current)
            .withFaceLandmarks()
            .withFaceDescriptor();
          setFaceDetected(!!detections);
        }
      }, 500);
    }
    return () => clearInterval(intervalId);
  }, [step, isModelsLoaded]);

  // ── STEP 1: Verify SID + run geofence check ──────────────────────────────
  const handleVerifyId = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError(null);
    setGeoStatus('idle');
    setGeoMessage(null);

    try {
      // 1. Fetch student
      const { data: studentData, error: fetchError } = await supabase
        .from('students')
        .select('*')
        .eq('trust_id', sid.trim().toUpperCase())
        .single();
      if (fetchError) throw new Error('Student not found. Please check your SID.');

      // 2. Fetch branch geofence for this student's branch
      const { data: branchData } = await supabase
        .from('branches')
        .select('name, latitude, longitude, radius')
        .eq('name', studentData.trust_branch)
        .single();

      // 3. If branch has no geofence configured, allow through
      if (!branchData || branchData.latitude === null || branchData.longitude === null) {
        setStudent(studentData);
        setStep(2);
        setIsVerifying(false);
        return;
      }

      // 4. Run geofence check
      setGeoStatus('checking');
      setIsVerifying(false); // release button while waiting for GPS

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: userLat, longitude: userLon, accuracy } = position.coords;
          const distance = getDistanceMeters(
            userLat, userLon,
            branchData.latitude, branchData.longitude
          );
          const allowedRadius = branchData.radius ?? 100;

          if (distance <= allowedRadius) {
            setGeoStatus('allowed');
            setGeoMessage(`✓ Location verified — ${Math.round(distance)}m from ${branchData.name} centre`);
            setStudent(studentData);
            // Small delay so user sees the green confirmation
            setTimeout(() => setStep(2), 1000);
          } else {
            setGeoStatus('denied');
            setError(
              `You are ${Math.round(distance)}m away from the ${branchData.name} branch. ` +
              `You must be within ${allowedRadius}m to mark attendance.`
            );
          }
        },
        (geoError) => {
          setGeoStatus('idle');
          let msg = 'Unable to get your location.';
          if (geoError.code === 1) msg = 'Location permission denied. Please allow location access and try again.';
          if (geoError.code === 2) msg = 'Location unavailable. Please check your GPS and try again.';
          if (geoError.code === 3) msg = 'Location request timed out. Please try again.';
          setError(msg);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );

    } catch (err: any) {
      setError(err.message);
      setIsVerifying(false);
      setGeoStatus('idle');
    }
  };

  // ── STEP 2: Face verification + attendance insert ─────────────────────────
  const verifyFace = async () => {
    if (!videoRef.current || !student || !isModelsLoaded || !faceapiRef.current) return;
    setIsVerifying(true);
    setError(null);

    try {
      const faceApi = faceapiRef.current;

      // Detect face
      const detection = await faceApi
        .detectSingleFace(videoRef.current, new faceApi.SsdMobilenetv1Options({ minConfidence: 0.3 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setError('No face detected. Please look directly at the camera.');
        setIsVerifying(false);
        return;
      }

      // Fetch stored face descriptor
      const { data: storedFace, error: fetchErr } = await supabase
        .from('attendance_faces')
        .select('face_descriptor')
        .eq('student_id', student.id)
        .single();

      if (fetchErr || !storedFace) {
        setError('No registered face found. Please register your face first.');
        setIsVerifying(false);
        return;
      }

      // Compare faces
      const storedDescriptor = new Float32Array(storedFace.face_descriptor);
      const distance = faceApi.euclideanDistance(detection.descriptor, storedDescriptor);

      if (distance > 0.6) {
        setError(`Face did not match. Please try again. (distance: ${distance.toFixed(2)})`);
        setIsVerifying(false);
        return;
      }

      // Check if already marked today
      const today = new Date().toISOString().split('T')[0];
      const { data: existing } = await supabase
        .from('attendance')
        .select('id')
        .eq('student_id', student.id)
        .gte('created_at', today)
        .maybeSingle();

      if (existing) {
        setError('Attendance already marked for today.');
        setIsVerifying(false);
        return;
      }

      // Insert attendance
      const { error: insertError } = await supabase
        .from('attendance')
        .insert([{ student_id: student.id, status: 'present', method: 'face_recognition' }]);

      if (insertError) throw insertError;

      setIsSuccess(true);
      stopVideo();
      setTimeout(onBack, 3000);

    } catch (err: any) {
      setError('Verification failed: ' + err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <AnimatePresence mode="wait">

          {/* ── STEP 1: SID Entry ─────────────────────────────────────────── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
            >
              <div className="bg-slate-900 p-8 text-white">
                <h1 className="text-2xl font-bold mb-2">Daily Attendance</h1>
                <p className="text-slate-400 text-sm">Enter your SID to proceed</p>
              </div>

              <form onSubmit={handleVerifyId} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">SID</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      required
                      type="text"
                      value={sid}
                      onChange={(e) => setSid(e.target.value)}
                      placeholder="Enter SID e.g. 2023-BHEL-001"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Geofence checking indicator */}
                {geoStatus === 'checking' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-700"
                  >
                    <Loader2 className="w-5 h-5 animate-spin shrink-0" />
                    <div>
                      <p className="text-sm font-bold">Checking your location…</p>
                      <p className="text-xs text-blue-500 mt-0.5">Please allow location access if prompted</p>
                    </div>
                  </motion.div>
                )}

                {/* Geofence success */}
                {geoStatus === 'allowed' && geoMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-emerald-700"
                  >
                    <MapPin className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-bold">{geoMessage}</p>
                  </motion.div>
                )}

                {/* Error (includes geofence denial) */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 text-red-600 bg-red-50 border border-red-100 p-4 rounded-xl text-sm"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isVerifying || geoStatus === 'checking'}
                  className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isVerifying || geoStatus === 'checking'
                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <span>Next: Face Verification</span>}
                </button>
              </form>
            </motion.div>
          )}

          {/* ── STEP 2: Face Scan ─────────────────────────────────────────── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden p-8 text-center"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Face Verification</h2>
              <p className="text-slate-500 mb-2">Hello, {student?.full_name}</p>

              {/* Location badge */}
              {geoMessage && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-6">
                  <MapPin className="w-3.5 h-3.5" />
                  {geoMessage}
                </div>
              )}

              <div className="relative w-64 h-64 mx-auto mb-8">
                <div className={`w-full h-full rounded-full overflow-hidden border-4 transition-colors duration-300 ${faceDetected ? 'border-emerald-500' : 'border-red-500'}`}>
                  <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
                </div>
                {isVerifying && (
                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                    <RefreshCw className="w-10 h-10 text-white animate-spin" />
                  </div>
                )}
                {isSuccess && (
                  <div className="absolute inset-0 rounded-full bg-emerald-500/90 flex items-center justify-center">
                    <CheckCircle2 className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl mb-6 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" /><p>{error}</p>
                </div>
              )}

              {!isSuccess && (
                <div className="space-y-4">
                  <button
                    onClick={verifyFace}
                    disabled={!isModelsLoaded || isVerifying || !faceDetected}
                    className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isVerifying
                      ? <span>Verifying...</span>
                      : <><Camera className="w-5 h-5" /><span>Mark Attendance</span></>}
                  </button>
                  <button
                    onClick={() => { stopVideo(); setStep(1); setError(null); setFaceDetected(false); setGeoStatus('idle'); setGeoMessage(null); }}
                    className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                  >
                    Back
                  </button>
                </div>
              )}

              {isSuccess && (
                <div className="space-y-2">
                  <p className="text-emerald-600 font-bold text-xl">Attendance Marked!</p>
                  <p className="text-slate-400 text-sm">Redirecting to home...</p>
                </div>
              )}

              {!isModelsLoaded && !error && (
                <p className="mt-4 text-slate-400 text-sm animate-pulse">Loading face detection models...</p>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}