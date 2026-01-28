"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Default center (Generic city center - e.g., New Delhi or similar)
const DEFAULT_CENTER: [number, number] = [24.5854, 73.7125];

interface MapPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
}

function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    const [position, setPosition] = useState<any>(null); // Use any to avoid L type usage in state definition if L is not imported
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onLocationSelect(e.latlng.lat, e.latlng.lng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

export default function MapPicker({ onLocationSelect }: MapPickerProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Fix for default marker icon in Next.js
        // We import L here dynamically or just require it to ensure it runs on client
        const L = require('leaflet');

        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
            iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
            shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        });

        setMounted(true);
    }, []);

    // Double check we're in browser environment
    if (!mounted || typeof window === 'undefined') {
        return <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-slate-400">Loading Map...</div>;
    }

    return (
        <MapContainer center={DEFAULT_CENTER} zoom={13} scrollWheelZoom={false} className="h-[400px] w-full rounded-lg z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker onLocationSelect={onLocationSelect} />
        </MapContainer>
    );
}
