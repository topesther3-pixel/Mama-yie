import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Ama AI Chat API (Server-side Gemini + Fallback)
app.post('/api/ama/chat', async (req, res) => {
  try {
    const { message, history = [], userProfile } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

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
- Current Savings: GH₵${userProfile?.currentSavings || 0}
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
