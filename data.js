// ========================================================
// data.js — Jan Awaaz: Seed Data & localStorage CRUD
// ========================================================

const STORAGE_KEY = 'janawaaz_reports';
const USER_KEY = 'janawaaz_user';
const INTERACTIONS_KEY = 'janawaaz_interactions'; // likes, dislikes, reposts per user

// ── Hindi bad-word list (for moderation) ─────────────────
const BAD_WORDS_HI = [
  'बेवकूफ','गधा','कमीना','हरामी','साला','कुत्ता','सूअर','चोर',
  'बदमाश','नालायक','उल्लू','गंवार','पागल','मूर्ख','लुच्चा',
  'badword','abuse','idiot','stupid','fool','damn','hell'
];

// ── Type config with emoji + labels ──────────────────────
const REPORT_TYPES = {
  pothole:           { emoji: '🕳️', hi: 'गड्ढा',           en: 'Pothole' },
  broken_streetlight:{ emoji: '💡', hi: 'टूटी स्ट्रीटलाइट', en: 'Broken Streetlight' },
  overflowing_drain: { emoji: '🌊', hi: 'उफनता नाला',       en: 'Overflowing Drain' },
  burst_pipeline:    { emoji: '💧', hi: 'फटा पाइपलाइन',     en: 'Burst Pipeline' },
  garbage:           { emoji: '🗑️', hi: 'कूड़ा',            en: 'Garbage' }
};

const SEVERITY_CONFIG = {
  high:   { color: '#D32F2F', hi: 'गंभीर',  en: 'High' },
  medium: { color: '#FFA000', hi: 'मध्यम',  en: 'Medium' },
  low:    { color: '#4CAF50', hi: 'सामान्य', en: 'Low' }
};

const STATUS_CONFIG = {
  reported:      { color: '#FFA000', hi: 'रिपोर्ट किया गया',     en: 'Reported' },
  in_progress:   { color: '#2196F3', hi: 'कार्यवाही जारी',       en: 'In Progress' },
  claimed_done:  { color: '#9C27B0', hi: 'हल किया (दावा)',        en: 'Claimed Done' },
  verified_done: { color: '#4CAF50', hi: 'सत्यापित',             en: 'Verified Done' },
  reopened:      { color: '#F44336', hi: 'पुनः खोला गया',        en: 'Reopened' }
};

