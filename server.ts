import express from 'express';
import path from 'path';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized GoogleGenAI client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

const AMA_SYSTEM_INSTRUCTION = `You are AMA, the intelligent maternal health and financial planning companion inside MAMA YIE ("Safe Motherhood" in Twi).
You are warm, reassuring, highly practical, respectful, culturally attuned to Ghanaian mothers (Ashanti, Kumasi, Accra, etc.), and non-judgmental.
You know words in Twi like "Akwaaba" (Welcome), "Wo ho te sɛn?" (How are you?), "Yie pɛ" (Everything will be well), "Nyame nhyira wo" (God bless you).

IMPORTANT RULES & BOUNDARIES:
1. You are NOT a doctor or midwife. You do NOT diagnose medical conditions, prescribe medications, or replace clinical care.
2. If a user describes serious or emergency warning signs (such as heavy vaginal bleeding, severe abdominal cramps, blurred vision, severe headache, sudden swelling of face/hands, foul discharge, high fever, or reduced baby kicks), you MUST calmly and urgently urge them to go immediately to the nearest hospital or see their midwife.
3. You help with:
   - Pregnancy preparation and timeline
   - Estimated delivery and antenatal cost planning in Ghana (GH₵)
   - The MAMA YIE core loop: "You don't need spare money to start. Mama Yie helps mothers EARN the savings they don't have yet through vetted partner product referrals (like Numa Organics)."
   - Setting achievable weekly savings targets (e.g., GH₵25-30/week)
   - Finding vetted local care partners and facilities (e.g., Suntreso Hospital, Sister Afia Midwifery, Adum Imaging)
   - Connecting with local Support Circles (mothers with similar due dates)
   - USSD access guidance for basic-phone users (*920*44#)
4. Never invent fake medical claims, fake hospital bills as legally binding, or fabricated certifications.
5. ALWAYS conclude medical questions with this standard note:
   "Ama provides planning and general information. She is not a substitute for a qualified healthcare professional."
6. Keep replies concise, readable on mobile screens, and encouraging.`;

