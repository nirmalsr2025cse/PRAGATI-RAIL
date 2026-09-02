// Mock API Dataset for PRAGATI-RAIL (SIH26027)
// Full Indian Railways Taxonomy — 18 Zones & Divisions

export const ZONES = [
  { code: 'ALL', name: 'All India (18 Zones)', headquarters: 'Railway Board, New Delhi' },
  { code: 'NR', name: 'Northern Railway (NR)', headquarters: 'New Delhi' },
  { code: 'SR', name: 'Southern Railway (SR)', headquarters: 'Chennai' },
  { code: 'WR', name: 'Western Railway (WR)', headquarters: 'Mumbai Churchgate' },
  { code: 'CR', name: 'Central Railway (CR)', headquarters: 'Mumbai CSMT' },
  { code: 'ER', name: 'Eastern Railway (ER)', headquarters: 'Kolkata' },
  { code: 'SCR', name: 'South Central Railway (SCR)', headquarters: 'Secunderabad' },
  { code: 'SWR', name: 'South Western Railway (SWR)', headquarters: 'Hubballi' },
  { code: 'ECoR', name: 'East Coast Railway (ECoR)', headquarters: 'Bhubaneswar' }
];

export const DIVISIONS_BY_ZONE = {
  ALL: [
    { code: 'ALL', name: 'All Divisions (National View)' }
  ],
  NR: [
    { code: 'ALL', name: 'All NR Divisions' },
    { code: 'DLI', name: 'Delhi Division (NR)' },
    { code: 'UMB', name: 'Ambala Division (NR)' },
    { code: 'LKO', name: 'Lucknow NR Division' },
    { code: 'MB', name: 'Moradabad Division (NR)' },
    { code: 'FZR', name: 'Firozpur Division (NR)' }
  ],
  SR: [
    { code: 'ALL', name: 'All SR Divisions' },
    { code: 'MAS', name: 'Chennai Division (SR)' },
    { code: 'TPJ', name: 'Tiruchchirappalli Division (SR)' },
    { code: 'MDU', name: 'Madurai Division (SR)' },
    { code: 'PGT', name: 'Palakkad Division (SR)' },
    { code: 'SA', name: 'Salem Division (SR)' },
    { code: 'TVC', name: 'Thiruvananthapuram Division (SR)' }
  ],
  WR: [
    { code: 'ALL', name: 'All WR Divisions' },
    { code: 'MMCT', name: 'Mumbai Central Division (WR)' },
    { code: 'BRC', name: 'Vadodara Division (WR)' },
    { code: 'ADI', name: 'Ahmedabad Division (WR)' },
    { code: 'RTM', name: 'Ratlam Division (WR)' },
    { code: 'RJT', name: 'Rajkot Division (WR)' }
  ],
  CR: [
    { code: 'ALL', name: 'All CR Divisions' },
    { code: 'CSMT', name: 'Mumbai CSMT Division (CR)' },
    { code: 'BSL', name: 'Bhusaval Division (CR)' },
    { code: 'NGP', name: 'Nagpur CR Division' },
    { code: 'PA', name: 'Pune Division (CR)' },
    { code: 'SUR', name: 'Solapur Division (CR)' }
  ],
  ER: [
    { code: 'ALL', name: 'All ER Divisions' },
    { code: 'HWH', name: 'Howrah Division (ER)' },
    { code: 'SDAH', name: 'Sealdah Division (ER)' },
    { code: 'ASN', name: 'Asansol Division (ER)' },
    { code: 'MLDT', name: 'Malda Division (ER)' }
  ],
  SCR: [
    { code: 'ALL', name: 'All SCR Divisions' },
    { code: 'SC', name: 'Secunderabad Division (SCR)' },
    { code: 'HYB', name: 'Hyderabad Division (SCR)' },
    { code: 'BZA', name: 'Vijayawada Division (SCR)' },
    { code: 'GTL', name: 'Guntakal Division (SCR)' }
  ]
};

