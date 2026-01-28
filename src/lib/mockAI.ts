export interface AIAnalysisResult {
    issue_type: string;
    department: string;
    urgency: 'High' | 'Medium' | 'Low';
    reason: string;
}

export const analyzeComplaint = async (description: string, imageUrl?: string): Promise<AIAnalysisResult> => {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const desc = description.toLowerCase();

    // ROAD & INFRASTRUCTURE ISSUES (1-10)
    if (desc.includes('pothole') || desc.includes('crater') || desc.includes('hole in road')) {
        return {
            issue_type: 'Pothole',
            department: 'Municipal Roads',
            urgency: 'High',
            reason: 'Potholes pose immediate safety hazards to vehicles and pedestrians, can cause accidents.'
        };
    }

    if (desc.includes('road damage') || desc.includes('broken road') || desc.includes('cracked road')) {
        return {
            issue_type: 'Road Damage',
            department: 'Municipal Roads',
            urgency: 'High',
            reason: 'Damaged roads create safety hazards and traffic disruptions.'
        };
    }

    if (desc.includes('footpath') || desc.includes('sidewalk') || desc.includes('pavement broken')) {
        return {
            issue_type: 'Footpath Damage',
            department: 'Municipal Infrastructure',
            urgency: 'Medium',
            reason: 'Broken footpaths endanger pedestrians, especially elderly and disabled citizens.'
        };
    }

    if (desc.includes('bridge') || desc.includes('overpass') || desc.includes('flyover')) {
        return {
            issue_type: 'Bridge/Flyover Issue',
            department: 'Public Works Department',
            urgency: 'High',
            reason: 'Bridge structural issues require immediate inspection for public safety.'
        };
    }

    if (desc.includes('manhole') || desc.includes('open drain cover') || desc.includes('missing cover')) {
        return {
            issue_type: 'Open Manhole',
            department: 'Sewage & Drainage',
            urgency: 'High',
            reason: 'Open manholes are life-threatening hazards, especially during night or rain.'
        };
    }

    if (desc.includes('speed breaker') || desc.includes('speed bump') || desc.includes('rumble strip')) {
        return {
            issue_type: 'Speed Breaker Issue',
            department: 'Traffic Management',
            urgency: 'Medium',
            reason: 'Improper speed breakers can damage vehicles and cause accidents.'
        };
    }

    if (desc.includes('road marking') || desc.includes('zebra crossing') || desc.includes('lane marking')) {
        return {
            issue_type: 'Road Marking Faded',
            department: 'Traffic Management',
            urgency: 'Medium',
            reason: 'Faded road markings reduce traffic safety and cause confusion.'
        };
    }

    if (desc.includes('divider') || desc.includes('median') || desc.includes('road barrier')) {
        return {
            issue_type: 'Road Divider Damage',
            department: 'Municipal Roads',
            urgency: 'Medium',
            reason: 'Damaged dividers can lead to wrong-way driving and accidents.'
        };
    }

    if (desc.includes('construction debris') || desc.includes('construction material') || desc.includes('building waste on road')) {
        return {
            issue_type: 'Construction Debris',
            department: 'Municipal Corporation',
            urgency: 'Medium',
            reason: 'Construction debris blocks roads and creates safety hazards.'
        };
    }

    if (desc.includes('encroachment') || desc.includes('illegal shop') || desc.includes('hawker blocking')) {
        return {
            issue_type: 'Road Encroachment',
            department: 'Municipal Enforcement',
            urgency: 'Medium',
            reason: 'Encroachments reduce road width and cause traffic congestion.'
        };
    }

    // SANITATION & WASTE MANAGEMENT (11-20)
    if (desc.includes('garbage') || desc.includes('trash pile') || desc.includes('waste accumulation')) {
        return {
            issue_type: 'Garbage Accumulation',
            department: 'Sanitation Department',
            urgency: 'Medium',
            reason: 'Accumulated waste causes health hazards, attracts pests, and creates foul odors.'
        };
    }

    if (desc.includes('overflowing bin') || desc.includes('dustbin full') || desc.includes('trash can overflow')) {
        return {
            issue_type: 'Overflowing Dustbin',
            department: 'Sanitation Department',
            urgency: 'Medium',
            reason: 'Overflowing bins spread litter and create unhygienic conditions.'
        };
    }

    if (desc.includes('garbage truck') || desc.includes('waste collection') || desc.includes('trash not picked')) {
        return {
            issue_type: 'Missed Garbage Collection',
            department: 'Sanitation Department',
            urgency: 'Medium',
            reason: 'Irregular waste collection leads to garbage buildup and sanitation issues.'
        };
    }

    if (desc.includes('illegal dumping') || desc.includes('unauthorized dump') || desc.includes('waste dump')) {
        return {
            issue_type: 'Illegal Dumping',
            department: 'Sanitation & Enforcement',
            urgency: 'High',
            reason: 'Illegal dumping violates regulations and creates environmental hazards.'
        };
    }

    if (desc.includes('medical waste') || desc.includes('hospital waste') || desc.includes('biomedical')) {
        return {
            issue_type: 'Medical Waste Disposal',
            department: 'Health Department',
            urgency: 'High',
            reason: 'Improper medical waste disposal poses serious health and biohazard risks.'
        };
    }

    if (desc.includes('plastic waste') || desc.includes('plastic pollution') || desc.includes('single-use plastic')) {
        return {
            issue_type: 'Plastic Waste Issue',
            department: 'Environment Department',
            urgency: 'Medium',
            reason: 'Plastic waste contributes to environmental pollution and drainage blockage.'
        };
    }

    if (desc.includes('e-waste') || desc.includes('electronic waste') || desc.includes('old electronics')) {
        return {
            issue_type: 'E-Waste Disposal',
            department: 'Environment Department',
            urgency: 'Medium',
            reason: 'E-waste contains toxic materials requiring specialized disposal.'
        };
    }

    if (desc.includes('public toilet dirty') || desc.includes('restroom filthy') || desc.includes('washroom unclean')) {
        return {
            issue_type: 'Public Toilet Maintenance',
            department: 'Sanitation Department',
            urgency: 'Medium',
            reason: 'Unclean public toilets create health hazards and discourage usage.'
        };
    }

    if (desc.includes('litter') || desc.includes('littering') || desc.includes('people throwing trash')) {
        return {
            issue_type: 'Littering Problem',
            department: 'Sanitation & Enforcement',
            urgency: 'Low',
            reason: 'Public littering degrades cleanliness and requires enforcement action.'
        };
    }

    if (desc.includes('stray animal carcass') || desc.includes('dead animal') || desc.includes('animal body')) {
        return {
            issue_type: 'Dead Animal Removal',
            department: 'Sanitation Department',
            urgency: 'High',
            reason: 'Dead animals pose health risks and require immediate removal.'
        };
    }

    // WATER & DRAINAGE (21-30)
    if (desc.includes('water leak') || desc.includes('pipe burst') || desc.includes('water pipe broken')) {
        return {
            issue_type: 'Water Pipeline Leakage',
            department: 'Water Works Department',
            urgency: 'High',
            reason: 'Water leakage causes wastage, flooding, and potential infrastructure damage.'
        };
    }

    if (desc.includes('no water supply') || desc.includes('water shortage') || desc.includes('tap dry')) {
        return {
            issue_type: 'Water Supply Disruption',
            department: 'Water Works Department',
            urgency: 'High',
            reason: 'Water supply disruption affects daily life and requires urgent resolution.'
        };
    }

    if (desc.includes('dirty water') || desc.includes('contaminated water') || desc.includes('water quality')) {
        return {
            issue_type: 'Water Quality Issue',
            department: 'Water Quality Control',
            urgency: 'High',
            reason: 'Contaminated water poses serious health risks and requires immediate testing.'
        };
    }

    if (desc.includes('drainage') || desc.includes('blocked drain') || desc.includes('clogged drain')) {
        return {
            issue_type: 'Drainage Blockage',
            department: 'Sewage & Drainage',
            urgency: 'High',
            reason: 'Blocked drains cause waterlogging and flooding during rains.'
        };
    }

    if (desc.includes('waterlogging') || desc.includes('flooding') || desc.includes('water accumulation')) {
        return {
            issue_type: 'Waterlogging',
            department: 'Sewage & Drainage',
            urgency: 'High',
            reason: 'Waterlogging disrupts traffic, damages property, and spreads diseases.'
        };
    }

    if (desc.includes('sewage') || desc.includes('sewer overflow') || desc.includes('sewage leak')) {
        return {
            issue_type: 'Sewage Overflow',
            department: 'Sewage & Drainage',
            urgency: 'High',
            reason: 'Sewage overflow creates severe health hazards and environmental pollution.'
        };
    }

    if (desc.includes('storm drain') || desc.includes('rainwater drain') || desc.includes('monsoon drain')) {
        return {
            issue_type: 'Storm Drain Issue',
            department: 'Sewage & Drainage',
            urgency: 'High',
            reason: 'Malfunctioning storm drains lead to flooding during heavy rainfall.'
        };
    }

    if (desc.includes('water meter') || desc.includes('meter broken') || desc.includes('meter not working')) {
        return {
            issue_type: 'Water Meter Malfunction',
            department: 'Water Works Department',
            urgency: 'Medium',
            reason: 'Faulty water meters lead to billing disputes and water wastage.'
        };
    }

    if (desc.includes('water tanker') || desc.includes('tanker supply') || desc.includes('emergency water')) {
        return {
            issue_type: 'Water Tanker Request',
            department: 'Water Works Department',
            urgency: 'High',
            reason: 'Emergency water tanker needed due to supply shortage.'
        };
    }

    if (desc.includes('hand pump') || desc.includes('tube well') || desc.includes('bore well')) {
        return {
            issue_type: 'Hand Pump/Borewell Issue',
            department: 'Water Works Department',
            urgency: 'Medium',
            reason: 'Non-functional public water sources affect community water access.'
        };
    }

    // ELECTRICITY & STREET LIGHTING (31-38)
    if (desc.includes('power outage') || desc.includes('no electricity') || desc.includes('blackout')) {
        return {
            issue_type: 'Power Outage',
            department: 'Electricity Board',
            urgency: 'High',
            reason: 'Power outages disrupt daily activities and can affect essential services.'
        };
    }

    if (desc.includes('exposed wire') || desc.includes('hanging wire') || desc.includes('loose cable')) {
        return {
            issue_type: 'Exposed Electrical Wiring',
            department: 'Electricity Board',
            urgency: 'High',
            reason: 'Exposed wires pose electrocution risk and fire hazards.'
        };
    }

    if (desc.includes('street light') || desc.includes('lamp post') || desc.includes('street lamp')) {
        return {
            issue_type: 'Street Light Not Working',
            department: 'Municipal Lighting',
            urgency: 'Medium',
            reason: 'Non-functional street lights compromise public safety and increase crime risk.'
        };
    }

    if (desc.includes('transformer') || desc.includes('electrical box') || desc.includes('power station')) {
        return {
            issue_type: 'Transformer Issue',
            department: 'Electricity Board',
            urgency: 'High',
            reason: 'Transformer problems affect power supply to entire neighborhoods.'
        };
    }

    if (desc.includes('electric pole') || desc.includes('power pole') || desc.includes('utility pole')) {
        return {
            issue_type: 'Electric Pole Damage',
            department: 'Electricity Board',
            urgency: 'High',
            reason: 'Damaged electric poles risk collapse and power disruption.'
        };
    }

    if (desc.includes('meter tampering') || desc.includes('electricity theft') || desc.includes('illegal connection')) {
        return {
            issue_type: 'Electricity Theft',
            department: 'Electricity Board Enforcement',
            urgency: 'Medium',
            reason: 'Illegal connections pose safety risks and cause revenue loss.'
        };
    }

    if (desc.includes('voltage fluctuation') || desc.includes('low voltage') || desc.includes('high voltage')) {
        return {
            issue_type: 'Voltage Fluctuation',
            department: 'Electricity Board',
            urgency: 'Medium',
            reason: 'Voltage issues damage electrical appliances and disrupt power quality.'
        };
    }

    if (desc.includes('traffic light') || desc.includes('signal not working') || desc.includes('traffic signal')) {
        return {
            issue_type: 'Traffic Signal Malfunction',
            department: 'Traffic Police',
            urgency: 'High',
            reason: 'Non-functional traffic signals cause accidents and traffic chaos.'
        };
    }

    // TRAFFIC & TRANSPORTATION (39-45)
    if (desc.includes('traffic jam') || desc.includes('congestion') || desc.includes('traffic block')) {
        return {
            issue_type: 'Traffic Congestion',
            department: 'Traffic Management',
            urgency: 'Medium',
            reason: 'Severe traffic congestion requires traffic management intervention.'
        };
    }

    if (desc.includes('parking') || desc.includes('illegal parking') || desc.includes('no parking zone')) {
        return {
            issue_type: 'Illegal Parking',
            department: 'Traffic Police',
            urgency: 'Low',
            reason: 'Illegal parking obstructs traffic flow and creates inconvenience.'
        };
    }

    if (desc.includes('bus stop') || desc.includes('bus shelter') || desc.includes('transit stop')) {
        return {
            issue_type: 'Bus Stop Maintenance',
            department: 'Transport Department',
            urgency: 'Low',
            reason: 'Damaged bus stops affect commuter comfort and public transport usage.'
        };
    }

    if (desc.includes('accident') || desc.includes('collision') || desc.includes('crash')) {
        return {
            issue_type: 'Traffic Accident',
            department: 'Traffic Police',
            urgency: 'High',
            reason: 'Traffic accidents require immediate emergency response and investigation.'
        };
    }

    if (desc.includes('abandoned vehicle') || desc.includes('parked vehicle') || desc.includes('old car')) {
        return {
            issue_type: 'Abandoned Vehicle',
            department: 'Traffic Police',
            urgency: 'Low',
            reason: 'Abandoned vehicles occupy public space and create visual pollution.'
        };
    }

    if (desc.includes('road sign') || desc.includes('signboard') || desc.includes('traffic sign')) {
        return {
            issue_type: 'Road Signage Issue',
            department: 'Traffic Management',
            urgency: 'Medium',
            reason: 'Missing or damaged road signs cause navigation confusion and safety issues.'
        };
    }

    if (desc.includes('railway crossing') || desc.includes('level crossing') || desc.includes('train crossing')) {
        return {
            issue_type: 'Railway Crossing Issue',
            department: 'Railways',
            urgency: 'High',
            reason: 'Railway crossing problems pose serious safety risks to commuters.'
        };
    }

    // ENVIRONMENT & POLLUTION (46-52)
    if (desc.includes('air pollution') || desc.includes('smoke') || desc.includes('dust pollution')) {
        return {
            issue_type: 'Air Pollution',
            department: 'Pollution Control Board',
            urgency: 'Medium',
            reason: 'Air pollution affects public health and environmental quality.'
        };
    }

    if (desc.includes('noise pollution') || desc.includes('loud noise') || desc.includes('sound pollution')) {
        return {
            issue_type: 'Noise Pollution',
            department: 'Pollution Control Board',
            urgency: 'Low',
            reason: 'Excessive noise disturbs peace and violates noise regulations.'
        };
    }

    if (desc.includes('tree fallen') || desc.includes('fallen tree') || desc.includes('tree blocking')) {
        return {
            issue_type: 'Fallen Tree',
            department: 'Forest/Horticulture',
            urgency: 'High',
            reason: 'Fallen trees block roads and pose safety hazards requiring immediate removal.'
        };
    }

    if (desc.includes('tree cutting') || desc.includes('illegal felling') || desc.includes('unauthorized tree removal')) {
        return {
            issue_type: 'Illegal Tree Cutting',
            department: 'Forest Department',
            urgency: 'High',
            reason: 'Unauthorized tree cutting violates environmental laws and requires action.'
        };
    }

    if (desc.includes('tree trimming') || desc.includes('branch overgrown') || desc.includes('tree maintenance')) {
        return {
            issue_type: 'Tree Trimming Required',
            department: 'Horticulture Department',
            urgency: 'Low',
            reason: 'Overgrown branches obstruct roads, power lines, and visibility.'
        };
    }

    if (desc.includes('stray dog') || desc.includes('stray animal') || desc.includes('street dog')) {
        return {
            issue_type: 'Stray Animal Issue',
            department: 'Animal Welfare',
            urgency: 'Medium',
            reason: 'Stray animals may pose safety concerns and require humane management.'
        };
    }

    if (desc.includes('mosquito') || desc.includes('dengue') || desc.includes('malaria') || desc.includes('breeding')) {
        return {
            issue_type: 'Mosquito Breeding',
            department: 'Health Department',
            urgency: 'High',
            reason: 'Mosquito breeding sites spread diseases like dengue and malaria.'
        };
    }

    // PUBLIC SPACES & AMENITIES (53-60)
    if (desc.includes('park') || desc.includes('playground') || desc.includes('garden maintenance')) {
        return {
            issue_type: 'Park Maintenance',
            department: 'Parks & Recreation',
            urgency: 'Low',
            reason: 'Park maintenance ensures safe and pleasant recreational spaces.'
        };
    }

    if (desc.includes('graffiti') || desc.includes('vandalism') || desc.includes('wall defacement')) {
        return {
            issue_type: 'Graffiti/Vandalism',
            department: 'Municipal Corporation',
            urgency: 'Low',
            reason: 'Graffiti and vandalism degrade public property aesthetics.'
        };
    }

    if (desc.includes('illegal construction') || desc.includes('unauthorized building') || desc.includes('construction violation')) {
        return {
            issue_type: 'Illegal Construction',
            department: 'Building Department',
            urgency: 'High',
            reason: 'Unauthorized construction violates building codes and safety regulations.'
        };
    }

    if (desc.includes('street vendor') || desc.includes('hawker zone') || desc.includes('vendor encroachment')) {
        return {
            issue_type: 'Street Vendor Issue',
            department: 'Municipal Enforcement',
            urgency: 'Low',
            reason: 'Unregulated street vending requires proper zone management.'
        };
    }

    if (desc.includes('public drinking water') || desc.includes('water fountain') || desc.includes('drinking water tap')) {
        return {
            issue_type: 'Public Drinking Water',
            department: 'Water Works Department',
            urgency: 'Medium',
            reason: 'Non-functional public drinking water facilities affect community access.'
        };
    }

    if (desc.includes('cctv') || desc.includes('surveillance camera') || desc.includes('security camera')) {
        return {
            issue_type: 'CCTV/Security Issue',
            department: 'Police/Security',
            urgency: 'Medium',
            reason: 'Non-functional security cameras reduce public safety monitoring.'
        };
    }

    if (desc.includes('fire hydrant') || desc.includes('fire safety') || desc.includes('fire equipment')) {
        return {
            issue_type: 'Fire Safety Equipment',
            department: 'Fire Department',
            urgency: 'High',
            reason: 'Fire safety equipment must be functional for emergency response.'
        };
    }

    // Default fallback
    return {
        issue_type: 'General Civic Issue',
        department: 'Municipal Corporation',
        urgency: 'Low',
        reason: 'Issue categorized as general civic concern requiring review.'
    };
};