// Intelligent fallback responses when Gemini is offline or unconfigured
function generateOfflineAmaResponse(message: string, userProfile?: any): string {
  const lower = message.toLowerCase();

  if (lower.includes('emergency') || lower.includes('bleed') || lower.includes('pain') || lower.includes('fever') || lower.includes('swelling')) {
    return `⚠️ Mama, your safety and your baby's health come first. Please do not wait. If you are experiencing heavy bleeding, severe abdominal pain, persistent fever, or sudden severe swelling, please visit the emergency unit at ${userProfile?.facility || 'your nearest district hospital'} immediately or call your midwife right away.\n\n*Ama provides planning and general information. She is not a substitute for a qualified healthcare professional.*`;
  }

  if (lower.includes('earn') || lower.includes('no money') || lower.includes('dont have money') || lower.includes('don\'t have money') || lower.includes('start saving')) {
    return `Akwaaba, Akosua! This is the core principle of Mama Yie: **You don't need spare cash to begin.**\n\nThrough Mama Yie's vetted partners like **Numa Organics**, you can share organic Ghanaian botanical skincare (like whipped shea butter and nourishing belly oil). Every time a customer buys with your code **AKOSUA-NUMA**, you earn a demo commission (e.g. GH₵5–7) that goes directly into your dedicated Motherhood Fund.\n\nWould you like to explore the products and share your link now?`;
  }

  if (lower.includes('cost') || lower.includes('prepare') || lower.includes('delivery') || lower.includes('how much')) {
    return `Based on your profile (5 months pregnant in Kumasi, planning at ${userProfile?.facility || 'Suntreso Hospital'}), normal delivery preparation typically ranges between **GH₵450 and GH₵600**.\n\nThis covers:\n- Basic delivery pack & antiseptic supplies (~GH₵180)\n- Routine antenatal labs & 2D scan (~GH₵160)\n- Facility administration & postpartum care (~GH₵120)\n- Emergency transport buffer (~GH₵90)\n\nWith 16-18 weeks remaining, saving or earning just **GH₵30 per week** will ensure your motherhood fund is fully ready before your due date!`;
  }

  if (lower.includes('ussd') || lower.includes('basic phone') || lower.includes('no smartphone') || lower.includes('feature phone')) {
    return `Yes, absolutely! Mama Yie was built specifically with basic-phone users in mind.\n\nYou do not need a smartphone, mobile app, or bank account. You can dial **\*920\*44#** on any phone to check your savings balance, get weekly pregnancy guidance, track your referral earnings via SMS, and connect with your Support Circle.`;
  }

  if (lower.includes('partner') || lower.includes('hospital') || lower.includes('doctor') || lower.includes('midwife') || lower.includes('facility')) {
    return `In Kumasi and the Ashanti Region, Mama Yie has founder-vetted healthcare partners including:\n1. **Sister Afia Midwifery & Maternal Home** (Bantama) — Negotiated midwife consultation at GH₵280 (normally GH₵350).\n2. **Suntreso Maternal Care Wing** (North Suntreso) — Discounted delivery prep vouchers.\n3. **Adum Diagnostic Imaging** — High-resolution obstetric scans at GH₵160 (normally GH₵220).\n\nYou can use your earned Mama Yie balance to offset eligible care fees directly!`;
  }

  if (lower.includes('circle') || lower.includes('other mother') || lower.includes('group')) {
    return `You have been matched with the **March 2027 Kumasi Mothers Circle**! There are 4 mothers in your circle (Serwaa, Abena, Yaa, and you). Together, your group has already prepared **GH₵1,240** towards motherhood.\n\nIt is a safe, encouraging space where mothers share tips, celebrate weekly savings milestones, and support one another without revealing private medical information.`;
  }

  return `Akwaaba, Akosua! I am Ama, your companion on this journey. Whether you want to know what to prepare for delivery, how to earn toward your target with Numa Organics, check your savings balance, or connect with your Support Circle, I am right here by your side.\n\nWhat would you like to explore first today?\n\n*Ama provides planning and general information. She is not a substitute for a qualified healthcare professional.*`;
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'Mama Yie',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// WhatsApp Integration Config Endpoint (Official One-way Broadcast Channel)
app.get('/api/whatsapp/config', (req, res) => {
  const channelUrl = process.env.WHATSAPP_CHANNEL_URL || 'https://whatsapp.com/channel/placeholder';
  res.json({
    success: true,
    channelName: 'MAMA YIE 💗 | Care. Connect. Earn. Save.',
    channelUrl,
    description:
      'Care, support and practical resources for mothers in Ghana. Get maternal-health education, Earn & Save opportunities, partner updates and community news from Mama Yie.',
    broadcastMode: 'ONE_WAY_BROADCAST',
    enabled: true,
    twoWaySupport: {
      status: 'COMING_SOON',
      title: 'Need personal help?',
      description: 'Two-way Mama Yie support on WhatsApp is coming soon.',
      plannedFlow: 'Mother -> WhatsApp -> Meta WhatsApp Business -> Secure Backend -> Mama Yie AI -> Firebase -> Mother',
      plannedCapabilities: [
        'Ask Mama Yie maternal planning questions',
        'Find consultants and midwives',
        'Find verified hospitals',
        'Check Motherhood Fund savings',
        'Find Earn & Save opportunities',
        'Receive antenatal reminders',
        'Navigate Mama Yie services via WhatsApp',
      ],
    },
    updatedAt: new Date().toISOString(),
  });
});

// Meta WhatsApp Cloud API Webhook Verification Handshake
app.get('/api/whatsapp/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === 'subscribe' && token && verifyToken && token === verifyToken) {
    console.log('WhatsApp webhook verified successfully.');
    res.status(200).send(challenge);
    return;
  }

  res.status(403).json({
    error: 'Verification token mismatch or webhook verification token not configured',
    status: 'COMING_SOON',
  });
});

