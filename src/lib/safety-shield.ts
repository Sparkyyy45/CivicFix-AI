
// Mock database of High Risk Zones in Udaipur
// In a real app, this would likely come from a geospatial database or API
interface RiskZone {
    id: string;
    name: string;
    type: 'School' | 'Hospital' | 'College';
    lat: number;
    lng: number;
    radiusInMeters: number;
}

const UDAIPUR_RISK_ZONES: RiskZone[] = [
    // Hospitals
    { id: 'h1', name: 'Geetanjali Medical College & Hospital', type: 'Hospital', lat: 24.5530798, lng: 73.7321742, radiusInMeters: 300 },
    { id: 'h2', name: 'Alakh Nayan Mandir Eye Hospital', type: 'Hospital', lat: 24.5861106, lng: 73.7091065, radiusInMeters: 300 },
    { id: 'h3', name: 'J.P. Orthopaedic Hospital', type: 'Hospital', lat: 24.5793365, lng: 73.7111793, radiusInMeters: 300 },
    { id: 'h4', name: 'Amar Ashish Hospital', type: 'Hospital', lat: 24.5907616, lng: 73.6923100, radiusInMeters: 300 },
    { id: 'h5', name: 'MB Govt Hospital', type: 'Hospital', lat: 24.5902, lng: 73.6915, radiusInMeters: 400 }, // Central hospital, larger radius

    // Colleges/Universities
    { id: 'c1', name: 'Mohanlal Sukhadia University', type: 'College', lat: 24.5943688, lng: 73.7316634, radiusInMeters: 500 }, // Large campus
    { id: 'c2', name: 'Pacific Institute of Technology', type: 'College', lat: 24.5991548, lng: 73.7764558, radiusInMeters: 400 },
    { id: 'c3', name: 'Rajasthan College of Agriculture', type: 'College', lat: 24.5826908, lng: 73.7042005, radiusInMeters: 300 },
    { id: 'c4', name: 'IIM Udaipur', type: 'College', lat: 24.5360, lng: 73.6652, radiusInMeters: 500 },
];

export interface RiskContext {
    level: 'CRITICAL' | 'NORMAL';
    reason: string;
    score: number;
    zoneName?: string;
    zoneType?: string;
}

function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d * 1000; // Distance in meters
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

export function calculateRiskContext(lat: number, lng: number): RiskContext {
    for (const zone of UDAIPUR_RISK_ZONES) {
        const distance = getDistanceFromLatLonInMeters(lat, lng, zone.lat, zone.lng);

        if (distance <= zone.radiusInMeters) {
            return {
                level: 'CRITICAL',
                reason: `${zone.type} Zone Detected: ${zone.name}`,
                score: 100,
                zoneName: zone.name,
                zoneType: zone.type
            };
        }
    }

    return {
        level: 'NORMAL',
        reason: 'Standard Zone',
        score: 10
    };
}
