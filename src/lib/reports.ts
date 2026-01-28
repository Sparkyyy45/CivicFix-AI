import { collection, query, where, getDocs, doc, runTransaction, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Complaint } from "@/types";

// Approximately 20 meters in degrees (rough estimation)
// 1 degree lat ~= 111km
// 0.0002 degrees ~= 22 meters
const DUPLICATE_THRESHOLD_DEG = 0.0002;

export async function checkForDuplicateReports(lat: number, lng: number): Promise<Complaint | null> {
    try {
        const complaintsRef = collection(db, "complaints");
        // Only check pending issues to avoid matching with resolved ones
        const q = query(complaintsRef, where("status", "==", "Pending"));

        const querySnapshot = await getDocs(q);

        let closestMatch: Complaint | null = null;
        let minDistance = Infinity;

        querySnapshot.forEach((doc) => {
            const data = doc.data() as Complaint;
            const reportLat = data.location.lat;
            const reportLng = data.location.lng;

            // Simple Euclidean distance for small distances is sufficient
            const dist = Math.sqrt(Math.pow(lat - reportLat, 2) + Math.pow(lng - reportLng, 2));

            if (dist < DUPLICATE_THRESHOLD_DEG && dist < minDistance) {
                minDistance = dist;
                closestMatch = { ...data, id: doc.id };
            }
        });

        return closestMatch;

    } catch (error) {
        console.error("Error checking for duplicates:", error);
        return null;
    }
}

export async function upvoteReport(reportId: string, userId: string): Promise<boolean> {
    try {
        const reportRef = doc(db, "complaints", reportId);

        await runTransaction(db, async (transaction) => {
            const reportDoc = await transaction.get(reportRef);
            if (!reportDoc.exists()) {
                throw new Error("Report does not exist!");
            }

            const data = reportDoc.data();
            const upvotedBy = data.upvotedBy || [];

            if (upvotedBy.includes(userId)) {
                // User has already upvoted. Treat as success (idempotent).
                return;
            }

            const newUpvotes = (data.upvotes || 0) + 1;
            const newUpvotedBy = [...upvotedBy, userId];

            transaction.update(reportRef, {
                upvotes: newUpvotes,
                upvotedBy: newUpvotedBy
            });
        });

        return true;
    } catch (error) {
        console.error("Error upvoting report:", error);
        return false;
    }
}