export const DIVISIONS = [
  { code: 'DLI', name: 'Delhi Division (NR)' },
  { code: 'UMB', name: 'Ambala Division (NR)' },
  { code: 'LKO', name: 'Lucknow Division (NR)' },
  { code: 'MB', name: 'Moradabad Division (NR)' },
  { code: 'MAS', name: 'Chennai Division (SR)' },
  { code: 'TPJ', name: 'Tiruchchirappalli Division (SR)' },
  { code: 'MDU', name: 'Madurai Division (SR)' },
  { code: 'PGT', name: 'Palakkad Division (SR)' },
  { code: 'SA', name: 'Salem Division (SR)' },
  { code: 'MMCT', name: 'Mumbai Central Division (WR)' },
  { code: 'CSMT', name: 'Mumbai CSMT Division (CR)' },
  { code: 'HWH', name: 'Howrah Division (ER)' }
];

export const PRIORITY_WEIGHTS = {
  severity: 0.35,
  urgency: 0.25,
  assetImpact: 0.20,
  trainImpact: 0.12,
  overdueDays: 0.08,
};

export const calculatePriorityScore = (item) => {
  const score = (
    ((item.severityScore || 80) * PRIORITY_WEIGHTS.severity) +
    ((item.urgencyScore || 75) * PRIORITY_WEIGHTS.urgency) +
    ((item.assetImpactScore || 75) * PRIORITY_WEIGHTS.assetImpact) +
    ((item.trainImpactScore || 70) * PRIORITY_WEIGHTS.trainImpact) +
    ((item.overdueDaysScore || 50) * PRIORITY_WEIGHTS.overdueDays)
  );
  return Math.min(100, Math.round(score));
};

// TMS Asset Types & Defect Mapping
export const TMS_ASSET_DEFECT_MAP = {
  'Rail': [
    'Rail Flaw (USFD IMR Defect)',
    'AT Weld Fracture Risk',
    'Rail Head Squat',
    'Corrugation / Wheel Burn',
    'Bolt Hole Crack'
  ],
  'Sleeper': [
    'Cracked Concrete Sleeper',
    'Sleeper Fastening Loose / Missing',
    'Rubber Pad Degradation',
    'Gauge Alignment Shift'
  ],
  'Ballast': [
    'Ballast Deficiency',
    'Ballast Fouling / Deep Screening Needed',
    'Cess Erosion / Track Settlement'
  ],
  'Point & Crossing': [
    'Switch Expansion Joint (SEJ) Wear',
    'Tongue Rail Wear',
    'Nose of Crossing Flaw',
    'Check Rail Clearance Defect'
  ],
  'Level Crossing': [
    'Check Rail Wear at LC',
    'Road Surface Degradation',
    'Wedge / Lock Defect'
  ],
  'Bridge': [
    'Bridge Guard Rail Displacement',
    'Expansion Bearing Fault',
    'Girder Corrosion / Alignment Defect'
  ]
};

export const ZONAL_PERFORMANCE_MATRIX = [
  { zone: 'NR', zoneName: 'Northern Railway', totalDefects: 142, pendingBlocks: 28, approvedBlocks: 84, hoursSaved: 164.5, mergeRate: '68%', criticalDefects: 3 },
  { zone: 'SR', zoneName: 'Southern Railway', totalDefects: 118, pendingBlocks: 19, approvedBlocks: 72, hoursSaved: 142.0, mergeRate: '72%', criticalDefects: 1 },
  { zone: 'WR', zoneName: 'Western Railway', totalDefects: 135, pendingBlocks: 24, approvedBlocks: 79, hoursSaved: 156.8, mergeRate: '65%', criticalDefects: 2 },
  { zone: 'CR', zoneName: 'Central Railway', totalDefects: 126, pendingBlocks: 21, approvedBlocks: 75, hoursSaved: 148.2, mergeRate: '67%', criticalDefects: 2 },
  { zone: 'ER', zoneName: 'Eastern Railway', totalDefects: 98, pendingBlocks: 16, approvedBlocks: 62, hoursSaved: 118.5, mergeRate: '61%', criticalDefects: 1 },
  { zone: 'SCR', zoneName: 'South Central Railway', totalDefects: 110, pendingBlocks: 18, approvedBlocks: 68, hoursSaved: 134.0, mergeRate: '70%', criticalDefects: 1 },
];

