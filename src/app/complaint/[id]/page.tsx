"use client";

import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Complaint } from "@/types";
import StatusBadge from "@/components/StatusBadge";
import { MapPin, Calendar, User, ArrowLeft, Loader2, CheckCircle, Clock, Activity } from "lucide-react";
import dynamic from "next/dynamic";
import { useMap } from "react-leaflet";
import IssueVerification from "@/components/IssueVerification";
import { AnimatePresence } from "framer-motion";

// Mini map component for details view
const MiniMap = dynamic(() => import('@/components/MapView'), { ssr: false });
// Actually MapView expects array, maybe I can reuse MapPicker in read-only mode or just MapView with 1 item?
// MapView takes array. I'll pass [complaint].

export default function ComplaintDetails() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const { id } = useParams();
    const router = useRouter();
    const [complaint, setComplaint] = useState<Complaint | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [showVerification, setShowVerification] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchComplaint = async () => {
                try {
                    const docRef = doc(db, "complaints", id as string);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setComplaint({ id: docSnap.id, ...docSnap.data() } as Complaint);
                    } else {
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error("Error getting document:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchComplaint();
        }
    }, [id]);

    const updateStatus = async (newStatus: 'Pending' | 'In Progress' | 'Resolved') => {
        if (!complaint) return;
        setUpdating(true);
        try {
            const docRef = doc(db, "complaints", complaint.id);
            await updateDoc(docRef, { status: newStatus });
            setComplaint({ ...complaint, status: newStatus });
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setUpdating(false);
        }
    };

    const handleVerificationConfirm = async () => {
        setShowVerification(false);
        await updateStatus('Resolved');
    };

    if (authLoading || loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    if (!complaint) return <div className="p-10 text-center">Complaint not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 transition mb-4"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
            </button>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2 h-64 md:h-auto relative bg-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={complaint.imageUrl}
                            alt="Issue"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="p-8 md:w-1/2 space-y-6">
                        <div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-bold text-blue-600 uppercase tracking-wide">{complaint.category}</p>
                                    <h1 className="text-2xl font-bold text-gray-900 mt-1">{complaint.department}</h1>
                                </div>
                                <StatusBadge urgency={complaint.urgency} />
                            </div>
                            <p className="mt-4 text-gray-600">{complaint.description}</p>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-500 border-t pt-4">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(complaint.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                                <StatusBadge status={complaint.status} />
                            </div>
                        </div>

                        {isAdmin && (
                            <div className="pt-4 border-t">
                                <p className="text-sm font-semibold text-gray-700 mb-3">Admin Actions</p>
                                <div className="flex flex-wrap gap-2">
                                    {complaint.status !== 'In Progress' && complaint.status !== 'Resolved' && (
                                        <button
                                            onClick={() => updateStatus('In Progress')}
                                            disabled={updating}
                                            className="flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition text-sm font-medium"
                                        >
                                            <Clock className="w-4 h-4 mr-2" />
                                            Mark In Progress
                                        </button>
                                    )}
                                    {complaint.status !== 'Resolved' && (
                                        <button
                                            onClick={() => setShowVerification(true)}
                                            disabled={updating}
                                            className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition text-sm font-medium"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Mark Resolved
                                        </button>
                                    )}
                                    {updating && <Loader2 className="w-5 h-5 animate-spin text-gray-500" />}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Verification Modal */}
            <AnimatePresence>
                {showVerification && complaint && (
                    <IssueVerification
                        issueId={complaint.id}
                        category={complaint.category}
                        originalImageUrl={complaint.imageUrl}
                        onConfirm={handleVerificationConfirm}
                        onCancel={() => setShowVerification(false)}
                    />
                )}
            </AnimatePresence>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                    Location
                </h2>
                <div className="h-[300px] rounded-lg overflow-hidden border border-gray-200">
                    <MiniMap complaints={[complaint]} />
                </div>
            </div>
        </div>
    );
}
