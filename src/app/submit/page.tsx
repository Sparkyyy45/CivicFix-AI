"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { analyzeComplaint, AIAnalysisResult } from '@/lib/mockAI';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import dynamic from 'next/dynamic';
import { Camera, Loader2, CheckCircle, MapPin, AlertTriangle, ArrowLeft, ArrowRight, Brain, UploadCloud } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { motion, AnimatePresence } from 'framer-motion';
import { checkForDuplicateReports, upvoteReport } from '@/lib/reports';
import DuplicateIssueModal from '@/components/DuplicateIssueModal';
import { Complaint } from '@/types';
import { calculateRiskContext, RiskContext } from '@/lib/safety-shield';
import SafetyRiskBadge from '@/components/SafetyRiskBadge';

// Dynamically import MapPicker with SSR disabled
const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false });

export default function SubmitComplaint() {
    const { user } = useAuth();
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Duplicate Detection State
    const [duplicateReport, setDuplicateReport] = useState<Complaint | null>(null);
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);
    const [isUpvoting, setIsUpvoting] = useState(false);
    const [riskContext, setRiskContext] = useState<RiskContext | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAnalyze = async () => {
        if (!imageFile && !description) return;
        setIsAnalyzing(true);
        try {
            const result = await analyzeComplaint(description, imagePreview || undefined);
            setAnalysis(result);
            setStep(2);
        } catch (error) {
            console.error("Analysis failed:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleLocationSelect = async (lat: number, lng: number) => {
        setLocation({ lat, lng });

        // Calculate Safety Risk
        const risk = calculateRiskContext(lat, lng);
        setRiskContext(risk);

        // Check for duplicates
        const duplicate = await checkForDuplicateReports(lat, lng);
        if (duplicate) {
            setDuplicateReport(duplicate);
            setShowDuplicateModal(true);
        }
    };

    const handleUpvote = async (complaint: Complaint) => {
        if (!user) return;
        setIsUpvoting(true);
        try {
            await upvoteReport(complaint.id, user.uid);
            setShowDuplicateModal(false);
            // Show success for upvote and redirect
            alert("Thanks! You've upvoted the existing issue.");
            router.push('/dashboard');
        } catch (error) {
            console.error("Error upvoting:", error);
            alert("Something went wrong while upvoting.");
        } finally {
            setIsUpvoting(false);
        }
    };

    const handleSubmit = async () => {
        if (!user || !analysis || !location || !imageFile) {
            console.error("Missing required fields:", { user: !!user, analysis: !!analysis, location: !!location, imageFile: !!imageFile });
            return;
        }
        setIsSubmitting(true);

        try {
            console.log("Starting upload to Cloudinary...");

            // 1. Upload to Cloudinary
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

            if (!cloudName || !uploadPreset) {
                throw new Error("Cloudinary configuration is missing. Please check .env.local");
            }

            const formData = new FormData();
            formData.append('file', imageFile);
            formData.append('upload_preset', uploadPreset);
            formData.append('folder', 'civic-complaints');

            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Cloudinary Error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            const downloadURL = data.secure_url;

            console.log("Upload successful:", downloadURL);

            console.log("Saving to Firestore...");
            // 2. Save to Firestore
            await addDoc(collection(db, 'complaints'), {
                userId: user.uid,
                imageUrl: downloadURL,
                description: description,
                category: analysis.issue_type,
                department: analysis.department,
                urgency: riskContext?.level === 'CRITICAL' ? 'Critical' : analysis.urgency,
                status: 'Pending',
                location: location,
                createdAt: Date.now(),
                upvotes: 0,
                upvotedBy: []
            });

            console.log("Complaint saved successfully!");
            setStep(3);
        } catch (error: any) {
            console.error("Submission failed:", error);
            alert(`Failed to submit report: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <DuplicateIssueModal
                isOpen={showDuplicateModal}
                onClose={() => setShowDuplicateModal(false)}
                onUpvote={handleUpvote}
                duplicateReport={duplicateReport}
            />

            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-slate-900 mb-2 font-heading">Report an Issue</h1>
                <p className="text-slate-500">Help us identify and fix civic problems in your area.</p>
            </div>

            {/* Stepper */}
            <div className="flex justify-center mb-10">
                <div className="flex items-center gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= i ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-200 text-slate-400'
                                }`}>
                                {i}
                            </div>
                            {i < 3 && <div className={`w-12 h-1 rounded-full mx-2 ${step > i ? 'bg-blue-600' : 'bg-slate-200'}`}></div>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-white/60 relative overflow-hidden">
                <AnimatePresence mode='wait'>
                    {/* Step 1: Upload & Describe */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">What did you find?</h2>
                                <p className="text-slate-500 text-lg">Upload a photo to let our AI analyze the situation.</p>
                            </div>

                            <div className="grid md:grid-cols-12 gap-8 items-start">
                                {/* Upload Dropzone */}
                                <div className="md:col-span-7">
                                    <div className={`
                                        border-3 border-dashed rounded-[2rem] p-8 text-center transition-all relative group h-[400px] flex flex-col items-center justify-center overflow-hidden
                                        ${imagePreview
                                            ? 'border-transparent shadow-2xl shadow-blue-500/10'
                                            : 'border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/30'
                                        }
                                    `}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                        />

                                        {imagePreview ? (
                                            <div className="absolute inset-0 w-full h-full bg-slate-100">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center z-10 backdrop-blur-sm">
                                                    <Camera className="w-12 h-12 text-white mb-2" />
                                                    <p className="text-white font-bold text-lg">Change Photo</p>
                                                    <p className="text-white/80 text-sm">Click or drop new image</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center relative z-10 pointer-events-none">
                                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-blue-100 group-hover:scale-110 group-hover:shadow-blue-200 transition-all duration-300">
                                                    <UploadCloud className="w-10 h-10 text-blue-500 group-hover:text-blue-600" />
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-800 mb-2">Upload Photo</h3>
                                                <p className="text-slate-400 font-medium">Drag & drop or tap to browse</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Details & Action */}
                                <div className="md:col-span-5 flex flex-col h-full gap-6">
                                    <div className="flex-1 bg-white/50 rounded-[2rem] border border-white/60 shadow-lg p-6 backdrop-blur-sm">
                                        <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                                            <div className="w-1 h-4 bg-blue-500 rounded-full" />
                                            Additional Details
                                        </label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full h-[220px] rounded-xl border-0 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 shadow-inner transition-all p-5 resize-none outline-none text-slate-600 placeholder:text-slate-400 text-lg leading-relaxed"
                                            placeholder="Describe the issue... e.g. 'Large pothole on the corner of 5th and Main causing traffic backup.'"
                                        ></textarea>
                                    </div>

                                    <button
                                        onClick={handleAnalyze}
                                        disabled={!imagePreview && !description}
                                        className={`
                                            w-full py-5 rounded-2xl font-bold text-lg shadow-xl transition-all flex justify-center items-center group
                                            ${(!imagePreview && !description)
                                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed translate-y-0'
                                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-1'
                                            }
                                        `}
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                Analyze Complaint
                                                <Brain className="w-6 h-6 ml-2 group-hover:rotate-12 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Review & Location */}
                    {step === 2 && analysis && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-blue-500/5 group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                                <div className="flex items-center gap-4 mb-8 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600 shadow-sm border border-green-200">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">AI Analysis Complete</h3>
                                        <p className="text-slate-500 font-medium">We've categorized your report</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                    <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 hover:scale-[1.02] transition-transform">
                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2 block">Issue Category</span>
                                        <p className="font-bold text-slate-800 text-xl flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                                            {analysis.issue_type}
                                        </p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 hover:scale-[1.02] transition-transform">
                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2 block">Department</span>
                                        <p className="font-bold text-slate-800 text-xl flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                            {analysis.department}
                                        </p>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 hover:scale-[1.02] transition-transform">
                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2 block">Urgency Level</span>
                                        <div className="mt-1 transform origin-left scale-110"><StatusBadge urgency={analysis.urgency} /></div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 hover:scale-[1.02] transition-transform">
                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2 block">Analysis Note</span>
                                        <p className="text-sm text-slate-600 mt-1 line-clamp-2 font-medium leading-relaxed" title={analysis.reason}>{analysis.reason}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <div className="bg-red-100 p-2 rounded-lg text-red-500">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    Pin Exact Location
                                </label>
                                <div className="h-96 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl shadow-slate-200/50 relative group">
                                    <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2rem] z-10 pointer-events-none"></div>
                                    <MapPicker onLocationSelect={handleLocationSelect} />
                                    {!location && (
                                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/90 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce flex items-center gap-2 z-20 pointer-events-none">
                                            <AlertTriangle className="w-4 h-4" />
                                            Tap map to pin location
                                        </div>
                                    )}
                                </div>

                                <AnimatePresence>
                                    {location && riskContext && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                        >
                                            <SafetyRiskBadge riskContext={riskContext} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-8 py-5 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-colors flex items-center shadow-lg shadow-slate-200/20 bg-white border border-slate-100"
                                    disabled={isSubmitting}
                                >
                                    <ArrowLeft className="w-5 h-5 mr-2" />
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!location || isSubmitting}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-5 rounded-2xl font-bold text-xl hover:shadow-green-500/40 transition-all shadow-xl shadow-green-500/20 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                    <span className="relative z-10 flex items-center">
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                                Submitting Report...
                                            </>
                                        ) : (
                                            <>
                                                Submit Report
                                                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </span>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Success */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-20 relative"
                        >
                            {/* Confetti elements (visual) */}
                            <div className="absolute top-0 left-1/4 w-3 h-3 bg-red-400 rounded-full animate-ping opacity-20"></div>
                            <div className="absolute bottom-20 right-1/4 w-4 h-4 bg-blue-400 rounded-full animate-ping delay-300 opacity-20"></div>

                            <motion.div
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", duration: 0.8 }}
                                className="inline-flex items-center justify-center w-32 h-32 bg-green-100 rounded-[2.5rem] mb-10 relative shadow-2xl shadow-green-200"
                            >
                                <div className="absolute inset-0 bg-green-400 rounded-[2.5rem] animate-ping opacity-20"></div>
                                <CheckCircle className="w-16 h-16 text-green-600 relative z-10" />
                            </motion.div>

                            <h2 className="text-5xl font-black text-slate-900 mb-6 font-heading tracking-tight">Report Submitted!</h2>
                            <p className="text-slate-500 mb-12 max-w-lg mx-auto text-xl leading-relaxed">
                                Your report has been routed to the <br />
                                <strong className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">{analysis?.department}</strong>
                            </p>

                            <div className="max-w-xs mx-auto bg-slate-50 rounded-2xl p-6 border-2 border-dashed border-slate-200 mb-12 relative overflow-hidden">
                                <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2">Ticket Reference</span>
                                <div className="text-3xl font-mono font-bold text-slate-700 tracking-wider mt-2">#{Math.floor(Math.random() * 10000)}</div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-5">
                                <button
                                    onClick={() => router.push('/')}
                                    className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold shadow-xl shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-600/30 transition-all hover:-translate-y-1 block"
                                >
                                    Return to Home
                                </button>
                                <button
                                    onClick={() => {
                                        setStep(1);
                                        setImageFile(null);
                                        setImagePreview(null);
                                        setDescription('');
                                        setLocation(null);
                                        setDuplicateReport(null);
                                    }}
                                    className="bg-white text-slate-700 border-2 border-slate-100 px-10 py-5 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-200 transition-all"
                                >
                                    Report Another
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
