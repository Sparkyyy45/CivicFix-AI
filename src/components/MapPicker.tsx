"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Loader2, Crosshair } from 'lucide-react';

// Default center (Generic city center - e.g., New Delhi or similar)
const DEFAULT_CENTER: [number, number] = [24.5854, 73.7125];

interface MapPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
}

interface SearchResult {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
}

function MapUpdater({ center }: { center: [number, number] | null }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 15);
        }
    }, [center, map]);
    return null;
}

function LocationMarker({ onLocationSelect, position, setPosition }: {
    onLocationSelect: (lat: number, lng: number) => void,
    position: any,
    setPosition: (pos: any) => void
}) {
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
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [markerPosition, setMarkerPosition] = useState<any>(null);
    const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

    useEffect(() => {
        // Fix for default marker icon in Next.js
        const L = require('leaflet');

        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
            iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
            shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        });

        setMounted(true);
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const selectLocation = (result: SearchResult) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        const newPos = { lat, lng };

        setMarkerPosition(newPos);
        setMapCenter([lat, lng]);
        onLocationSelect(lat, lng);
        setSearchResults([]);
        setSearchQuery(result.display_name.split(',')[0]); // Keep it short
    };

    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const newPos = { lat: latitude, lng: longitude };

                setMarkerPosition(newPos);
                setMapCenter([latitude, longitude]);
                onLocationSelect(latitude, longitude);
                setSearchQuery('');
                setIsLocating(false);
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert("Unable to retrieve your location");
                setIsLocating(false);
            }
        );
    };

    // Double check we're in browser environment
    if (!mounted || typeof window === 'undefined') {
        return <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-slate-400">Loading Map...</div>;
    }

    return (
        <div className="relative h-[400px] w-full rounded-lg overflow-hidden group">
            {/* Search Overlay */}
            <div className="absolute top-4 left-4 right-16 z-[1000] flex flex-col gap-2 max-w-sm">
                <form onSubmit={handleSearch} className="relative shadow-lg rounded-lg">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search location..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    {isSearching && (
                        <div className="absolute right-3 top-2.5">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        </div>
                    )}
                </form>

                {searchResults.length > 0 && (
                    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-slate-200 max-h-60 overflow-y-auto">
                        {searchResults.map((result) => (
                            <button
                                key={result.place_id}
                                onClick={() => selectLocation(result)}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 border-b border-slate-100 last:border-0 truncate"
                            >
                                {result.display_name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Geolocation Button */}
            <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={isLocating}
                className="absolute top-4 right-4 z-[1000] p-2.5 bg-white/95 backdrop-blur-sm border border-slate-200 shadow-lg rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 hover:text-blue-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                title="Use my location"
            >
                {isLocating ? (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                ) : (
                    <Crosshair className="h-5 w-5" />
                )}
            </button>

            <MapContainer center={DEFAULT_CENTER} zoom={13} scrollWheelZoom={false} className="h-full w-full z-0">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker
                    onLocationSelect={onLocationSelect}
                    position={markerPosition}
                    setPosition={setMarkerPosition}
                />
                <MapUpdater center={mapCenter} />
            </MapContainer>
        </div>
    );
}
