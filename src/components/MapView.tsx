"use client";

import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Complaint } from '@/types';
import StatusBadge from './StatusBadge';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Custom icons based on urgency
const createIcon = (color: string) => L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -6]
});

const icons = {
    Critical: createIcon('#be123c'), // Rose-700
    High: createIcon('#ef4444'),   // Red
    Medium: createIcon('#f97316'), // Orange
    Low: createIcon('#eab308'),    // Yellow
    Resolved: createIcon('#22c55e') // Green
};

const DEFAULT_CENTER: [number, number] = [24.5854, 73.7125];

interface MapViewProps {
    complaints: Complaint[];
}

const getTooltipStyles = (urgency: string) => {
    switch (urgency) {
        case 'Critical':
        case 'High':
            return 'bg-red-600 text-white border-red-700 shadow-red-200';
        case 'Medium':
            return 'bg-orange-500 text-white border-orange-600 shadow-orange-200';
        case 'Low':
            return 'bg-yellow-400 text-yellow-900 border-yellow-500 shadow-yellow-200';
        default:
            return 'bg-white text-gray-800 border-gray-200';
    }
};

export default function MapView({ complaints }: MapViewProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    // Ensure we're in browser environment
    if (!mounted || typeof window === 'undefined') {
        return <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-lg"></div>;
    }

    return (
        <MapContainer center={DEFAULT_CENTER} zoom={12} scrollWheelZoom={false} className="h-[500px] w-full rounded-lg z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {complaints.map((complaint) => (
                <Marker
                    key={complaint.id}
                    position={[complaint.location.lat, complaint.location.lng]}
                    icon={complaint.status === 'Resolved' ? icons.Resolved : (icons[complaint.urgency as keyof typeof icons] || icons.Low)}
                >
                    {complaint.status !== 'Resolved' && (
                        <Tooltip
                            direction="top"
                            offset={[0, -10]}
                            opacity={1}
                            className="!bg-transparent !border-none !shadow-none !p-0 before:!hidden"
                        >
                            <div className={`px-3 py-2 rounded-lg shadow-lg border-2 font-medium text-sm flex flex-col items-center gap-1 ${getTooltipStyles(complaint.urgency)}`}>
                                {(complaint.urgency === 'High' || complaint.urgency === 'Critical') && (
                                    <span className="uppercase text-[10px] font-bold tracking-wider mb-0.5">Focus ASAP</span>
                                )}
                                <span>{complaint.category}</span>
                            </div>
                        </Tooltip>
                    )}
                    <Popup>
                        <div className="min-w-[200px]">
                            <h3 className="font-bold text-sm mb-1">{complaint.category}</h3>
                            <p className="text-xs text-gray-500 mb-2">{complaint.department}</p>
                            <div className="flex gap-2 mb-2">
                                <StatusBadge status={complaint.status} />
                                <StatusBadge urgency={complaint.urgency} />
                            </div>
                            <Link href={`/complaint/${complaint.id}`} className="text-blue-600 text-xs hover:underline">
                                View Details
                            </Link>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