// ── 15 Seed Reports ──────────────────────────────────────
function getSeedReports() {
  const now = Date.now();
  const DAY = 86400000;
  return [
    {
      id: 'rpt_001',
      type: 'pothole',
      photo: 'https://picsum.photos/seed/pothole1/400/300',
      location: { lat: 26.9124, lng: 75.7873, address: 'MI Road, Jaipur, Rajasthan', nearbyShop: 'Laxmi Misthan Bhandar', landmark: 'Near Raj Mandir Cinema' },
      severity: 'high',
      description_hi: 'MI रोड पर बड़ा गड्ढा है। कई गाड़ियाँ टूट चुकी हैं और दोपहिया वाहन चालकों को खतरा है। तुरंत मरम्मत जरूरी।',
      description_en: 'Large pothole on MI Road. Multiple vehicles damaged and two-wheeler riders at risk. Immediate repair needed.',
      status: 'reported',
      likes: 34, dislikes: 2, reposts: 12,
      createdAt: now - 2 * DAY,
      reporterHandle: 'नागरिक_4821',
      authority: { name: 'Jaipur Nagar Nigam', contact: '0141-2227723', type: 'nagar_palika' },
      aiAnalysis: { type: 'pothole', severity: 'high', confidence: 0.94 },
      resolvedAt: null, afterPhoto: null, verifications: 0
    },
    {
      id: 'rpt_002',
      type: 'broken_streetlight',
      photo: 'https://picsum.photos/seed/light1/400/300',
      location: { lat: 26.8467, lng: 80.9462, address: 'Hazratganj, Lucknow, UP', nearbyShop: 'Sahara Ganj Mall', landmark: '' },
      severity: 'medium',
      description_hi: 'हजरतगंज में स्ट्रीटलाइट पिछले 10 दिनों से बंद है। रात में अंधेरा रहता है, महिलाओं को असुरक्षा।',
      description_en: 'Streetlight in Hazratganj has been off for 10 days. Darkness at night causing safety concerns for women.',
      status: 'in_progress',
      likes: 56, dislikes: 1, reposts: 23,
      createdAt: now - 8 * DAY,
      reporterHandle: 'नागरिक_7392',
      authority: { name: 'Lucknow Nagar Nigam', contact: '0522-2287051', type: 'nagar_palika' },
      aiAnalysis: { type: 'broken_streetlight', severity: 'medium', confidence: 0.89 },
      resolvedAt: null, afterPhoto: null, verifications: 0
    },
    {
      id: 'rpt_003',
      type: 'overflowing_drain',
      photo: 'https://picsum.photos/seed/drain1/400/300',
      location: { lat: 25.3176, lng: 82.9739, address: 'Assi Ghat Road, Varanasi, UP', nearbyShop: 'Kashi Vishwanath Store', landmark: 'Near Assi Ghat' },
      severity: 'high',
      description_hi: 'अस्सी घाट रोड पर नाला उफन रहा है। गंदा पानी सड़क पर आ गया है। बदबू और बीमारी का खतरा।',
      description_en: 'Drain overflowing near Assi Ghat Road. Dirty water on the road. Risk of disease and foul smell.',
      status: 'reported',
      likes: 78, dislikes: 3, reposts: 31,
      createdAt: now - 1 * DAY,
      reporterHandle: 'नागरिक_1056',
      authority: { name: 'Varanasi Nagar Nigam', contact: '0542-2501221', type: 'nagar_palika' },
      aiAnalysis: { type: 'overflowing_drain', severity: 'high', confidence: 0.96 },
      resolvedAt: null, afterPhoto: null, verifications: 0
    },
    {
      id: 'rpt_004',
      type: 'garbage',
      photo: 'https://picsum.photos/seed/garbage1/400/300',
      location: { lat: 23.2100, lng: 77.3950, address: 'Kolar Road, Bhopal, MP', nearbyShop: '', landmark: 'Ratanpur Village' },
      severity: 'medium',
      description_hi: 'रतनपुर गाँव के पास कूड़े का ढेर लगा हुआ है। पिछले 15 दिनों से सफाई नहीं हुई।',
      description_en: 'Garbage pile near Ratanpur village. No cleaning done for 15 days.',
      status: 'claimed_done',
      likes: 12, dislikes: 8, reposts: 5,
      createdAt: now - 15 * DAY,
      reporterHandle: 'नागरिक_8834',
      authority: { name: 'Gram Panchayat Ratanpur', contact: '0755-2550123', type: 'gram_panchayat' },
      aiAnalysis: { type: 'garbage', severity: 'medium', confidence: 0.91 },
      resolvedAt: now - 3 * DAY, afterPhoto: 'https://picsum.photos/seed/garbagefix/400/300', verifications: 3
    },
    {
      id: 'rpt_005',
      type: 'burst_pipeline',
      photo: 'https://picsum.photos/seed/pipe1/400/300',
      location: { lat: 28.6139, lng: 77.2090, address: 'Connaught Place, New Delhi', nearbyShop: 'Wenger\'s Bakery', landmark: 'Near Palika Bazaar' },
      severity: 'high',
      description_hi: 'कनॉट प्लेस में पानी की पाइपलाइन फट गई है। पानी बर्बाद हो रहा है और सड़क पर भरा है।',
      description_en: 'Water pipeline burst at Connaught Place. Water wasting and flooding the road.',
      status: 'in_progress',
      likes: 120, dislikes: 5, reposts: 45,
      createdAt: now - 3 * DAY,
      reporterHandle: 'नागरिक_2201',
      authority: { name: 'New Delhi Municipal Council', contact: '011-23363773', type: 'nagar_palika' },
      aiAnalysis: { type: 'burst_pipeline', severity: 'high', confidence: 0.93 },
      resolvedAt: null, afterPhoto: null, verifications: 0
    },
    {
      id: 'rpt_006',
      type: 'pothole',
      photo: 'https://picsum.photos/seed/pothole2/400/300',
      location: { lat: 25.6093, lng: 85.1376, address: 'Boring Road, Patna, Bihar', nearbyShop: 'Sri Krishna Sweets', landmark: '' },
      severity: 'medium',
      description_hi: 'बोरिंग रोड पर कई गड्ढे हैं। बारिश में पानी भर जाता है और दुर्घटना होती है।',
      description_en: 'Multiple potholes on Boring Road. Water fills up during rain causing accidents.',
      status: 'reported',
      likes: 45, dislikes: 2, reposts: 18,
      createdAt: now - 5 * DAY,
      reporterHandle: 'नागरिक_3390',
      authority: { name: 'Patna Nagar Nigam', contact: '0612-2219101', type: 'nagar_palika' },
      aiAnalysis: { type: 'pothole', severity: 'medium', confidence: 0.88 },
      resolvedAt: null, afterPhoto: null, verifications: 0
    },
    {
      id: 'rpt_007',
      type: 'garbage',
      photo: 'https://picsum.photos/seed/garbage2/400/300',
      location: { lat: 23.3441, lng: 85.3096, address: 'Main Road, Ranchi, Jharkhand', nearbyShop: 'Firayalal Chowk Market', landmark: 'Firayalal Chowk' },
      severity: 'low',
      description_hi: 'फिरायालाल चौक पर कूड़ेदान भरा हुआ है। सफाई कर्मी को बुलाने की जरूरत।',
      description_en: 'Dustbin overflowing at Firayalal Chowk. Sanitation worker needed.',
      status: 'verified_done',
      likes: 22, dislikes: 0, reposts: 8,
      createdAt: now - 20 * DAY,
      reporterHandle: 'नागरिक_5567',
      authority: { name: 'Ranchi Nagar Nigam', contact: '0651-2211002', type: 'nagar_palika' },
      aiAnalysis: { type: 'garbage', severity: 'low', confidence: 0.85 },
      resolvedAt: now - 12 * DAY, afterPhoto: 'https://picsum.photos/seed/garbagefix2/400/300', verifications: 25
    },
    {
      id: 'rpt_008',
      type: 'overflowing_drain',
      photo: 'https://picsum.photos/seed/drain2/400/300',
      location: { lat: 22.7196, lng: 75.8577, address: 'Rajwada, Indore, MP', nearbyShop: 'Sarafa Bazaar', landmark: 'Near Rajwada Palace' },
      severity: 'medium',
      description_hi: 'राजवाड़ा के पास नाला बंद है और गंदा पानी जमा हो रहा है। मच्छर बढ़ रहे हैं।',
      description_en: 'Drain blocked near Rajwada. Stagnant dirty water. Mosquito breeding increasing.',
      status: 'in_progress',
      likes: 33, dislikes: 1, reposts: 14,
      createdAt: now - 6 * DAY,
      reporterHandle: 'नागरिक_9012',
      authority: { name: 'Indore Nagar Nigam', contact: '0731-2534572', type: 'nagar_palika' },
      aiAnalysis: { type: 'overflowing_drain', severity: 'medium', confidence: 0.90 },
      resolvedAt: null, afterPhoto: null, verifications: 0
    },
    {
      id: 'rpt_009',
      type: 'broken_streetlight',
      photo: 'https://picsum.photos/seed/light2/400/300',
      location: { lat: 27.1767, lng: 78.0081, address: 'Fatehabad Road, Agra, UP', nearbyShop: 'Hotel Amar Vilas', landmark: 'Near Taj Mahal East Gate' },
      severity: 'low',
      description_hi: 'ताजमहल ईस्ट गेट के पास 3 स्ट्रीटलाइट बंद हैं। पर्यटकों को परेशानी।',
      description_en: '3 streetlights not working near Taj Mahal East Gate. Inconvenience for tourists.',
      status: 'reported',
      likes: 67, dislikes: 4, reposts: 20,
      createdAt: now - 4 * DAY,
      reporterHandle: 'नागरिक_4455',
      authority: { name: 'Agra Nagar Nigam', contact: '0562-2850971', type: 'nagar_palika' },
      aiAnalysis: { type: 'broken_streetlight', severity: 'low', confidence: 0.87 },
      resolvedAt: null, afterPhoto: null, verifications: 0
    },
    {
      id: 'rpt_010',
      type: 'pothole',
      photo: 'https://picsum.photos/seed/pothole3/400/300',
      location: { lat: 30.7333, lng: 76.7794, address: 'Sector 17, Chandigarh', nearbyShop: 'Bata Showroom', landmark: 'Sector 17 Market' },
      severity: 'low',
      description_hi: 'सेक्टर 17 मार्केट के सामने छोटा गड्ढा है। दोपहिया वाहनों को ध्यान रखना पड़ता है।',
      description_en: 'Small pothole in front of Sector 17 Market. Two-wheelers need to be careful.',
      status: 'verified_done',
      likes: 15, dislikes: 0, reposts: 3,
      createdAt: now - 25 * DAY,
      reporterHandle: 'नागरिक_6678',
      authority: { name: 'Chandigarh MC', contact: '0172-2700012', type: 'nagar_palika' },
      aiAnalysis: { type: 'pothole', severity: 'low', confidence: 0.82 },
      resolvedAt: now - 18 * DAY, afterPhoto: 'https://picsum.photos/seed/potholefix/400/300', verifications: 22
    },
    {
      id: 'rpt_011',
      type: 'burst_pipeline',
      photo: 'https://picsum.photos/seed/pipe2/400/300',
      location: { lat: 26.4500, lng: 74.6399, address: 'Pushkar Road, Ajmer, Rajasthan', nearbyShop: '', landmark: 'Kishangarh Village' },
      severity: 'high',
      description_hi: 'किशनगढ़ गाँव में पानी की मुख्य पाइपलाइन टूट गई है। पूरे गाँव में पानी की किल्लत।',
      description_en: 'Main water pipeline broken in Kishangarh village. Entire village facing water shortage.',
      status: 'reopened',
      likes: 89, dislikes: 15, reposts: 40,
      createdAt: now - 10 * DAY,
      reporterHandle: 'नागरिक_1123',
      authority: { name: 'Gram Panchayat Kishangarh', contact: '0145-2627890', type: 'gram_panchayat' },
      aiAnalysis: { type: 'burst_pipeline', severity: 'high', confidence: 0.95 },
      resolvedAt: null, afterPhoto: 'https://picsum.photos/seed/pipefix/400/300', verifications: 2
    },
    {
      id: 'rpt_012',
      type: 'garbage',
      photo: 'https://picsum.photos/seed/garbage3/400/300',
      location: { lat: 27.5530, lng: 76.6346, address: 'NH-48, Behror, Rajasthan', nearbyShop: '', landmark: 'Behror Village Highway' },
      severity: 'medium',
      description_hi: 'बहरोड़ गाँव के हाईवे किनारे कूड़ा जमा हो रहा है। जानवर कूड़ा खा रहे हैं।',
      description_en: 'Garbage accumulating on highway side near Behror village. Animals eating waste.',
      status: 'reported',
      likes: 18, dislikes: 1, reposts: 7,
      createdAt: now - 7 * DAY,
      reporterHandle: 'नागरिक_7845',
      authority: { name: 'Gram Panchayat Behror', contact: '01494-220123', type: 'gram_panchayat' },
      aiAnalysis: { type: 'garbage', severity: 'medium', confidence: 0.88 },
      resolvedAt: null, afterPhoto: null, verifications: 0
    },
    {
      id: 'rpt_013',
      type: 'overflowing_drain',
      photo: 'https://picsum.photos/seed/drain3/400/300',
      location: { lat: 26.9800, lng: 82.1200, address: 'Gonda-Bahraich Road, Colonelganj, UP', nearbyShop: '', landmark: 'Colonelganj Village' },
      severity: 'high',
      description_hi: 'कर्नलगंज गाँव में नाला टूट गया है और गंदा पानी खेतों में जा रहा है। फसल बर्बाद हो रही है।',
      description_en: 'Drain broken in Colonelganj village. Dirty water entering farmland. Crops getting destroyed.',
      status: 'in_progress',
      likes: 42, dislikes: 3, reposts: 19,
      createdAt: now - 12 * DAY,
      reporterHandle: 'नागरिक_2233',
      authority: { name: 'Gram Panchayat Colonelganj', contact: '05262-234567', type: 'gram_panchayat' },
      aiAnalysis: { type: 'overflowing_drain', severity: 'high', confidence: 0.92 },
      resolvedAt: null, afterPhoto: null, verifications: 0
    },
    {
      id: 'rpt_014',
      type: 'pothole',
      photo: 'https://picsum.photos/seed/pothole4/400/300',
      location: { lat: 18.5204, lng: 73.8567, address: 'FC Road, Pune, Maharashtra', nearbyShop: 'Vaishali Restaurant', landmark: 'Near Fergusson College' },
      severity: 'medium',
      description_hi: 'FC रोड पर गड्ढा है जिसमें बारिश का पानी भरा रहता है। स्कूटी और साइकिल वालों को खतरा।',
      description_en: 'Pothole on FC Road filled with rainwater. Danger for scooter and bicycle riders.',
      status: 'claimed_done',
      likes: 28, dislikes: 12, reposts: 10,
      createdAt: now - 18 * DAY,
      reporterHandle: 'नागरिक_9901',
      authority: { name: 'Pune Municipal Corporation', contact: '020-25501000', type: 'nagar_palika' },
      aiAnalysis: { type: 'pothole', severity: 'medium', confidence: 0.86 },
      resolvedAt: now - 5 * DAY, afterPhoto: 'https://picsum.photos/seed/potholefix2/400/300', verifications: 8
    },
    {
      id: 'rpt_015',
      type: 'broken_streetlight',
      photo: 'https://picsum.photos/seed/light3/400/300',
      location: { lat: 17.3850, lng: 78.4867, address: 'Banjara Hills, Hyderabad, Telangana', nearbyShop: 'GVK One Mall', landmark: 'Road No. 12' },
      severity: 'low',
      description_hi: 'बंजारा हिल्स रोड नं. 12 पर 2 स्ट्रीटलाइट खराब हैं।',
      description_en: '2 streetlights not working on Road No. 12, Banjara Hills.',
      status: 'reported',
      likes: 19, dislikes: 0, reposts: 6,
      createdAt: now - 3 * DAY,
      reporterHandle: 'नागरिक_3344',
      authority: { name: 'GHMC Hyderabad', contact: '040-21111111', type: 'nagar_palika' },
      aiAnalysis: { type: 'broken_streetlight', severity: 'low', confidence: 0.84 },
      resolvedAt: null, afterPhoto: null, verifications: 0
    }
  ];
}