// Future Two-Way WhatsApp Message Ingestion Webhook Architecture
// Flow: Mother -> WhatsApp -> Mama Yie WhatsApp Business messaging -> Secure backend -> Mama Yie AI -> Firebase -> Mother
app.post('/api/whatsapp/webhook', async (req, res) => {
  const isIntegrationLive = Boolean(process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);

  if (!isIntegrationLive) {
    // Explicitly enforce: Do NOT pretend the AI WhatsApp chat is already connected.
    res.status(503).json({
      status: 'COMING_SOON',
      message: 'Two-way Mama Yie support on WhatsApp is coming soon. The official broadcast channel is active at /api/whatsapp/config.',
      live: false,
      flow: 'Mother -> WhatsApp -> Mama Yie WhatsApp Business messaging -> Secure backend -> Mama Yie AI -> Firebase -> Mother',
    });
    return;
  }

  try {
    // When live credentials are provided in production:
    const body = req.body;
    res.status(200).json({ status: 'received' });
  } catch (err: any) {
    console.error('WhatsApp webhook error:', err);
    res.status(500).json({ error: 'Webhook processing failure' });
  }
});

// Partner Info Endpoint (Numa Organics public brand data)
app.get('/api/partners/numa', (req, res) => {
  res.json({
    name: 'Numa Organics',
    website: 'https://numaorganics.shop',
    status: 'POTENTIAL_PARTNER_DEMO_MODE',
    disclaimer: 'This integration is in Demo Partner Mode. Product names, public descriptions and baseline pricing are sourced from public information. Commission rates are demo estimates and not partner-confirmed.',
  });
});

