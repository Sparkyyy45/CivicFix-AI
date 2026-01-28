"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Complaint } from "@/types";
import { LayoutGrid, Map as MapIcon, Loader2, Calendar } from "lucide-react";
import dynamic from "next/dynamic";
import DashboardStats from "@/components/DashboardStats";
import IssueCard from "@/components/IssueCard";
import { motion, AnimatePresence } from 'framer-motion';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function AdminDashboard() {
    const { user, isAdmin, loading } = useAuth();
    const router = useRouter();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [viewMode, setViewMode] = useState<'map' | 'grid'>('grid');
    const [isLoadingData, setIsLoadingData] = useState(false);

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push('/');
        }
    }, [loading, isAdmin, router]);

    useEffect(() => {
        if (isAdmin) {
            const fetchData = async () => {
                setIsLoadingData(true);
                try {
                    const q = query(collection(db, "complaints"));
                    const querySnapshot = await getDocs(q);
                    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Complaint))
                        .sort((a, b) => {
                            const upvoteDiff = (b.upvotes || 0) - (a.upvotes || 0);
                            if (upvoteDiff !== 0) return upvoteDiff;
                            return b.createdAt - a.createdAt;
                        });
                    setComplaints(data);
                } catch (error) {
                    console.error("Error fetching admin data:", error);
                } finally {
                    setIsLoadingData(false);
                }
            };

            fetchData();
        }
    }, [isAdmin]);

    if (loading || (isAdmin && isLoadingData)) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-10 h-10 text-blue-600 animate-spin" /></div>;

    if (!isAdmin) return null;

    const stats = {
        totalUpvotes: complaints.reduce((sum, c) => sum + (c.upvotes || 0), 0),
        pendingCount: complaints.filter(c => c.status === 'Pending').length,
        resolvedCount: complaints.filter(c => c.status === 'Resolved').length
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header / Banner */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Live Operations Center
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 font-heading">City Dashboard</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </div>

                            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    <LayoutGrid className="w-4 h-4 mr-2" />
                                    Board
                                </button>
                                <button
                                    onClick={() => setViewMode('map')}
                                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    <MapIcon className="w-4 h-4 mr-2" />
                                    Map
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <DashboardStats {...stats} />

                <AnimatePresence mode="wait">
                    {viewMode === 'grid' && (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-800">Priority Issues</h2>
                                <span className="text-sm font-medium text-slate-500">Sorted by Impact (Votes)</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {complaints.map((complaint, index) => (
                                    <IssueCard key={complaint.id} complaint={complaint} index={index} />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {viewMode === 'map' && (
                        <motion.div
                            key="map"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden h-[700px] relative"
                        >

                            <MapView complaints={complaints} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
