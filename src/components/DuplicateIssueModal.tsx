import { motion } from 'framer-motion';
import { Complaint } from '@/types';
import { X, ThumbsUp, AlertCircle, ArrowRight } from 'lucide-react';

interface DuplicateIssueModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpvote: (complaint: Complaint) => void;
    duplicateReport: Complaint | null;
}

export default function DuplicateIssueModal({ isOpen, onClose, onUpvote, duplicateReport }: DuplicateIssueModalProps) {
    if (!isOpen || !duplicateReport) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-md relative z-10"
            >
                <div className="relative h-48 bg-slate-200">
                    <img
                        src={duplicateReport.imageUrl}
                        alt="Existing Issue"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-orange-500/90 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Similar Issue Found
                    </div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 left-4 bg-white/50 backdrop-blur hover:bg-white text-slate-800 p-2 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Is this the same issue?</h3>
                    <p className="text-slate-500 text-sm mb-6">
                        We found a report very close to your location. Instead of creating a duplicate, you can upvote this existing issue to increase its priority.
                    </p>

                    <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                        <p className="font-medium text-slate-800 text-sm line-clamp-2">"{duplicateReport.description}"</p>
                        <div className="flex gap-3 mt-3 text-xs text-slate-500">
                            <span className="bg-white px-2 py-1 rounded border border-slate-200">{duplicateReport.category}</span>
                            <span className="bg-white px-2 py-1 rounded border border-slate-200">Reported {new Date(duplicateReport.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => onUpvote(duplicateReport)}
                            className="w-full bg-green-500 text-white py-3.5 rounded-xl font-bold hover:bg-green-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                        >
                            <ThumbsUp className="w-5 h-5" />
                            Yes, Upvote This Issue
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full bg-white text-slate-600 border border-slate-200 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                        >
                            No, Submit New Report
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