export const SYSTEM_STATS = {
  totalDefects: 729,
  totalDefectsTrend: '+8% nationwide',
  pendingBlocks: 126,
  pendingBlocksTrend: '-14 from yesterday',
  approvedBlocks: 440,
  approvedBlocksTrend: '+92 approved across 18 zones',
  emergencyBlocks: 10,
  emergencyBlocksTrend: '6 resolved today',
  blockHoursSaved: 864.0,
  blockHoursSavedTrend: '+192.5 hrs vs single-dept',
  tasksMerged: 246,
  tasksMergedTrend: '67.4% joint merge rate',
};

// TMS Schema-Compliant Defects Dataset
export const TMS_DEFECTS = [
  {
    Defect_ID: 'TRK-2026-081',
    id: 'TRK-2026-081',
    department: 'TMS',
    deptLabel: 'Engineering (Track)',
    Section_ID: 'SEC-NDLS-CNB-DN',
    Station1: 'New Delhi (NDLS)',
    Station2: 'Kanpur Central (CNB)',
    Chainage_KM: '142.450',
    Latitude: '28.6139° N',
    Longitude: '77.2090° E',
    Asset_Type: 'Rail',
    Defect_Type: 'Rail Flaw (USFD IMR Defect)',
    Severity_Level: 'Critical',
    Detection_Method: 'UFD',
    Reported_Date: '2026-08-30',
    location: 'NDLS-CNB Down Line (KM 142.450)',
    section: 'NDLS - CNB',
    zone: 'NR',
    division: 'DLI',
    status: 'Pending Block',
    Due_Date: '2026-08-31',
    Overdue_Days: 2,
    Joint_Block_Feasibility_Score: 94.5,
    Task_Urgency_Tier: 'Tier 1 (Immediate)',
    Planning_Horizon: 'Next 24 Hours',
    Recommended_Block_Date: '2026-09-03',
    Recommended_Block_Duration_Hours: 4.0,
    Joint_Block_Recommendation: 'Merge with SMMS Point Machine Overhaul & TDMS Insulator Replace',
    Priority_Score: 95,
    Predicted_Resolution_Time_Hours: 3.5,
    Risk_If_Delayed: 'High Risk of Derailment / Track Fracture on High-Speed Corridor',
    Confidence_Score: '98.2%'
  },
  {
    Defect_ID: 'TRK-2026-084',
    id: 'TRK-2026-084',
    department: 'TMS',
    deptLabel: 'Engineering (Track)',
    Section_ID: 'SEC-NDLS-UMB-UP',
    Station1: 'New Delhi (NDLS)',
    Station2: 'Ambala Cantt (UMB)',
    Chainage_KM: '48.120',
    Latitude: '28.7041° N',
    Longitude: '77.1025° E',
    Asset_Type: 'Ballast',
    Defect_Type: 'Ballast Fouling / Deep Screening Needed',
    Severity_Level: 'High',
    Detection_Method: 'TRC Survey',
    Reported_Date: '2026-08-31',
    location: 'NDLS-UMB Up Line (KM 48.120)',
    section: 'NDLS - UMB',
    zone: 'NR',
    division: 'DLI',
    status: 'Merged Joint Block',
    Due_Date: '2026-09-03',
    Overdue_Days: 0,
    Joint_Block_Feasibility_Score: 89.0,
    Task_Urgency_Tier: 'Tier 2 (72 Hours)',
    Planning_Horizon: 'Weekly Window',
    Recommended_Block_Date: '2026-09-04',
    Recommended_Block_Duration_Hours: 4.0,
    Joint_Block_Recommendation: 'Merge with TDMS Catenary Dropper Repair',
    Priority_Score: 78,
    Predicted_Resolution_Time_Hours: 4.0,
    Risk_If_Delayed: 'Track Geometry Degradation & Speed Restriction imposing to 50 km/h',
    Confidence_Score: '94.6%'
  },
  {
    Defect_ID: 'TRK-2026-102',
    id: 'TRK-2026-102',
    department: 'TMS',
    deptLabel: 'Engineering (Track)',
    Section_ID: 'SEC-MAS-JTJ-DN',
    Station1: 'Chennai Central (MAS)',
    Station2: 'Jolarpettai (JTJ)',
    Chainage_KM: '72.300',
    Latitude: '13.0827° N',
    Longitude: '80.2707° E',
    Asset_Type: 'Point & Crossing',
    Defect_Type: 'Switch Expansion Joint (SEJ) Wear',
    Severity_Level: 'High',
    Detection_Method: 'Manual Patrol',
    Reported_Date: '2026-09-01',
    location: 'MAS-JTJ Down Line (KM 72.300)',
    section: 'MAS - JTJ',
    zone: 'SR',
    division: 'MAS',
    status: 'Pending Block',
    Due_Date: '2026-09-04',
    Overdue_Days: 0,
    Joint_Block_Feasibility_Score: 92.0,
    Task_Urgency_Tier: 'Tier 2 (72 Hours)',
    Planning_Horizon: 'Weekly Window',
    Recommended_Block_Date: '2026-09-04',
    Recommended_Block_Duration_Hours: 4.0,
    Joint_Block_Recommendation: 'Merge with SMMS Axle Counter Calibration & TDMS Wire Repair',
    Priority_Score: 84,
    Predicted_Resolution_Time_Hours: 3.8,
    Risk_If_Delayed: 'Possibility of Point Indicator Failure & Joint Jamming under Heat Expansion',
    Confidence_Score: '96.0%'
  }
];

