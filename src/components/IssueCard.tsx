import { motion } from 'framer-motion';
import { Complaint } from '@/types';
import StatusBadge from './StatusBadge';
import { MapPin, ThumbsUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function IssueCard({ complaint, index }: { complaint: Complaint; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
        >
            <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                <img
                    src={complaint.imageUrl}
                    alt={complaint.description}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute top-3 right-3 flex gap-2">
                    <div className="bg-white/90 backdrop-blur text-slate-800 px-2 py-1 rounded-full text-xs font-bold shadow-sm flex items-center">
                        <StatusBadge status={complaint.status} />
                    </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border border-white/10">
                        <MapPin className="w-3 h-3 text-blue-400" />
                        <span className="font-mono">
                            {complaint.location.lat.toFixed(3)}, {complaint.location.lng.toFixed(3)}
                        </span>
                    </div>
                    {complaint.upvotes && complaint.upvotes > 0 ? (
                        <div className="bg-green-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-green-500/20">
                            <ThumbsUp className="w-3 h-3 fill-current" />
                            {complaint.upvotes}
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                        {complaint.category}
                    </span>
                    <span className="text-xs text-slate-400">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                    </span>
                </div>

                <h3 className="text-slate-800 font-bold mb-2 line-clamp-2 min-h-[3rem]">
                    {complaint.description}
                </h3>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
                    <div className="text-xs text-slate-500">
                        Dept: <span className="font-semibold text-slate-700">{complaint.department}</span>
                    </div>

                    <Link
                        href={`/complaint/${complaint.id}`}
                        className="text-blue-600 text-sm font-bold flex items-center hover:translate-x-1 transition-transform"
                    >
                        Manage <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