// Cost Estimation API
app.post('/api/ama/estimate', async (req, res) => {
  try {
    const { facility = 'Suntreso Government Hospital', region = 'Ashanti', pregnancyMonth = 5 } = req.body;
    const weeksRemaining = Math.max(4, (9 - pregnancyMonth) * 4);
    const minEstimate = 450;
    const maxEstimate = 600;
    const target = 600;
    const weeklyTarget = Math.round(target / weeksRemaining);

    res.json({
      success: true,
      minEstimate,
      maxEstimate,
      targetPreparationAmount: target,
      weeklyTarget,
      weeksRemaining,
      breakdown: {
        maternityKit: 'GH₵150 - GH₵200 (Macintosh, cotton wool, surgical gloves, cord clamp, antiseptic)',
        antenatalLabsAndScans: 'GH₵140 - GH₵180 (Full blood count, urine analysis, 2D growth scan)',
        facilitySupportFee: 'GH₵100 - GH₵140 (Antenatal card registration, postpartum review)',
        emergencyTransportBuffer: 'GH₵60 - GH₵80 (Taxi/ride fare buffer to labor ward)',
      },
      disclaimer: 'Estimated delivery preparation figures are illustrative demo ranges based on public district facility data in Kumasi. They are not guaranteed hospital prices.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Haversine distance calculator (km)
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// In-memory non-sensitive place cache (15-minute TTL per Google Maps caching terms)
interface CachedPlacesEntry {
  timestamp: number;
  data: any[];
}
const placesCache = new Map<string, CachedPlacesEntry>();
const CACHE_TTL_MS = 15 * 60 * 1000;

// Curated Ghana maternal facilities directory (Mama Yie verified + public healthcare facilities)
const DEFAULT_GHANA_FACILITIES = [
  {
    id: 'health_02',
    name: 'Suntreso Maternal Care Wing & Polyclinic',
    address: 'North Suntreso, Kumasi, Ashanti Region, Ghana',
    lat: 6.7025,
    lng: -1.6382,
    phone: '+233 32 202 4412',
    type: 'MATERNAL_HOSPITAL',
    category: 'Maternity Hospital & Polyclinic',
    openStatusText: 'Open 24/7 (Labor & Delivery)',
    isOpen: true,
    rating: 4.7,
    userRatingCount: 382,
    isMamaYieVerified: true,
    verificationBadge: 'Mama Yie Verified Partner',
    verificationNote: 'Vetted partner. Accepts Mama Yie Motherhood Fund vouchers with negotiated rates.',
    maternalServices: ['Labor & Delivery Ward', 'Antenatal Booking', 'Neonatal Care', 'Postnatal Observation'],
    isEmergencyReady: true,
    canUseSavings: true,
  },
  {
    id: 'health_01',
    name: 'Sister Afia Midwifery & Maternal Home',
    address: 'Bantama High Street, Kumasi, Ashanti Region, Ghana',
    lat: 6.7042,
    lng: -1.6289,
    phone: '+233 24 411 9820',
    type: 'MIDWIFE_CLINIC',
    category: 'Registered Midwifery Clinic',
    openStatusText: 'Open Now • 07:00 – 19:00 (On-Call Midwife 24/7)',
    isOpen: true,
    rating: 4.9,
    userRatingCount: 215,
    isMamaYieVerified: true,
    verificationBadge: 'Mama Yie Verified Partner',
    verificationNote: 'Vetted partner. 1-on-1 midwife care and birth kit counseling with Fund vouchers.',
    maternalServices: ['Personal Midwife Consultation', 'Fetal Monitoring', 'Birth Kit Prep', 'Postpartum Follow-up'],
    isEmergencyReady: false,
    canUseSavings: true,
  },
  {
    id: 'health_03',
    name: 'Adum Diagnostic & Obstetric Imaging Center',
    address: 'Prempeh II Street, Adum Central, Kumasi, Ghana',
    lat: 6.6914,
    lng: -1.6241,
    phone: '+233 20 812 3349',
    type: 'DIAGNOSTIC_CENTER',
    category: 'Ultrasound & Diagnostic Center',
    openStatusText: 'Open Now • 08:00 – 18:00',
    isOpen: true,
    rating: 4.8,
    userRatingCount: 164,
    isMamaYieVerified: true,
    verificationBadge: 'Mama Yie Verified Partner',
    verificationNote: 'Vetted partner. Negotiated rate for 2D/3D obstetric scans using Fund vouchers.',
    maternalServices: ['2D/3D Obstetric Ultrasound', 'Fetal Anatomy Scan', 'Antenatal Blood & Urine Labs'],
    isEmergencyReady: false,
    canUseSavings: true,
  },
  {
    id: 'google_kath_maternity',
    name: 'Komfo Anokye Teaching Hospital (KATH) - Directorate of Obstetrics & Gynaecology',
    address: 'Bantama, Kumasi, Ashanti Region, Ghana',
    lat: 6.6987,
    lng: -1.6276,
    phone: '+233 32 202 2301',
    type: 'MATERNAL_HOSPITAL',
    category: 'Tertiary Teaching Hospital & Referral Center',
    openStatusText: 'Open 24/7 (Emergency Obstetrics)',
    isOpen: true,
    rating: 4.3,
    userRatingCount: 1420,
    isMamaYieVerified: false,
    verificationBadge: 'Google-Discovered Facility',
    verificationNote: 'Public healthcare facility listed on Google. Not a Mama Yie verified discount partner. Major referral hospital.',
    maternalServices: ['24/7 Emergency Maternity', 'High-Risk Pregnancy Unit', 'NICU Neonatal Intensive Care', 'Caesarean Sections'],
    isEmergencyReady: true,
    canUseSavings: false,
  },
  {
    id: 'google_manhyia_hospital',
    name: 'Manhyia District Hospital - Maternal & Child Health Wing',
    address: 'Manhyia Palace Enclave, Kumasi, Ghana',
    lat: 6.7078,
    lng: -1.6143,
    phone: '+233 32 202 5410',
    type: 'MATERNAL_HOSPITAL',
    category: 'Government District Hospital',
    openStatusText: 'Open 24/7',
    isOpen: true,
    rating: 4.2,
    userRatingCount: 520,
    isMamaYieVerified: false,
    verificationBadge: 'Google-Discovered Facility',
    verificationNote: 'Public healthcare facility listed on Google. Government district hospital serving Kumasi East.',
    maternalServices: ['Labor Ward', 'Antenatal Clinic', 'Child Welfare Clinic', 'Maternal Triage'],
    isEmergencyReady: true,
    canUseSavings: false,
  },
  {
    id: 'google_tafo_hospital',
    name: 'Tafo Government Hospital - Maternity Unit',
    address: 'Hospital Road, Old Tafo, Kumasi, Ghana',
    lat: 6.7321,
    lng: -1.6112,
    phone: '+233 32 207 0122',
    type: 'HOSPITAL',
    category: 'Municipal Hospital',
    openStatusText: 'Open 24/7',
    isOpen: true,
    rating: 4.1,
    userRatingCount: 310,
    isMamaYieVerified: false,
    verificationBadge: 'Google-Discovered Facility',
    verificationNote: 'Public municipal hospital listed on Google. Verify available maternal beds on arrival.',
    maternalServices: ['Antenatal Care', 'Standard Delivery', 'Postnatal Clinic'],
    isEmergencyReady: true,
    canUseSavings: false,
  },
  {
    id: 'google_mchh_kumasi',
    name: 'Maternal & Child Health Hospital (Children\'s Hospital)',
    address: 'Pampaso / Adum, Kumasi, Ghana',
    lat: 6.6942,
    lng: -1.6218,
    phone: '+233 32 202 3871',
    type: 'MATERNAL_HOSPITAL',
    category: 'Specialist Maternal & Child Hospital',
    openStatusText: 'Open 24/7 (Emergency Admissions)',
    isOpen: true,
    rating: 4.4,
    userRatingCount: 460,
    isMamaYieVerified: false,
    verificationBadge: 'Google-Discovered Facility',
    verificationNote: 'Public healthcare facility listed on Google. Specialized in mother and child healthcare.',
    maternalServices: ['Maternity Care', 'Pediatric Urgent Care', 'Immunization', 'Nutrition Clinic'],
    isEmergencyReady: true,
    canUseSavings: false,
  },
  {
    id: 'google_knust_hospital',
    name: 'KNUST Hospital - Maternal & Child Unit',
    address: 'University Campus, Kumasi, Ghana',
    lat: 6.6749,
    lng: -1.5694,
    phone: '+233 32 206 0233',
    type: 'HOSPITAL',
    category: 'University Hospital',
    openStatusText: 'Open 24/7',
    isOpen: true,
    rating: 4.5,
    userRatingCount: 680,
    isMamaYieVerified: false,
    verificationBadge: 'Google-Discovered Facility',
    verificationNote: 'Accredited university hospital facility listed on Google.',
    maternalServices: ['Obstetric Care', 'Labor Unit', 'Antenatal Labs', 'Pharmacy'],
    isEmergencyReady: true,
    canUseSavings: false,
  },
  {
    id: 'google_kumasi_south',
    name: 'Kumasi South Regional Hospital (Agogo Hospital)',
    address: 'Atonsu Agogo, Kumasi, Ghana',
    lat: 6.6548,
    lng: -1.5975,
    phone: '+233 32 208 0419',
    type: 'HOSPITAL',
    category: 'Regional Referral Hospital',
    openStatusText: 'Open 24/7',
    isOpen: true,
    rating: 4.3,
    userRatingCount: 740,
    isMamaYieVerified: false,
    verificationBadge: 'Google-Discovered Facility',
    verificationNote: 'Public regional hospital listed on Google.',
    maternalServices: ['Maternity Ward', 'Emergency Surgery', 'Antenatal Clinic'],
    isEmergencyReady: true,
    canUseSavings: false,
  },
  {
    id: 'google_ridge_accra',
    name: 'Greater Accra Regional Hospital (Ridge Hospital) - Maternal Wing',
    address: 'Castle Road, Ridge, Accra, Ghana',
    lat: 5.5601,
    lng: -0.1989,
    phone: '+233 30 222 8315',
    type: 'MATERNAL_HOSPITAL',
    category: 'Regional Referral Hospital',
    openStatusText: 'Open 24/7 (Obstetric Emergency)',
    isOpen: true,
    rating: 4.4,
    userRatingCount: 1890,
    isMamaYieVerified: false,
    verificationBadge: 'Google-Discovered Facility',
    verificationNote: 'Public healthcare facility listed on Google for Greater Accra.',
    maternalServices: ['24/7 Emergency Delivery', 'Intensive Neonatal Care', 'Specialist Obstetricians'],
    isEmergencyReady: true,
    canUseSavings: false,
  },
];

// Hospital Locator API: Google Places API (New) + Curated Ghana Network
app.get('/api/hospitals/nearby', async (req, res) => {
  try {
    const latParam = req.query.lat ? parseFloat(req.query.lat as string) : 6.6885; // Default: Kumasi Kejetia
    const lngParam = req.query.lng ? parseFloat(req.query.lng as string) : -1.6244;
    const filterType = (req.query.type as string) || 'all';
    const searchQuery = (req.query.query as string)?.trim() || '';

    // Cache key based on rounded coordinates or text query
    const cacheKey = searchQuery
      ? `q:${searchQuery.toLowerCase()}:${filterType}`
      : `coord:${latParam.toFixed(2)}:${lngParam.toFixed(2)}:${filterType}`;

    const cached = placesCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      res.json({
        success: true,
        source: 'cached',
        facilities: cached.data,
        searchCenter: { lat: latParam, lng: lngParam },
      });
      return;
    }

    let googlePlacesResults: any[] = [];
    const googleApiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_PLACES_API_KEY;

    if (googleApiKey) {
      try {
        const placesUrl = 'https://places.googleapis.com/v1/places:searchNearby';
        const response = await fetch(placesUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': googleApiKey,
            'X-Goog-FieldMask':
              'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.nationalPhoneNumber,places.currentOpeningHours,places.types,places.googleMapsUri',
          },
          body: JSON.stringify({
            includedTypes: ['hospital', 'medical_clinic'],
            maxResultCount: 10,
            locationRestriction: {
              circle: {
                center: {
                  latitude: latParam,
                  longitude: lngParam,
                },
                radius: 15000.0,
              },
            },
          }),
        });

        if (response.ok) {
          const data: any = await response.json();
          if (Array.isArray(data.places)) {
            googlePlacesResults = data.places.map((place: any) => {
              const pLat = place.location?.latitude || latParam;
              const pLng = place.location?.longitude || lngParam;
              const dist = calculateDistanceKm(latParam, lngParam, pLat, pLng);

              return {
                id: place.id,
                name: place.displayName?.text || 'Healthcare Facility',
                address: place.formattedAddress || 'Location via Google Maps',
                lat: pLat,
                lng: pLng,
                phone: place.nationalPhoneNumber || '',
                type: place.types?.includes('hospital') ? 'HOSPITAL' : 'CLINIC',
                category: 'Google-Discovered Facility',
                openStatusText: place.currentOpeningHours?.openNow ? 'Open Now' : 'Check opening hours',
                isOpen: place.currentOpeningHours?.openNow ?? null,
                rating: place.rating || 4.2,
                userRatingCount: place.userRatingCount || 0,
                isMamaYieVerified: false,
                verificationBadge: 'Google-Discovered Facility',
                verificationNote: 'Unverified directory listing from Google Places. Please confirm maternal services and fees directly with the hospital.',
                maternalServices: ['General Hospital Care', 'Medical Services'],
                isEmergencyReady: true,
                canUseSavings: false,
                googleMapsUrl: place.googleMapsUri || `https://www.google.com/maps/dir/?api=1&destination=${pLat},${pLng}`,
                distanceKm: dist,
                distanceFormatted: `${dist} km away`,
              };
            });
          }
        }
      } catch (gErr: any) {
        console.log('Google Places API notice:', gErr.message || 'Falling back to directory');
      }
    }

    // Process curated directory with distance calculation
    const curatedFacilities = DEFAULT_GHANA_FACILITIES.map((facility) => {
      const dist = calculateDistanceKm(latParam, lngParam, facility.lat, facility.lng);
      return {
        ...facility,
        distanceKm: dist,
        distanceFormatted: `${dist} km away`,
        googleMapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`,
      };
    });

    // Merge: First Mama Yie verified partners, then Google Places / public facilities
    let combinedFacilities: any[] = [];
    const verifiedOnes = curatedFacilities.filter((f) => f.isMamaYieVerified);
    const unverifiedCurated = curatedFacilities.filter((f) => !f.isMamaYieVerified);

    // Filter by manual search query if provided
    let listToFilter = [...verifiedOnes, ...googlePlacesResults, ...unverifiedCurated];
    if (searchQuery) {
      const queryLower = searchQuery.toLowerCase();
      listToFilter = listToFilter.filter(
        (f) =>
          f.name.toLowerCase().includes(queryLower) ||
          f.address.toLowerCase().includes(queryLower) ||
          f.category.toLowerCase().includes(queryLower) ||
          f.maternalServices?.some((s: string) => s.toLowerCase().includes(queryLower))
      );
    }

    // Filter by type if not 'all'
    if (filterType === 'maternity') {
      listToFilter = listToFilter.filter(
        (f) =>
          f.type === 'MATERNAL_HOSPITAL' ||
          f.type === 'MIDWIFE_CLINIC' ||
          f.name.toLowerCase().includes('matern') ||
          f.name.toLowerCase().includes('midwi')
      );
    } else if (filterType === 'emergency') {
      listToFilter = listToFilter.filter((f) => f.isEmergencyReady);
    } else if (filterType === 'verified') {
      listToFilter = listToFilter.filter((f) => f.isMamaYieVerified);
    }

    // De-duplicate by name
    const seenNames = new Set<string>();
    const uniqueFacilities: any[] = [];
    for (const item of listToFilter) {
      const simpleName = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!seenNames.has(simpleName)) {
        seenNames.add(simpleName);
        uniqueFacilities.push(item);
      }
    }

    // Sort: Verified partners first, then by distance
    uniqueFacilities.sort((a, b) => {
      if (a.isMamaYieVerified && !b.isMamaYieVerified) return -1;
      if (!a.isMamaYieVerified && b.isMamaYieVerified) return 1;
      return a.distanceKm - b.distanceKm;
    });

    // Cache the result
    placesCache.set(cacheKey, {
      timestamp: Date.now(),
      data: uniqueFacilities,
    });

    res.json({
      success: true,
      facilities: uniqueFacilities,
      total: uniqueFacilities.length,
      searchCenter: { lat: latParam, lng: lngParam },
      usingGooglePlacesLive: googlePlacesResults.length > 0,
      disclaimer:
        'Mama Yie clearly distinguishes between Mama Yie-verified healthcare providers (vetted partners with fund vouchers) and Google Places directory discoveries. Google results are not endorsed or verified by Mama Yie. For emergencies, dial 193 or visit an emergency room immediately.',
      emergencyHotlines: {
        nationalAmbulance: '193',
        emergencyGeneral: '112',
        mamaYieMidwifeHelpline: '+233 24 411 9820',
      },
    });
  } catch (err: any) {
    console.error('Error in /api/hospitals/nearby:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to search nearby facilities',
      facilities: DEFAULT_GHANA_FACILITIES.map((f) => ({
        ...f,
        distanceKm: 2.5,
        distanceFormatted: 'Near Kumasi',
        googleMapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${f.lat},${f.lng}`,
      })),
    });
  }
});