// ── Data Access Functions ────────────────────────────────

function initData() {
  try {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(getSeedReports()));
    }
    if (!localStorage.getItem(USER_KEY)) {
      const handle = generateAnonymousHandle();
      localStorage.setItem(USER_KEY, JSON.stringify({ handle, createdAt: Date.now() }));
    }
    if (!localStorage.getItem(INTERACTIONS_KEY)) {
      localStorage.setItem(INTERACTIONS_KEY, JSON.stringify({}));
    }
  } catch (e) { console.error('initData error:', e); }
}

function getReports() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch { return []; }
}

function saveReports(reports) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(reports)); } catch (e) { console.error(e); }
}

function getReportById(id) {
  return getReports().find(r => r.id === id) || null;
}

function addReport(report) {
  const reports = getReports();
  report.id = 'rpt_' + Date.now();
  report.createdAt = Date.now();
  report.likes = 0;
  report.dislikes = 0;
  report.reposts = 0;
  report.status = 'reported';
  report.resolvedAt = null;
  report.afterPhoto = null;
  report.verifications = 0;
  report.reporterHandle = getCurrentUser().handle;
  reports.unshift(report);
  saveReports(reports);
  return report;
}

function updateReport(id, updates) {
  const reports = getReports();
  const idx = reports.findIndex(r => r.id === id);
  if (idx === -1) return null;
  reports[idx] = { ...reports[idx], ...updates };
  saveReports(reports);
  return reports[idx];
}

