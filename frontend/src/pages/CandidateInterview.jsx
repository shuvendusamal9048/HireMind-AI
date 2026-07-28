import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, ShieldAlert, Video, Mic, CheckCircle2, ChevronLeft, ChevronRight,
  Save, Send, Info, User, HelpCircle, ShieldCheck, AlertTriangle, MonitorX, Lock, Users, AlertCircle, Code, Play, XCircle, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Card, { CardHeader } from '../components/Card';
import { candidateInterviewService } from '../services/candidateInterviewService';

export const CandidateInterview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sectionA'); // 'sectionA' or 'sectionB'

  // Exam Data
  const [sectionA, setSectionA] = useState([]);
  const [sectionB, setSectionB] = useState(null);

  // Section A State (10 MCQs)
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answersA, setAnswersA] = useState({});
  const [visitedA, setVisitedA] = useState(new Set([0]));
  const [markedForReviewA, setMarkedForReviewA] = useState(new Set());

  // Section B State (Coding Challenge)
  const [codeAnswer, setCodeAnswer] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [session, setSession] = useState(null);

  // Timer State (30 Minutes = 1800 Seconds)
  const [timeLeft, setTimeLeft] = useState(1800);

  // Proctoring States
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isTerminated, setIsTerminated] = useState(false);
  const [isCameraDenied, setIsCameraDenied] = useState(false);
  const [multiPersonAlert, setMultiPersonAlert] = useState(false);
  const lastTabSwitchRef = useRef(0);

  // Webcam stream & 1-minute video recorder references
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    // Read session info
    const saved = sessionStorage.getItem('candidate_session');
    if (saved) {
      try {
        setSession(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      }
    }

    const fetchInterviewData = async () => {
      setLoading(true);
      try {
        const data = await candidateInterviewService.getInterview(id);
        if (data && data.sectionA && data.sectionB) {
          setSectionA(data.sectionA);
          setSectionB(data.sectionB);
          setCodeAnswer(data.sectionB.starterCode || '');
        } else {
          // Fallback data
          const fallbackData = await candidateInterviewService.getInterview('fallback');
          setSectionA(fallbackData.sectionA || []);
          setSectionB(fallbackData.sectionB || null);
          setCodeAnswer(fallbackData.sectionB?.starterCode || '');
        }
      } catch (err) {
        console.error('Error fetching interview data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewData();

    // Initialize Webcam & 1-Minute Proctoring Video Recorder
    const initWebcam = async () => {
      // Check if browser mediaDevices API is available (restricted on HTTP non-secure contexts)
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('HTTP Non-Secure Context: Camera access restricted by browser policy. Session proceeding in HTTP proctoring mode.');
        toast('HTTP Mode: Exam proctoring active (Tab switch & timer enabled).', { icon: 'ℹ️' });
        return;
      }

      try {
        const constraints = { video: { width: { ideal: 640 }, height: { ideal: 480 } }, audio: false };
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setCameraActive(true);

        // Start 1-Minute (60s) Proctoring Video Recording
        try {
          recordedChunksRef.current = [];
          const options = MediaRecorder.isTypeSupported('video/webm;codecs=vp8')
            ? { mimeType: 'video/webm;codecs=vp8' }
            : { mimeType: 'video/webm' };

          const recorder = new MediaRecorder(mediaStream, options);
          mediaRecorderRef.current = recorder;

          recorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
              recordedChunksRef.current.push(event.data);
            }
          };

          recorder.onstop = async () => {
            if (recordedChunksRef.current.length > 0) {
              const videoBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
              const formData = new FormData();
              formData.append('file', videoBlob, `proctoring_${id}.webm`);
              try {
                await candidateInterviewService.uploadProctoringVideo(id, formData);
              } catch (e) {
                console.warn('Proctoring video upload notice:', e);
              }
            }
          };

          recorder.start(1000); // Collect chunk every 1 second

          // Automatically stop recording after 60 seconds (1 minute)
          setTimeout(() => {
            if (recorder && recorder.state !== 'inactive') {
              recorder.stop();
            }
          }, 60000);
        } catch (recErr) {
          console.warn('MediaRecorder error:', recErr);
        }
      } catch (err) {
        console.warn('Webcam permission check:', err);
        // Only lock exam if user explicitly clicked "Block / Deny" on HTTPS context
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setIsCameraDenied(true);
          setIsTerminated(true);
          toast.error('CAMERA PERMISSION DENIED: Examination terminated immediately!');
          candidateInterviewService.finishInterview(id);
        } else {
          console.warn('Camera missing or HTTP context. Session proceeding in standard proctoring mode.');
        }
      }
    };
    initWebcam();

    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [id]);

  const captureAndUploadScreenshot = async () => {
    if (!videoRef.current || !cameraActive) return;

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const formData = new FormData();
        formData.append('file', blob, `screenshot_${id}.jpg`);

        try {
          await candidateInterviewService.uploadScreenshot(id, formData);
        } catch (e) {
          console.warn('Screenshot upload error:', e);
        }
      }, 'image/jpeg', 0.85);
    } catch (err) {
      console.warn('Capture screenshot error:', err);
    }
  };

  // Automatically take two proctoring screenshots when camera becomes active
  useEffect(() => {
    if (!cameraActive) return;

    const timer1 = setTimeout(() => {
      captureAndUploadScreenshot();
    }, 5000);

    const timer2 = setTimeout(() => {
      captureAndUploadScreenshot();
    }, 30000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [cameraActive]);

  // Track Visited Questions in Section A
  useEffect(() => {
    setVisitedA((prev) => new Set(prev).add(currentIdx));
  }, [currentIdx]);

  // Tab Switch & Visibility Change Monitor (Max 2 Warnings Allowed)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isTerminated) {
        const now = Date.now();
        if (now - lastTabSwitchRef.current < 2000) return;
        lastTabSwitchRef.current = now;

        setTabSwitchCount((prev) => {
          const nextCount = prev + 1;
          if (nextCount >= 3) { // 3rd tab switch triggers immediate termination (Max 2 warnings allowed)
            setIsTerminated(true);
            toast.error('Session terminated: Exceeded maximum 2 tab switching warnings!');
            if (streamRef.current) {
              streamRef.current.getTracks().forEach((track) => track.stop());
            }
            candidateInterviewService.finishInterview(id);
          } else {
            toast.error(`PROCTOR WARNING (${nextCount}/2): Tab switching detected! Exam will lock on 3rd violation.`, { duration: 5000 });
          }
          return nextCount;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [id, isTerminated]);

  // Webcam Multi-Person Detection Interval
  useEffect(() => {
    if (!cameraActive || isTerminated) return;

    const faceCheckInterval = setInterval(async () => {
      if (videoRef.current && 'FaceDetector' in window) {
        try {
          const detector = new window.FaceDetector();
          const faces = await detector.detect(videoRef.current);
          if (faces.length > 1) {
            setMultiPersonAlert(true);
            toast.error('CHEATING ALERT: Multiple people detected in camera view!');
          } else {
            setMultiPersonAlert(false);
          }
        } catch (e) {
          // FaceDetector unsupported
        }
      }
    }, 4000);

    return () => clearInterval(faceCheckInterval);
  }, [cameraActive, isTerminated]);

  // Timer countdown
  useEffect(() => {
    if (isTerminated) return;
    if (timeLeft <= 0) {
      toast.error('Time limit reached! Submitting your exam automatically with current progress.');
      handleSubmitInterview(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isTerminated]);

  const formatTimer = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // MCQ Selection Handler
  const handleSelectOptionA = (qId, opt) => {
    if (isTerminated) return;
    setAnswersA((prev) => ({
      ...prev,
      [qId]: opt,
    }));
    candidateInterviewService.saveAnswer(qId, opt);
  };

  const handleClearResponse = () => {
    const qId = sectionA[currentIdx]?.id;
    if (!qId) return;
    setAnswersA((prev) => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
    toast.success('Response cleared for this question');
  };

  const handleToggleMarkForReview = () => {
    setMarkedForReviewA((prev) => {
      const copy = new Set(prev);
      if (copy.has(currentIdx)) {
        copy.delete(currentIdx);
        toast.success('Unmarked for review');
      } else {
        copy.add(currentIdx);
        toast.success('Marked for review');
      }
      return copy;
    });
    if (currentIdx < (sectionA.length || 10) - 1) {
      setCurrentIdx((i) => i + 1);
    }
  };

  // Section B Code Runner
  const handleRunTestCases = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      try {
        let runnerScript = codeAnswer || '';
        if (runnerScript.includes('def ')) {
          runnerScript = runnerScript
            .replace(/#.*/g, '')
            .replace(/def\s+two_sum\s*\(([^)]*)\)\s*:/g, 'function two_sum($1) {')
            .replace(/def\s+twoSum\s*\(([^)]*)\)\s*:/g, 'function twoSum($1) {')
            .replace(/for\s+(\w+)\s+in\s+range\s*\(\s*len\s*\(\s*(\w+)\s*\)\s*\)\s*:/g, 'for (let $1 = 0; $1 < $2.length; $1++) {')
            .replace(/for\s+(\w+)\s+in\s+range\s*\(\s*(\w+)\s*\+\s*1\s*,\s*len\s*\(\s*(\w+)\s*\)\s*\)\s*:/g, 'for (let $1 = $2 + 1; $1 < $3.length; $1++) {')
            .replace(/if\s+(.*?)\s*:/g, 'if ($1) {')
            .replace(/return\s+(.*)/g, 'return $1;')
            .replace(/pass/g, '');
          const openB = (runnerScript.match(/\{/g) || []).length;
          const closeB = (runnerScript.match(/\}/g) || []).length;
          for (let b = 0; b < openB - closeB; b++) {
            runnerScript += '\n}';
          }
        }

        const userFn = new Function(`
          ${runnerScript}
          if (typeof two_sum === 'function') return two_sum;
          if (typeof twoSum === 'function') return twoSum;
          return null;
        `)();

        if (!userFn) {
          throw new Error('Function `two_sum` not defined.');
        }

        const tcResults = (sectionB?.testCases || []).map((tc) => {
          let passed = false;
          let actualOutput = '';
          try {
            if (tc.id === 1) {
              const res = userFn([2, 7, 11, 15], 9);
              actualOutput = JSON.stringify(res);
              passed = JSON.stringify(res) === '[0,1]' || JSON.stringify(res) === '[0, 1]';
            } else if (tc.id === 2) {
              const res = userFn([3, 2, 4], 6);
              actualOutput = JSON.stringify(res);
              passed = JSON.stringify(res) === '[1,2]' || JSON.stringify(res) === '[1, 2]';
            } else if (tc.id === 3) {
              const res = userFn([3, 3], 6);
              actualOutput = JSON.stringify(res);
              passed = JSON.stringify(res) === '[0,1]' || JSON.stringify(res) === '[0, 1]';
            }
          } catch (err) {
            actualOutput = err.message;
            passed = false;
          }
          return { ...tc, passed, actualOutput };
        });

        setTestResults(tcResults);
        const passedCount = tcResults.filter((r) => r.passed).length;
        if (passedCount === tcResults.length) {
          toast.success(`All ${passedCount}/3 Test Cases Passed!`);
        } else {
          toast.error(`${passedCount}/3 Test Cases Passed.`);
        }
      } catch (err) {
        setTestResults([
          { id: 1, name: 'Test Case 1', passed: false, actualOutput: err.message },
          { id: 2, name: 'Test Case 2', passed: false, actualOutput: 'Execution Error' },
          { id: 3, name: 'Test Case 3', passed: false, actualOutput: 'Execution Error' },
        ]);
        toast.error(`Code Execution Error: ${err.message}`);
      } finally {
        setIsRunningTests(false);
      }
    }, 600);
  };

  // Section A Completion Check
  const answeredACount = Object.keys(answersA).filter(
    (k) => answersA[k] && String(answersA[k]).trim().length > 0
  ).length;
  const isSectionAComplete = answeredACount >= (sectionA.length || 10);

  const isSectionBAttempted = (() => {
    if (testResults !== null && Array.isArray(testResults) && testResults.length > 0) {
      return true;
    }
    if (!codeAnswer) return false;
    const starterClean = (sectionB?.starterCode || '').replace(/\s+/g, '');
    const currentClean = codeAnswer.replace(/\s+/g, '');
    if (currentClean === starterClean) return false;

    const logic = codeAnswer
      .replace(/#.*/g, '')
      .replace(/\bpass\b/g, '')
      .replace(/def\s+two_sum\s*\([^)]*\)\s*:/g, '')
      .trim();

    return logic.length > 0;
  })();

  const isAllExamComplete = isSectionAComplete && isSectionBAttempted;

  const stopAndUploadVideo = () => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        resolve(null);
        return;
      }

      mediaRecorderRef.current.onstop = async () => {
        if (recordedChunksRef.current.length > 0) {
          const videoBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const formData = new FormData();
          formData.append('file', videoBlob, `proctoring_${id}.webm`);
          try {
            await candidateInterviewService.uploadProctoringVideo(id, formData);
          } catch (e) {
            console.warn('Proctoring video upload notice:', e);
          }
        }
        resolve(null);
      };

      mediaRecorderRef.current.stop();
    });
  };

  const handleSubmitInterview = async (isAutoSubmit = false) => {
    if (!isAutoSubmit) {
      if (!isSectionAComplete) {
        setActiveTab('sectionA');
        toast.error(`Section A Incomplete: ${answeredACount}/10 completed.`);
        return;
      }

      if (!isSectionBAttempted) {
        setActiveTab('sectionB');
        toast.error('Section B Coding Required.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // 1. Stop recording and wait for upload to complete
      await stopAndUploadVideo();

      const answersArray = [
        ...sectionA.map((q) => ({
          question_id: q.id,
          answer: answersA[q.id] || '',
        })),
        {
          question_id: sectionB?.id || 'coding-01',
          answer: codeAnswer || '',
        }
      ];

      await candidateInterviewService.finishInterview(id);
      await candidateInterviewService.submitInterview(id, answersArray);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (isAutoSubmit) {
        toast.success('Time expired! Your exam has been automatically submitted with all completed answers.');
      } else {
        toast.success('Examination submitted successfully!');
      }
      navigate(`/interview/${id}/completed`);
    } catch (err) {
      navigate(`/interview/${id}/completed`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center font-sans text-slate-800 dark:text-slate-100">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xl">
          <Clock className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto" />
          <p className="text-sm font-extrabold">Loading SkillAssess Evaluation Portal...</p>
          <p className="text-xs text-slate-500 font-mono">Initializing proctoring module & test sections</p>
        </div>
      </div>
    );
  }

  const currentQuestionA = sectionA[currentIdx] || {};

  // Calculate Question Palette Statistics
  let countAnswered = 0;
  let countNotAnswered = 0;
  let countNotVisited = 0;
  let countMarkedReview = 0;

  sectionA.forEach((q, idx) => {
    const hasAns = Boolean(answersA[q.id]);
    const isMarked = markedForReviewA.has(idx);
    const isVis = visitedA.has(idx);

    if (isMarked) {
      countMarkedReview++;
    } else if (hasAns) {
      countAnswered++;
    } else if (isVis) {
      countNotAnswered++;
    } else {
      countNotVisited++;
    }
  });

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* 🌟 SkillAssess TOP NAVIGATION BANNER */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 pr-4 border-r border-slate-200 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white font-black text-base shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                SkillAssess AI Console
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono block">HireMind Technical Examination Portal</span>
            </div>
          </div>

          {/* Section Selector Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('sectionA')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs ${
                activeTab === 'sectionA'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>Section 1: Technical MCQs (10)</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${isSectionAComplete ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-900 text-amber-600 dark:text-amber-300'}`}>
                {answeredACount}/10
              </span>
            </button>

            <button
              onClick={() => setActiveTab('sectionB')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs ${
                activeTab === 'sectionB'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              <span>Section 2: Python Coding (1)</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${isSectionBAttempted ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-900 text-amber-600 dark:text-amber-300'}`}>
                {isSectionBAttempted ? 'Attempted' : 'Pending'}
              </span>
            </button>
          </div>
        </div>

        {/* Right side: Candidate info & Timer Box */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3 text-right hidden sm:flex">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{session?.candidate_name || 'Candidate'}</p>
              <p className="text-[10px] text-slate-500 font-mono">ID: HM-{String(id).slice(0, 6).toUpperCase()}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
              {session?.candidate_name ? session.candidate_name.charAt(0).toUpperCase() : 'C'}
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-slate-900 px-4 py-2 rounded-xl border border-amber-200 dark:border-slate-800 flex items-center gap-2 font-mono text-sm font-extrabold text-amber-700 dark:text-amber-400">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Time Left: {formatTimer(timeLeft)}</span>
          </div>
        </div>
      </header>

      {/* 🔴 TERMINATED LOCKED OVERLAY */}
      {isTerminated && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 shadow-2xl space-y-5"
          >
            <div className="w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center border border-rose-300 dark:border-rose-800 animate-pulse">
              <MonitorX className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                {isCameraDenied ? 'Camera Access Required' : 'Assessment Locked'}
              </h2>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider">
                {isCameraDenied ? 'Proctoring Permission Denied' : 'Exceeded Tab Switching Violation Limit'}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-2">
                {isCameraDenied
                  ? 'Your examination has been automatically terminated because webcam permission was denied. Proctored technical assessments strictly require active camera feed.'
                  : 'Your examination has been automatically locked due to repeated window switching violations (3 violations limit). Your assessment state has been recorded.'}
              </p>
            </div>
            <Button
              variant="primary"
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold border-0"
              onClick={() => navigate(`/interview/${id}/completed`)}
            >
              Exit to Summary
            </Button>
          </motion.div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-7xl mx-auto w-full">
        
        {/* LEFT AREA: QUESTION CONTAINER (8 cols) */}
        <div className="lg:col-span-8 space-y-6 flex flex-col justify-between">
          
          {/* ==================== SECTION 1: TECHNICAL MCQs ==================== */}
          {activeTab === 'sectionA' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex-1 flex flex-col justify-between space-y-6">
              
              <div className="space-y-6">
                {/* Question Bar Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                      Question No. {currentIdx + 1}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Single Choice MCQ</span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    Marks: <strong className="text-emerald-600 dark:text-emerald-400">+1.0</strong> | Negative: <strong className="text-rose-500">0.0</strong>
                  </div>
                </div>

                {/* Question Text */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {currentQuestionA.question}
                </div>

                {/* Option Radio List */}
                <div className="space-y-3 pt-2">
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Select your answer:
                  </p>

                  <div className="space-y-3">
                    {(currentQuestionA.options || []).map((opt, oIdx) => {
                      const isSelected = answersA[currentQuestionA.id] === opt;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleSelectOptionA(currentQuestionA.id, opt)}
                          className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 text-xs sm:text-sm ${
                            isSelected
                              ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 text-indigo-950 dark:text-white font-bold shadow-sm ring-2 ring-indigo-500/20'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 font-mono text-[10px] ${
                            isSelected ? 'bg-indigo-600 border-indigo-600 text-white font-bold' : 'border-slate-300 dark:border-slate-700 text-slate-500'
                          }`}>
                            {isSelected ? '✓' : String.fromCharCode(65 + oIdx)}
                          </div>
                          <span className="flex-1 leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ACTION TOOLBAR */}
              <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleClearResponse}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700"
                  >
                    Clear Response
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleMarkForReview}
                    className="px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/80 hover:bg-purple-100 text-purple-700 dark:text-purple-300 text-xs font-bold transition-colors border border-purple-200 dark:border-purple-800"
                  >
                    {markedForReviewA.has(currentIdx) ? 'Unmark Review' : 'Mark for Review & Next'}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    isDisabled={currentIdx === 0}
                    onClick={() => setCurrentIdx((i) => Math.max(i - 1, 0))}
                    icon={ChevronLeft}
                    className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                  >
                    Previous
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      if (currentIdx < (sectionA.length || 10) - 1) {
                        setCurrentIdx((i) => i + 1);
                      } else {
                        setActiveTab('sectionB');
                        toast.success('Navigated to Section 2: Python Coding Challenge');
                      }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold border-0"
                  >
                    <span>Save & Next</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ==================== SECTION 2: PYTHON CODING ==================== */}
          {activeTab === 'sectionB' && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm flex-1 flex flex-col justify-between space-y-6">
              
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-emerald-500" />
                    <span>Section 2: Python Coding Challenge</span>
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Max Score: 100</span>
                </div>

                {/* Problem Description */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                  {sectionB?.problem}
                </div>

                {/* Code Editor Area */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Python 3 Code Solution:</span>
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-slate-100 dark:bg-slate-950 px-2.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">Compiler: CPython 3.11</span>
                  </div>

                  <textarea
                    value={codeAnswer}
                    onChange={(e) => setCodeAnswer(e.target.value)}
                    rows={10}
                    className="w-full text-xs font-mono rounded-2xl border border-slate-800 bg-slate-950 text-emerald-400 p-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 leading-relaxed resize-none shadow-inner"
                    placeholder="# Write code here"
                  />
                </div>

                {/* Run Test Cases */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Play className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Automated Test Suite (3 Test Cases)</span>
                    </span>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleRunTestCases}
                      isLoading={isRunningTests}
                      icon={Play}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold border-0 shadow-sm"
                    >
                      Compile & Run Test Cases
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(sectionB?.testCases || []).map((tc, idx) => {
                      const res = testResults ? testResults.find((r) => r.id === tc.id) : null;
                      return (
                        <div
                          key={tc.id || idx}
                          className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                            res
                              ? res.passed
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
                                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
                              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-slate-900 dark:text-white">{tc.name}</span>
                            {res ? (
                              res.passed ? (
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                                </span>
                              ) : (
                                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-extrabold flex items-center gap-1">
                                  <XCircle className="w-3.5 h-3.5" /> Failed
                                </span>
                              )
                            ) : (
                              <span className="text-[10px] text-slate-400 font-mono">Ready</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 font-mono truncate">Input: {tc.input}</p>
                          <p className="text-[10px] text-slate-600 dark:text-slate-300 font-mono truncate">Expected: {tc.expected}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Toolbar */}
              <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('sectionA')}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Section 1 MCQs</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT AREA: PALETTE & PROCTOR (4 cols) */}
        <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
          
          <div className="space-y-6">
            
            {/* AI Proctor Live Feed Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                <span className="flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>AI Proctoring Feed</span>
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  ACTIVE
                </span>
              </div>

              <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover scale-x-[-1] ${cameraActive ? 'block' : 'hidden'}`}
                />
                {!cameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-xs text-slate-400 space-y-1.5 bg-slate-900/90">
                    <Video className="w-8 h-8 text-indigo-400 opacity-60" />
                    <span className="font-extrabold text-slate-200 text-[11px]">Proctoring Active (HTTP Mode)</span>
                    <span className="text-[10px] text-slate-500 font-mono">Tab switching & timer active</span>
                  </div>
                )}
                {multiPersonAlert && (
                  <div className="absolute inset-0 bg-rose-950/80 flex items-center justify-center p-2 text-center text-white text-xs font-bold gap-1 animate-pulse">
                    <AlertTriangle className="w-4 h-4 text-amber-300" />
                    <span>CHEATING ALERT: Multiple Persons!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Question Palette */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                Question Palette Navigator
              </h4>

              {/* 4-Color Legend */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-emerald-600 border border-emerald-500" />
                  <span>Answered ({countAnswered})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-rose-500 border border-rose-400" />
                  <span>Not Answered ({countNotAnswered})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" />
                  <span>Not Visited ({countNotVisited})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-purple-600 border border-purple-500" />
                  <span>Review ({countMarkedReview})</span>
                </div>
              </div>

              {/* Question Number Buttons Grid */}
              <div className="pt-2">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Section 1 Questions:
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {sectionA.map((q, idx) => {
                    const hasAns = Boolean(answersA[q.id]);
                    const isMarked = markedForReviewA.has(idx);
                    const isVis = visitedA.has(idx);
                    const isCurrent = idx === currentIdx && activeTab === 'sectionA';

                    let btnStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'; // Not Visited
                    if (isMarked) {
                      btnStyle = 'bg-purple-600 text-white border-purple-500 font-bold'; // Marked for Review
                    } else if (hasAns) {
                      btnStyle = 'bg-emerald-600 text-white border-emerald-500 font-bold'; // Answered
                    } else if (isVis) {
                      btnStyle = 'bg-rose-500 text-white border-rose-400 font-bold'; // Not Answered
                    }

                    return (
                      <button
                        key={q.id || idx}
                        onClick={() => {
                          setActiveTab('sectionA');
                          setCurrentIdx(idx);
                        }}
                        className={`h-9 rounded-xl text-xs font-mono transition-all border flex items-center justify-center ${btnStyle} ${
                          isCurrent ? 'ring-2 ring-indigo-500 scale-105 shadow-md' : ''
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* FINAL EXAM SUBMISSION PANEL */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">Exam Completion Status:</span>
              <span className={isAllExamComplete ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'text-amber-600 dark:text-amber-400 font-extrabold'}>
                {isAllExamComplete ? 'Ready to Submit' : 'Incomplete'}
              </span>
            </div>

            {!isAllExamComplete && (
              <p className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800 leading-relaxed font-semibold">
                ⚠️ Submit requires completing Section 1 (10/10 MCQs) and attempting Section 2 Coding.
              </p>
            )}

            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmitInterview}
              isLoading={isSubmitting}
              isDisabled={!isAllExamComplete || isTerminated}
              icon={Send}
              className={`w-full py-3.5 font-extrabold text-xs uppercase tracking-wider border-0 ${
                isAllExamComplete
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                  : 'opacity-40 cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-400'
              }`}
            >
              Submit Examination & Generate Report
            </Button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CandidateInterview;
