import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, CheckCircle2, AlertCircle, RefreshCw, ArrowLeft, User, Hash } from 'lucide-react';
import { supabase } from '../supabaseClient';
import * as faceapi from 'face-api.js';

interface AttendanceProps {
  onBack: () => void;
}

const MODEL_URL = '/models';

export default function Attendance({ onBack }: AttendanceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [sid, setSid] = useState('');
  const [student, setStudent] = useState<any>(null);
  const [step, setStep] = useState(1); // 1: Enter ID, 2: Verify Face

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      setIsModelsLoaded(true);
    };
    loadModels();

    return () => {
      stopVideo();
    };
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error('Error accessing camera:', err);
        setError('Could not access camera. Please check permissions.');
      });
  };

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  useEffect(() => {
    let intervalId: any;
    if (step === 2 && isModelsLoaded) {
      intervalId = setInterval(async () => {
        if (videoRef.current && videoRef.current.readyState === 4) {
          const detections = await faceapi
            .detectSingleFace(videoRef.current)
            .withFaceLandmarks()
            .withFaceDescriptor();
          setFaceDetected(!!detections);
        }
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [step, isModelsLoaded]);

  const handleVerifyId = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('students')
        .select('*')
        .eq('trust_id', sid.trim().toUpperCase())
        .single();

      if (fetchError) throw new Error('Student not found. Please check your SID.');
      
      console.log('Fetched student for attendance:', data);
      setStudent(data);
      setStep(2);
      setTimeout(startVideo, 100);
    } catch (err: any) {
      console.error('ID verification error:', err);
      setError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const verifyFace = async () => {
    if (!videoRef.current || !student || !isModelsLoaded) return;
    setIsVerifying(true);
    setError(null);

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setError('No face detected. Please look directly at the camera.');
        setIsVerifying(false);
        return;
      }

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

      const storedDescriptor = new Float32Array(storedFace.face_descriptor);
      const distance = faceapi.euclideanDistance(
        Array.from(detection.descriptor),
        Array.from(storedDescriptor)
      );

      if (distance > 0.5) {
        setError('Face did not match. Please try again.');
        setIsVerifying(false);
        return;
      }

      const { error: insertError } = await supabase
        .from('attendance')
        .insert([{
          student_id: student.id,
          status: 'present',
          method: 'face_recognition',
        }]);

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
          {step === 1 ? (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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
                      placeholder="Enter SID"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-300 outline-none transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isVerifying ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Next: Face Verification</span>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden p-8 text-center"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Face Verification</h2>
              <p className="text-slate-500 mb-8">Hello, {student?.full_name}</p>

              <div className="relative w-64 h-64 mx-auto mb-8">
                <div className={`w-full h-full rounded-full overflow-hidden border-4 transition-colors duration-300 ${
                  faceDetected ? 'border-emerald-500' : 'border-red-500'
                }`}>
                  <video 
                    ref={videoRef}
                    autoPlay 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
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
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {!isSuccess && (
                <div className="space-y-4">
                  <button 
                    onClick={verifyFace}
                    disabled={!isModelsLoaded || isVerifying || !faceDetected}
                    className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <span>Verifying...</span>
                    ) : (
                      <>
                        <Camera className="w-5 h-5" />
                        <span>Mark Attendance</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => {
                      stopVideo();
                      setStep(1);
                      setError(null);
                    }}
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