function findDuplicates(lat, lng, type, radiusM = 100) {
  return getReports().filter(r => {
    if (r.type !== type) return false;
    if (r.status === 'verified_done') return false;
    const dist = haversineDistance(lat, lng, r.location.lat, r.location.lng);
    return dist <= radiusM;
  });
}

function getReportsInRadius(lat, lng, radiusKm) {
  return getReports().filter(r => {
    const dist = haversineDistance(lat, lng, r.location.lat, r.location.lng);
    return dist <= radiusKm * 1000;
  });
}

// ── Interaction enforcement: 1 like/dislike/repost per user ──

function getInteractions() {
  try { return JSON.parse(localStorage.getItem(INTERACTIONS_KEY)) || {}; } catch { return {}; }
}

function saveInteractions(data) {
  try { localStorage.setItem(INTERACTIONS_KEY, JSON.stringify(data)); } catch (e) { console.error(e); }
}

function hasInteracted(reportId, action) {
  const data = getInteractions();
  return !!(data[reportId] && data[reportId][action]);
}

function recordInteraction(reportId, action) {
  const data = getInteractions();
  if (!data[reportId]) data[reportId] = {};
  data[reportId][action] = true;
  saveInteractions(data);
}

function likeReport(id) {
  if (hasInteracted(id, 'like') || hasInteracted(id, 'dislike')) return false;
  const reports = getReports();
  const r = reports.find(r => r.id === id);
  if (!r) return false;
  r.likes++;
  saveReports(reports);
  recordInteraction(id, 'like');
  return true;
}