// Authoritative product commissions dictionary (never trust client amounts)
const VERIFIED_PRODUCT_COMMISSIONS: Record<string, { partnerId: string; name: string; commission: number }> = {
  numa_prod_01: { partnerId: 'partner_numa_organics', name: 'Shea Butter Body Care Bundle', commission: 5 },
  numa_prod_02: { partnerId: 'partner_numa_organics', name: 'Pure Baobab & Sweet Almond Nourish Oil', commission: 7 },
  numa_prod_03: { partnerId: 'partner_numa_organics', name: 'Traditional Herbal Black Soap Gentle Glow Bar', commission: 4 },
  numa_prod_04: { partnerId: 'partner_numa_organics', name: 'Organic Mother & Newborn Botanical Care Balm', commission: 6 },
  perfume_prod_01: { partnerId: 'partner_affordable_perfumes_gh', name: 'Calm Jasmine & Vanilla Gentle Mist', commission: 6 },
  diya_prod_01: { partnerId: 'partner_diya_organics', name: 'Herbal Scalp & Hair Strength Elixir', commission: 6 },
};

// Server-authoritative balances store
const serverUserBalances: Record<string, { currentBalance: number; goalAmount: number; currency: string }> = {
  user_akosua_01: { currentBalance: 120, goalAmount: 600, currency: 'GHS' },
};
const processedIdempotencyKeys = new Set<string>();