export const SMMS_DEFECTS = [
  { id: 'SIG-2026-042', department: 'SMMS', deptLabel: 'Signal & Telecom', defectType: 'Point Machine 102B Overhaul Fault', location: 'NDLS-CNB Down Line (KM 142/10 Junction)', section: 'NDLS - CNB', zone: 'NR', division: 'DLI', severity: 'High', severityScore: 82, urgencyScore: 85, assetImpactScore: 75, trainImpactScore: 70, overdueDaysScore: 60, overdueDays: 3, status: 'Merged Joint Block', requestedWindow: '02:30 - 05:30', requestedDurationHrs: 3.0, equipmentRequired: 'Point Calibration Kit', contractorTeam: 'S&T Maintenance Gang #5', dateReported: '2026-08-30' }
];

export const TDMS_DEFECTS = [
  { id: 'TRC-2026-031', department: 'TDMS', deptLabel: 'Traction (OHE)', defectType: 'OHE Cantilever Insulator Wear', location: 'NDLS-CNB Down Line (KM 142/14)', section: 'NDLS - CNB', zone: 'NR', division: 'DLI', severity: 'High', severityScore: 85, urgencyScore: 80, assetImpactScore: 82, trainImpactScore: 75, overdueDaysScore: 70, overdueDays: 3, status: 'Merged Joint Block', requestedWindow: '02:00 - 05:30', requestedDurationHrs: 3.5, equipmentRequired: 'Tower Wagon OHE-408', contractorTeam: 'OHE Breakdown Gang DLI', dateReported: '2026-08-30' }
];

export const ALL_DEFECTS = [
  ...TMS_DEFECTS.map(t => ({ ...t, priorityScore: t.Priority_Score || 85, severityScore: 85, urgencyScore: 80, assetImpactScore: 80, trainImpactScore: 75, overdueDaysScore: 50 })),
  ...SMMS_DEFECTS.map(s => ({ ...s, priorityScore: s.severityScore || 80 })),
  ...TDMS_DEFECTS.map(d => ({ ...d, priorityScore: d.severityScore || 80 })),
].sort((a, b) => (b.priorityScore || 80) - (a.priorityScore || 80));