function dislikeReport(id) {
  if (hasInteracted(id, 'dislike') || hasInteracted(id, 'like')) return false;
  const reports = getReports();
  const r = reports.find(r => r.id === id);
  if (!r) return false;
  r.dislikes++;
  if (r.status === 'claimed_done' && r.dislikes >= 5 && r.dislikes > r.likes) {
    r.status = 'reopened';
  }
  saveReports(reports);
  recordInteraction(id, 'dislike');
  return true;
}

function repostReport(id) {
  if (hasInteracted(id, 'repost')) return false;
  const reports = getReports();
  const r = reports.find(r => r.id === id);
  if (!r) return false;
  r.reposts++;
  saveReports(reports);
  recordInteraction(id, 'repost');
  return true;
}

function requiredVerifications(report) {
  return report.authority?.type === 'gram_panchayat' ? 5 : 20;
}

function verifyReport(id) {
  if (hasInteracted(id, 'verify')) return false;
  const reports = getReports();
  const report = reports.find(item => item.id === id);
  if (!report || report.status !== 'claimed_done') return false;
  report.verifications = (report.verifications || 0) + 1;
  if (report.verifications >= requiredVerifications(report)) {
    report.status = 'verified_done';
  }
  saveReports(reports);
  recordInteraction(id, 'verify');
  return true;
}