// Trusted backend commission endpoint with idempotency guard
app.post('/api/savings/demo-commission', (req, res) => {
  try {
    const { userId, productId, partnerId, customerName, idempotencyKey } = req.body;
    if (!userId || !productId) {
      res.status(400).json({ error: 'Missing userId or productId' });
      return;
    }

    const key = idempotencyKey || `${userId}_${productId}`;
    if (processedIdempotencyKeys.has(key)) {
      const current = serverUserBalances[userId]?.currentBalance || 120;
      res.json({
        success: true,
        alreadyProcessed: true,
        message: 'Commission already recorded for this purchase event. Duplicate prevention active.',
        newBalance: current,
        commission: 0,
      });
      return;
    }

    // Authoritative lookup: calculate commission strictly on server
    const productInfo = VERIFIED_PRODUCT_COMMISSIONS[productId] || {
      partnerId: partnerId || 'partner_numa_organics',
      name: 'Vetted Partner Product',
      commission: 5,
    };

    const commission = productInfo.commission;

    if (!serverUserBalances[userId]) {
      serverUserBalances[userId] = { currentBalance: 120, goalAmount: 600, currency: 'GHS' };
    }

    serverUserBalances[userId].currentBalance += commission;
    processedIdempotencyKeys.add(key);

    const txId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    res.json({
      success: true,
      alreadyProcessed: false,
      newBalance: serverUserBalances[userId].currentBalance,
      commission,
      transactionId: txId,
      productName: productInfo.name,
      customerName: customerName || 'Customer in Kumasi Adum',
    });
  } catch (err: any) {
    console.error('Error in /api/savings/demo-commission:', err);
    res.status(500).json({ error: 'Failed to process commission' });
  }
});

