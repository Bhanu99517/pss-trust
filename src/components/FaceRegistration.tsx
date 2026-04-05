import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Camera, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../supabaseClient';
import * as faceapi from 'face-api.js';

interface FaceRegistrationProps {
  studentId: string;
  onSuccess: () => void;
}

const MODEL_URL = '/models';

export default function FaceRegistration({ studentId, onSuccess }: FaceRegistrationProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);

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
    if (isModelsLoaded && videoRef.current) {
      intervalId = setInterval(async () => {
        if (videoRef.current) {
          const detections = await faceapi
            .detectSingleFace(videoRef.current)
            .withFaceLandmarks()
            .withFaceDescriptor();
          setFaceDetected(!!detections);
        }
      }, 500);
    }
    return () => clearInterval(intervalId);
  }, [isModelsLoaded]);

  const captureFace = async () => {
    if (!videoRef.current || !isModelsLoaded) return;
    setIsCapturing(true);
    setError(null);

    try {
      // 1. Detect face + get descriptor
      const detections = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detections) {
        setError('No face detected. Please look directly at the camera.');
        setIsCapturing(false);
        return;
      }

      // 2. Capture photo from video frame
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', 0.8)
      );
      if (!blob) throw new Error('Failed to create image blob');

      const fileName = `${studentId}_${Date.now()}.jpg`;

      // 3. Upload photo to Supabase Storage "faces" bucket
      const { error: uploadError } = await supabase.storage
        .from('faces')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // 4. Get public URL of uploaded photo
      const { data: { publicUrl } } = supabase.storage
        .from('faces')
        .getPublicUrl(fileName);

      // 5. Save photo_url to students table
      const { error: updateError } = await supabase
        .from('students')
        .update({ photo_url: publicUrl })
        .eq('id', studentId);

      if (updateError) throw updateError;

      // 6. Save face descriptor (128 numbers) to attendance_faces table
      //    This is the actual data used for face comparison during attendance
      const descriptorArray = Array.from(detections.descriptor);

      const { error: descError } = await supabase
        .from('attendance_faces')
        .upsert(
          {
            student_id: studentId,
            face_descriptor: descriptorArray,
            image_url: publicUrl,
          },
          { onConflict: 'student_id' } // update if student re-registers face
        );

      if (descError) throw descError;

      // Done
      setIsSuccess(true);
      stopVideo();
      setTimeout(onSuccess, 2000);
    } catch (err: any) {
      console.error('Capture error:', err);
      setError('Failed to register face: ' + err.message);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center"
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Face Registration</h2>
        <p className="text-slate-500 mb-8">Secure your account with face recognition</p>

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

          {isCapturing && (
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

        {/* Status text below camera */}
        {!isSuccess && !error && (
          <p className={`text-sm font-medium mb-4 ${faceDetected ? 'text-emerald-600' : 'text-red-500'}`}>
            {!isModelsLoaded
              ? 'Loading face detection models...'
              : faceDetected
              ? 'Face detected — ready to capture'
              : 'No face detected — look at the camera'}
          </p>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl mb-6 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {!isSuccess && (
          <button
            onClick={captureFace}
            disabled={!isModelsLoaded || isCapturing || !faceDetected}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isCapturing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Saving face data...</span>
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                <span>Capture & Register Face</span>
              </>
            )}
          </button>
        )}

        {isSuccess && (
          <div className="space-y-2">
            <p className="text-emerald-600 font-bold text-lg">Face registered successfully!</p>
            <p className="text-slate-400 text-sm">Redirecting...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}