// ── Dashboard Stats ──────────────────────────────────────

function totalReports() { return getReports().length; }

function solvedPercentage() {
  const all = getReports();
  if (!all.length) return 0;
  const solved = all.filter(r => r.status === 'verified_done').length;
  return Math.round((solved / all.length) * 100);
}

function avgResolutionTimeDays() {
  const solved = getReports().filter(r => r.resolvedAt && r.createdAt);
  if (!solved.length) return 0;
  const total = solved.reduce((sum, r) => sum + (r.resolvedAt - r.createdAt), 0);
  return Math.round(total / solved.length / 86400000);
}

function reportsByType() {
  const counts = {};
  getReports().forEach(r => { counts[r.type] = (counts[r.type] || 0) + 1; });
  return counts;
}

function reportsByStatus() {
  const counts = {};
  getReports().forEach(r => { counts[r.status] = (counts[r.status] || 0) + 1; });
  return counts;
}

// ── User ─────────────────────────────────────────────────

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY)) || { handle: 'नागरिक_0000' }; } catch { return { handle: 'नागरिक_0000' }; }
}

function generateAnonymousHandle() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return 'नागरिक_' + num;
}

// ── Utility ──────────────────────────────────────────────

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = x => x * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function generateWhatsAppShareLink(report) {
  const lang = localStorage.getItem('janawaaz_lang') || 'hi';
  const desc = lang === 'hi' ? report.description_hi : report.description_en;
  const typeLabel = lang === 'hi' ? REPORT_TYPES[report.type].hi : REPORT_TYPES[report.type].en;
  const text = `🚨 *जन आवाज़ | Jan Awaaz*\n\n📍 ${report.location.address}\n🔧 ${typeLabel}: ${desc}\n⚠️ ${lang === 'hi' ? 'गंभीरता' : 'Severity'}: ${report.severity}\n\n${lang === 'hi' ? 'कृपया इस मुद्दे पर ध्यान दें!' : 'Please pay attention to this issue!'}\n\n#JanAwaaz #CitizenInitiative`;
  return 'https://wa.me/?text=' + encodeURIComponent(text);
}

function containsBadWords(text) {
  const lower = text.toLowerCase();
  return BAD_WORDS_HI.some(w => lower.includes(w.toLowerCase()));
}

function adminLogin(username, password) {
  return username === 'admin' && password === 'janawaaz2024';
}