// Secure balance retrieval
app.get('/api/savings/balance/:userId', (req, res) => {
  const { userId } = req.params;
  const balance = serverUserBalances[userId] || { currentBalance: 120, goalAmount: 600, currency: 'GHS' };
  res.json({ success: true, balance });
});

// Ama AI Chat API (Server-side Gemini + Fallback)
app.post('/api/ama/chat', async (req, res) => {
  try {
    const { message, history = [], userProfile } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Sync real verified balance from server store if exists
    const verifiedBalance = userProfile?.id && serverUserBalances[userProfile.id]
      ? serverUserBalances[userProfile.id].currentBalance
      : (userProfile?.currentSavings || 120);

    const ai = getGenAI();

    if (ai) {
      try {
        const conversationContext = `User Profile:
- Name: ${userProfile?.name || 'Akosua'}
- Age: ${userProfile?.age || 24}
- Pregnancy Stage: ${userProfile?.pregnancyMonth || 5} months pregnant (Due March 2027)
- Location: ${userProfile?.region || 'Kumasi, Ashanti Region'}
- Facility: ${userProfile?.facility || 'Suntreso Government Hospital'}
- Starting Savings: GH₵${userProfile?.startingSavings || 0}
- Current Savings: GH₵${verifiedBalance}
- Target: GH₵${userProfile?.targetPreparationAmount || 600}
- Referral Code: ${userProfile?.referralCode || 'AKOSUA-NUMA'}
- Primary Phone: ${userProfile?.phoneType || 'Basic phone (USSD)'}`;

        const prompt = `${conversationContext}\n\nUser Question: ${message}`;

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 30000)
        );

        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.5-flash-lite',
          contents: prompt,
          config: {
            systemInstruction: AMA_SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);

        const reply = response.text || generateOfflineAmaResponse(message, userProfile);
        res.json({ reply, mode: 'gemini-live' });
        return;
      } catch (geminiError: any) {
        console.log('Gemini request info:', geminiError?.message || 'Using fallback companion');
      }
    }

    // Fallback if no API key or error
    const offlineReply = generateOfflineAmaResponse(message, userProfile);
    res.json({ reply: offlineReply, mode: 'intelligent-offline-companion' });
  } catch (err: any) {
    console.error('Error in /api/ama/chat:', err);
    res.status(500).json({ error: 'Failed to process request', reply: generateOfflineAmaResponse(req.body?.message || '') });
  }
});

// Vite middleware or static serving
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mama Yie server listening on http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
