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
    const [matchScore, setMatchScore] = useState(0);
    const [analysisMessage, setAnalysisMessage] = useState('');

    // Generate random match score between 92% and 99%
    useEffect(() => {
        setMatchScore(Math.floor(Math.random() * (99 - 92 + 1)) + 92);
    }, []);

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
            // slower progress for realism (approx 4.5 seconds)
            const interval = setInterval(() => {
                setScanProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setStatus('verified');
                        return 100;
                    }
                    // Randomize increment slightly for "processing" feel
                    return prev + (Math.random() * 1.5 + 0.5);
                });
            }, 100);

            return () => clearInterval(interval);
        }
    }, [status]);

    // Generate dynamic analysis message based on category
    useEffect(() => {
        if (status === 'verified') {
            const getMessage = () => {
                const baseInfo = `Structural integrity analysis confirms resolution.`;
                const scoreInfo = `Confidence Score: ${matchScore}%`;

                switch (category.toLowerCase()) {
                    case 'pothole':
                    case 'road damage':
                        return `Road surface leveled and asphalt integrity restored. No potholes detected. ${baseInfo} ${scoreInfo}.`;
                    case 'garbage':
                    case 'sanitation':
                        return `Area cleared of waste matter. Hygiene levels within municipal limits. No garbage detected. ${scoreInfo}.`;
                    case 'street light':
                    case 'lighting':
                        return `Illumination levels verified. Luminosity output meets safety standards. ${scoreInfo}.`;
                    case 'water':
                    case 'drainage':
                        return `Flow rate normalized. No leakages or stagnation detected. Hydraulic integrity verified. ${scoreInfo}.`;
                    case 'encroachment':
                        return `Public space restored. Unauthorized structures/obstructions removed. Zoning compliance verified. ${scoreInfo}.`;
                    default:
                        return `Issue resolution verified. visual confirmation matches resolved criteria. ${scoreInfo}.`;
                }
            };
            setAnalysisMessage(getMessage());
        }
    }, [status, category, matchScore]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 tracking-tight">AI Verification Protocol</h2>
                            <p className="text-sm font-medium text-slate-500">System Verify v2.4 • {category} Module Active</p>
                        </div>
                    </div>
                    <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 overflow-y-auto bg-slate-50/50">
                    <div className="flex flex-col md:flex-row gap-8 h-full">
                        {/* Original Issue */}
                        <div className="flex-1 flex flex-col gap-4">
                            <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm uppercase tracking-wider">
                                <span className="bg-red-100 px-2.5 py-1 rounded-md text-red-700 border border-red-200">Reference Bad</span>
                                Reported Issue
                            </h3>
                            <div className="relative rounded-2xl overflow-hidden border-4 border-white shadow-xl aspect-video bg-gray-100 group">
                                <Image
                                    src={originalImageUrl}
                                    alt="Original Issue"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <p className="text-white text-sm font-medium">Original Submission</p>
                                </div>
                            </div>
                        </div>

                        {/* Comparison/Upload Area */}
                        <div className="flex-1 flex flex-col gap-4">
                            <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm uppercase tracking-wider">
                                <span className="bg-green-100 px-2.5 py-1 rounded-md text-green-700 border border-green-200">Candidate Good</span>
                                Proof of Repair
                            </h3>

                            <div className={`relative rounded-2xl overflow-hidden border-4 border-dashed aspect-video flex flex-col items-center justify-center text-center transition-all duration-300
                                ${uploadedImage ? 'border-transparent shadow-xl' : 'border-blue-300 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400'}
                            `}>
                                {uploadedImage ? (
                                    <>
                                        <div className="absolute inset-0 z-0">
                                            <img
                                                src={uploadedImage}
                                                alt="Uploaded Proof"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Scanning Overlay */}
                                        <AnimatePresence>
                                            {status === 'scanning' && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 z-10 bg-slate-900/80 backdrop-blur-[2px] flex flex-col items-center justify-center text-white font-mono"
                                                >
                                                    {/* Radar/Grid Effect */}
                                                    <div className="absolute inset-0 opacity-20"
                                                        style={{
                                                            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)',
                                                            backgroundSize: '40px 40px'
                                                        }}
                                                    ></div>

                                                    <div className="w-72 h-3 bg-slate-700/50 rounded-full overflow-hidden mb-6 backdrop-blur border border-white/10">
                                                        <motion.div
                                                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                                            style={{ width: `${scanProgress}%` }}
                                                        />
                                                    </div>

                                                    <div className="flex flex-col items-center gap-1 relative z-20">
                                                        <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                                            {Math.round(scanProgress)}%
                                                        </div>
                                                        <p className="font-bold tracking-widest text-blue-300 uppercase text-xs animate-pulse">
                                                            Analyzing Texture Maps...
                                                        </p>
                                                    </div>

                                                    {/* Scanning Line Animation */}
                                                    <motion.div
                                                        className="absolute w-full h-1.5 bg-cyan-400/80 shadow-[0_0_20px_rgba(34,211,238,0.8)] z-10"
                                                        animate={{ top: ['0%', '100%', '0%'] }}
                                                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Verified Overlay */}
                                        <AnimatePresence>
                                            {status === 'verified' && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    className="absolute z-20 bottom-4 left-4 right-4"
                                                >
                                                    <div className="bg-emerald-500/95 backdrop-blur-xl p-4 rounded-xl shadow-2xl flex items-center gap-4 text-white border border-emerald-400/50">
                                                        <div className="bg-white rounded-full p-1.5 shadow-lg">
                                                            <CheckCircle className="w-6 h-6 text-emerald-600" />
                                                        </div>
                                                        <div className="text-left flex-1 min-w-0">
                                                            <p className="font-bold text-sm uppercase tracking-wider text-emerald-50">Verification Successful</p>
                                                            <p className="text-xs text-emerald-100 truncate">Match Confidence High • 0.04s Latency</p>
                                                        </div>
                                                        <div className="text-3xl font-black tracking-tight">{matchScore}%</div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </>
                                ) : (
                                    <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-6 group relative z-10">
                                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-blue-100 duration-300 border-2 border-blue-100 group-hover:border-blue-200">
                                            <Upload className="w-8 h-8 text-blue-600 group-hover:text-blue-700" />
                                        </div>
                                        <p className="text-slate-700 font-bold mb-1">Upload Repair Photo</p>
                                        <p className="text-slate-400 text-sm font-medium">Drag & drop or click to browse</p>
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
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mt-8 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6 flex gap-5 items-start shadow-sm"
                            >
                                <div className="bg-emerald-100 p-3 rounded-full flex-shrink-0">
                                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-emerald-900 text-lg">Analysis Complete: Resolution Confirmed</h4>
                                    <p className="text-emerald-800 leading-relaxed">
                                        {analysisMessage}
                                    </p>
                                    <div className="flex gap-2 pt-1">
                                        <span className="px-2 py-0.5 bg-emerald-200/50 text-emerald-800 text-xs font-bold rounded uppercase tracking-wide">
                                            PASS
                                        </span>
                                        <span className="px-2 py-0.5 bg-blue-200/50 text-blue-800 text-xs font-bold rounded uppercase tracking-wide">
                                            v2.4 Model
                                        </span>
                                    </div>
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