export const MERGED_BLOCK_PROPOSALS = [
  { id: 'JB-2026-901', jointBlockCode: 'JB-NDLS-CNB-01', section: 'NDLS - CNB Down Line (KM 142/10 to 142/16)', zone: 'NR', division: 'DLI', combinedWindow: '02:00 - 06:00 (4.0 hrs)', departmentsMerged: ['TMS (Engineering)', 'SMMS (Signal)', 'TDMS (Traction OHE)'], tasksCount: 3, taskIds: ['TRK-2026-081', 'SIG-2026-042', 'TRC-2026-031'], hoursSaved: 4.5, singleDeptTotalHours: 10.5, optimizedJointHours: 4.0, status: 'Suggested', aiConfidence: '96.4%', aiReasoning: 'Engineering rail flaw (TRK-081), Signal point machine overhaul (SIG-042), and Traction insulator replacement (TRC-031) are located within the same 600-meter block window on NDLS-CNB.', affectedTrains: [{ number: '12004', name: 'Kalka Shatabdi Express', delayEst: '12 min rerouted' }] }
];

export const GANTT_TIMELINE_DATA = [
  { id: 'G-101', jointBlockId: 'JB-2026-901', title: 'Joint Block: NDLS-CNB Down Line (TRK + SIG + TRC)', department: 'Joint', section: 'NDLS - CNB', zone: 'NR', division: 'DLI', startHour: 2.0, endHour: 6.0, durationHrs: 4.0, isJoint: true, tasks: ['TRK-2026-081', 'SIG-2026-042', 'TRC-2026-031'], status: 'Approved', color: '#059669' }
];

export const STATION_BOARDS = {
  NDLS: { stationCode: 'NDLS', stationName: 'NEW DELHI RAILWAY STATION', zone: 'NR', division: 'DLI', arrivals: [{ trainNo: '12424', name: 'DBRG RAJDHANI', expTime: '20:45', status: 'ON TIME', platform: 'PF 16' }], departures: [{ trainNo: '12302', name: 'HWH RAJDHANI', expTime: '20:55', status: 'ON TIME', platform: 'PF 09' }] }
};

export const CORRIDORS_DATA = [
  { key: '1', id: 'COR-01', name: 'NDLS - CNB Quad Line', section: 'New Delhi to Kanpur Central', zone: 'NR', division: 'DLI', lineType: 'Quad Track', status: 'Active', availabilityScore: 0.88, passengerTrainCount: 148, goodsForecastCount: 42, trafficWindowSlot: '01:30 - 05:30', riskFactor: 'Medium', lastInspected: '2026-09-01' }
];

export const SYSTEM_ALERTS = [
  { id: 'ALT-1001', severity: 'Critical', title: 'S1 Emergency Defect: AT Weld Failure Risk', location: 'NDLS-CNB Up Line (KM 210/18)', department: 'TMS', zone: 'NR', division: 'DLI', timestamp: '2026-09-02 19:45:10', acknowledged: false, message: 'USFD flagged immediate fracture probability on Rajdhani track.', resolutionNotes: 'Speed restriction of 20 km/h imposed.' }
];

export const SYSTEM_USERS = [
  { id: 'USR-01', name: 'Rajesh Kumar Sharma', email: 'drm.dli@indianrailways.gov.in', role: 'Admin', department: 'Control Office (DRM)', zone: 'NR', division: 'DLI', status: 'Active', lastLogin: '2026-09-02 20:15' }
];

export const SYSTEM_LOGS = [
  { id: 'LOG-881', timestamp: '2026-09-02 20:28:12', user: 'drm.dli@indianrailways.gov.in', action: 'RUN_AI_OPTIMIZATION', detail: 'Triggered optimization for NR DLI Division.' }
];
