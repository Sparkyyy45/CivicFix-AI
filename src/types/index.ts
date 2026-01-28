export interface Complaint {
    id: string;
    userId: string;
    imageUrl: string;
    description: string;
    category: string;
    department: string;
    urgency: 'Critical' | 'High' | 'Medium' | 'Low';
    status: 'Pending' | 'In Progress' | 'Resolved';
    location: { lat: number; lng: number };
    createdAt: number;
    upvotes?: number;
    upvotedBy?: string[]; // Array of user IDs who have upvoted
}
