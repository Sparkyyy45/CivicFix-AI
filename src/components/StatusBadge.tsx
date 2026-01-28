import React from 'react';

type StatusType = 'Pending' | 'In Progress' | 'Resolved';
type UrgencyType = 'Critical' | 'High' | 'Medium' | 'Low';

interface StatusBadgeProps {
    status?: StatusType | string;
    urgency?: UrgencyType | string;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Pending': return 'bg-blue-100 text-blue-800';
        case 'In Progress': return 'bg-yellow-100 text-yellow-800';
        case 'Resolved': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
        case 'Critical': return 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-200';
        case 'High': return 'bg-red-100 text-red-800';
        case 'Medium': return 'bg-orange-100 text-orange-800';
        case 'Low': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export default function StatusBadge({ status, urgency }: StatusBadgeProps) {
    if (status) {
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                {status}
            </span>
        );
    }

    if (urgency) {
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(urgency)}`}>
                {urgency} Priority
            </span>
        );
    }

    return null;
}
