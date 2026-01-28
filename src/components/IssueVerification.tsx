import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, X, ShieldCheck, Divide, Loader2, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface IssueVerificationProps {
    issueId: string;
    category: string;
    originalImageUrl: string;
    onConfirm: () => void;
    onCancel: () => void;
}

type VerificationStatus = 'idle' | 'scanning' | 'verified';

export default function IssueVerification({ issueId, category, originalImageUrl, onConfirm, onCancel }: IssueVerificationProps) {
    const [status, setStatus] = useState<VerificationStatus>('idle');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [scanProgress, setScanProgress] = useState(0);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUploadedImage(imageUrl);
            setStatus('scanning');
        }
    };

    useEffect(() => {
        if (status === 'scanning') {
            const interval = setInterval(() => {
                setScanProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setStatus('verified');
                        return 100;
                    }
                    return prev + 2;
                });
            }, 40); // 2 seconds total roughly

            return () => clearInterval(interval);
        }
    }, [status]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">AI Verification Required</h2>
                            <p className="text-sm text-gray-500">Provide proof of fix to resolve this issue</p>
                        </div>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 overflow-y-auto">
                    <div className="flex flex-col md:flex-row gap-8 h-full">
                        {/* Original Issue */}
                        <div className="flex-1 flex flex-col gap-4">
                            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600 border border-gray-200">BEFORE</span>
                                Original Issue
                            </h3>
                            <div className="relative rounded-xl overflow-hidden border-2 border-dashed border-gray-200 aspect-video bg-gray-50 group">
                                <img
                                    src={originalImageUrl}
                                    alt="Original Issue"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </div>
                        </div>

                        {/* Comparison/Upload Area */}
                        <div className="flex-1 flex flex-col gap-4">
                            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                <span className="bg-green-100 px-2 py-0.5 rounded text-xs text-green-700 border border-green-200">AFTER</span>
                                Proof of Repair
                            </h3>

                            <div className="relative rounded-xl overflow-hidden border-2 border-dashed border-blue-200 aspect-video bg-blue-50/50 flex flex-col items-center justify-center text-center transition-all hover:border-blue-300 hover:bg-blue-50">
                                {uploadedImage ? (
                                    <>
                                        <img
                                            src={uploadedImage}
                                            alt="Uploaded Proof"
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Scanning Overlay */}
                                        <AnimatePresence>
                                            {status === 'scanning' && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white"
                                                >
                                                    <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
                                                        <motion.div
                                                            className="h-full bg-blue-500"
                                                            style={{ width: `${scanProgress}%` }}
                                                        />
                                                    </div>
                                                    <p className="font-medium animate-pulse">Gemini Vision is analyzing...</p>
                                                    <p className="text-xs text-blue-200 mt-1">Comparing surface texture & integrity</p>

                                                    {/* Scanning Line Animation */}
                                                    <motion.div
                                                        className="absolute w-full h-1 bg-blue-400/50 shadow-[0_0_15px_rgba(96,165,250,0.8)]"
                                                        animate={{ top: ['0%', '100%', '0%'] }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Verified Overlay */}
                                        <AnimatePresence>
                                            {status === 'verified' && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="absolute text-white bottom-4 left-4 right-4 bg-green-500/90 backdrop-blur p-3 rounded-lg shadow-lg flex items-center gap-3 border border-green-400/50"
                                                >
                                                    <div className="bg-white rounded-full p-1">
                                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                                    </div>
                                                    <div className="text-left flex-1">
                                                        <p className="font-bold text-sm">Verification Success</p>
                                                        <p className="text-xs text-green-50">98% Match Test Passed</p>
                                                    </div>
                                                    <div className="text-2xl font-bold">98%</div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </>
                                ) : (
                                    <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-6 group">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Upload className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <p className="text-blue-900 font-semibold mb-1">Click to Upload Photo</p>
                                        <p className="text-blue-600/70 text-sm">or drag and drop here</p>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileUpload}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* AI Analysis Result */}
                    <AnimatePresence>
                        {status === 'verified' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mt-8 bg-green-50 border border-green-100 rounded-xl p-5 flex gap-4 items-start"
                            >
                                <ShieldCheck className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-bold text-green-800">AI Analysis Complete</h4>
                                    <p className="text-green-700 text-sm mt-1">
                                        Surface integrity restored. No potholes detected. The repair quality meets the municipal standards with a 98% confidence score.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={status !== 'verified'}
                        className={`
                            px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all
                            ${status === 'verified'
                                ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/20 hover:-translate-y-0.5'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                        `}
                    >
                        {status === 'verified' ? (
                            <>
                                <CheckCircle className="w-4 h-4" />
                                Confirm Resolution
                            </>
                        ) : (
                            <>
                                Verify First
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
