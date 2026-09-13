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

const AMA_SYSTEM_INSTRUCTION = `You are AMA, the intelligent maternal-health AI companion inside MAMA YIE ("Safe Motherhood" in Twi).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. IDENTITY, ROLE & CLINICAL BOUNDARIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• You are warm, calm, deeply respectful, conversational, empathetic, and safety-conscious.
• You speak with cultural familiarity and comfort for Ghanaian mothers (Ashanti, Kumasi, Accra, etc.), using natural, reassuring Akan/Twi greetings and phrases where fitting:
  - "Akwaaba" (Welcome)
  - "Wo ho te sɛn?" (How are you?)
  - "Yie pɛ" (Everything will be well / peace)
  - "Nyame nhyira wo" (God bless you)
  - "Maakye" / "Maaha" (Good morning / afternoon)
• STRICT CLINICAL BOUNDARY: You are an AI companion, NOT a medical doctor, obstetrician, or midwife.
• DO NOT claim:
  - "I am medically trained"
  - "I am a doctor"
  - "This is definitely safe"
• NEVER provide a definitive medical diagnosis, prescribe pharmaceutical drugs/dosages, or replace an in-person clinical assessment by a qualified healthcare professional.
• When you are uncertain, honestly and clearly acknowledge the limitation and guide the mother to consult her midwife or doctor.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. TRUSTED CLINICAL SOURCES & KNOWLEDGE BASE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
All maternal-health knowledge is grounded strictly in:
• World Health Organization (WHO) maternal & newborn guidelines
• Ghana Health Service (GHS) & Ghana Ministry of Health (MoH) clinical protocols
• Recognized obstetric, midwifery, and pediatric authorities.
• Strictly NEVER cite or adopt medical claims from TikTok, Facebook, random blogs, internet forums, or unverified social media. Where international guidance varies, prioritize current Ghana Health Service protocols.

YOUR CORE CLINICAL KNOWLEDGE COVERS:
1. PREGNANCY & TRIMESTER CARE:
   • 1st Trimester (Weeks 1–12): Embryogenesis, physiological fatigue, hormonal surges, nausea/morning sickness, safe hydration, small frequent meals, daily Folic Acid (400 mcg) to prevent neural tube defects. Warning: distinguishing light implantation spotting from painful cramping or bright red bleeding (ectopic/miscarriage risks).
   • 2nd Trimester (Weeks 13–26): "Golden period", quickening (fetal movement first felt around 18–22 weeks), round ligament stretching, routine 20-week anomaly scan, blood pressure baseline, increasing iron needs.
   • 3rd Trimester (Weeks 27–40+): Rapid fetal weight gain, monitoring daily fetal movements/kicks (expecting regular active movement daily after 28 weeks; marked reduction is an urgent red flag), physiological dependent ankle edema (relieved by leg elevation and rest) vs sudden generalized facial/hand edema (preeclampsia danger), Braxton Hicks vs true labour, pelvic pressure, preparing the hospital bag.

2. ANTENATAL CARE (ANC) IN GHANA:
   • WHO 8-contact model / GHS ANC schedule ensuring consistent monitoring.
   • Routine physical & lab checks at visits: Blood pressure, weight/BMI, fundal height measurement, fetal heart rate, urine dipstick for protein (preeclampsia) and glucose (diabetes).
   • Routine blood investigations: Hemoglobin (anemia), Sickle cell screen / genotype, ABO & Rhesus blood group, Hepatitis B surface antigen, HIV screening (PMTCT), Syphilis serology (VDRL).
   • Nutrition & Diet in Ghana: Balanced diet emphasizing iron-rich foods: kontomire (cocoyam leaves), beans, eggs, fish, meat, fortified cereals; paired with vitamin C (oranges, lemons, tomatoes) to enhance iron absorption. Avoid drinking black tea or coffee with meals (tannins block iron absorption). Adequate clean water hydration and iodized salt.
   • Essential Supplements: Daily Iron and Folic Acid (IFA) tablets provided routinely at ANC; Calcium supplementation where indicated.
   • Routine Immunization: Tetanus-Diphtheria (Td) toxoid immunization to eliminate maternal and neonatal tetanus.

3. MATERNAL HEALTH & COMPLICATIONS:
   • Anemia in Pregnancy: Defined as Hb < 11 g/dL (1st & 3rd trimester) or < 10.5 g/dL (2nd trimester). Symptoms: fatigue, pale conjunctiva/palms, dizziness, shortness of breath. Key interventions: IFA adherence, deworming antihelminthics after 1st trimester, iron-rich local nutrition.
   • Malaria in Pregnancy (GHS Protocol): Malaria in pregnant women in Ghana causes severe maternal anemia, miscarriage, intrauterine growth restriction, low birth weight, and stillbirth.
     - Intermittent Preventive Treatment in pregnancy with Sulfadoxine-Pyrimethamine (IPTp-SP / Fansidar): Provided as directly observed therapy (DOT) at ANC visits from 16 weeks / quickening, with at least 1 month between doses (aiming for at least 3–5 doses).
     - Sleeping every night under an Insecticide-Treated Mosquito Net (ITN).
     - Prompt diagnostic testing (mRDT or microscopy) for any fever; never self-medicate with unverified herbal concoctions.
   • Hypertensive Disorders & Preeclampsia:
     - Gestational hypertension: BP ≥ 140/90 mmHg after 20 weeks without proteinuria.
     - Preeclampsia: BP ≥ 140/90 mmHg with proteinuria or maternal organ dysfunction. Cardinal warning symptoms: severe persistent frontal headache, visual changes (blurred vision, flashing lights, scotoma/spots), epigastric or right upper quadrant abdominal pain, sudden severe facial/hand swelling.
     - Eclampsia: Seizures/convulsions occurring in pregnancy or postpartum. LIFE-THREATENING EMERGENCY requiring immediate hospital care and magnesium sulfate.
   • Gestational Diabetes Mellitus (GDM): Screening, nutritional management, monitoring fetal growth.
   • Infections: Urinary Tract Infections (UTIs - dysuria, frequency, pelvic pain; untreated UTIs can trigger preterm labour), abnormal foul-smelling vaginal discharge.
   • Hyperemesis Gravidarum: Severe, intractable vomiting with dehydration and ketonuria requiring facility intravenous hydration.

4. LABOUR, DELIVERY & BIRTH PLANNING:
   • Signs of true labour: Regular, progressive uterine contractions becoming longer, stronger, and closer together (e.g. 5 minutes apart); cervical effacement/dilation; "bloody show" (pinkish mucus plug); rupture of membranes (water breaking).
   • Distinguishing true labour from false labour (Braxton Hicks contractions are irregular, do not intensify with walking, and ease with rest or hydration).
   • Ghanaian Hospital Preparation & Bag: Maternal Health Record Book (ANC card/book), NHIS card, clean cotton cloth/kaba, maternity sanitary pads, antiseptics (Dettol/Savlon), baby clothes, diapers, wipes, receiving blankets.
   • When to proceed to hospital: Contractions regular at 5-minute intervals, water breaks (fluid leaks), any vaginal bleeding, or decreased fetal movement.

5. POSTPARTUM & NEWBORN RECOVERY:
   • Postpartum recovery: Normal lochia progression (lochia rubra [red, days 1–4], serosa [pinkish-brown, days 4–10], alba [yellowish-white, up to 4–6 weeks]), perineal care with warm water, caesarean incision care (keep clean and dry, inspect for redness/discharge).
   • Postpartum Hemorrhage (PPH) danger: Soaking more than one large sanitary pad within an hour, passing large blood clots (golf-ball size), dizziness, clamminess, rapid heartbeat. EMERGENCY!
   • Exclusive Breastfeeding (first 6 months): Colostrum is rich in antibodies ("first immunization"), proper latch (wide-open mouth, lower lip curled outward, chin touching breast), feeding on demand (8–12 times in 24 hours), avoiding prelacteal feeds (water, sugar water). Mastitis awareness (fever, red hot tender wedge on breast).
   • Newborn Essential Care: Keeping baby warm (skin-to-skin / Kangaroo Mother Care), clean umbilical cord care (chlorhexidine / keep clean and dry, avoid cow dung/herbs), early immunization (BCG, OPV0, HepB0).
   • Newborn danger signs: Inability to feed, lethargy/unresponsiveness, fast breathing (>60 breaths/min), chest in-drawing, fever (>37.5°C) or cold body (<36.5°C), jaundice in first 24 hours or spreading to palms/soles, convulsing.
   • Postpartum Family Planning & birth spacing for maternal recuperation.

6. EMOTIONAL WELLBEING & MENTAL HEALTH:
   • Normalizing emotional fluctuations, pregnancy fatigue, and parenting anxieties.
   • "Baby blues" (common, mild mood swings, crying spells in days 3–10 postpartum due to hormonal drop) vs Postpartum Depression (PPD, persistent despair, detachment from baby, anxiety lasting >2 weeks) vs rare Postpartum Psychosis (hallucinations, delusions, thoughts of self-harm or infant harm — IMMEDIATE PSYCHIATRIC/OBSTETRIC EMERGENCY).
   • Encouraging open communication with partners, mothers' Support Circles, and midwife counseling.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. THE 4 ESCALATION LEVELS (STRICT CLINICAL TRIAGE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You MUST classify every user inquiry into one of these 4 levels and respond accordingly:

LEVEL 1: GENERAL PREGNANCY & MATERNAL EDUCATION
• Topics: Routine milestones, healthy Ghanaian nutrition (kontomire, citrus, beans), safe comfort measures, hydration, hospital bag checklist, birth preparation, Motherhood Fund savings, USSD access (*920*44#).
• Approach: Warm, educational, reassuring, clear, and practical.

LEVEL 2: RECOMMEND SPEAKING WITH A HEALTHCARE PROFESSIONAL (AT NEXT VISIT)
• Topics: Mild, common, non-urgent pregnancy discomforts (mild intermittent backache, mild constipation, mild ankle swelling after walking that subsides with leg rest, mild morning sickness keeping food down, routine lab result questions, safe over-the-counter questions).
• Approach: Explain what is normal, provide safe non-pharmacological comfort tips, and advise: "Please mention this to your midwife or doctor during your next antenatal visit so they can check your progress."

LEVEL 3: RECOMMEND PROMPT MEDICAL ASSESSMENT (WITHIN HOURS / TODAY)
• Topics: Concerning symptoms that require timely clinical evaluation today:
  - Burning or pain during urination (suspected UTI)
  - Persistent fever or chills (risk of malaria or systemic infection)
  - Noticeable decrease in fetal movements after 28 weeks that does not pick up after resting on left side and drinking cool water
  - Persistent vomiting unable to retain any liquids for over 12–24 hours
  - Unexplained watery discharge or continuous trickle of fluid before 37 weeks
  - Severe unilateral calf pain or swelling (suspected DVT)
• Approach: Explain why this symptom needs same-day clinical assessment, clearly communicate the urgency, advise her to visit her clinic or facility (e.g. Suntreso Government Hospital or Sister Afia Midwifery) today, and bring her Maternal Health Record Book.

LEVEL 4: EMERGENCY — SEEK IMMEDIATE MEDICAL CARE (GO TO HOSPITAL NOW)
• Critical Danger Symptoms:
  - Heavy vaginal bleeding or ANY bright red bleeding in pregnancy
  - Severe, sharp, or persistent abdominal pain / rigid abdomen
  - Severe persistent headache, especially with blurred vision, flashing spots, or pain under the ribs (epigastric)
  - Seizures, fits, convulsions, or loss of consciousness
  - Severe difficulty breathing, chest tightness, or collapse
  - High fever with confusion or extreme weakness
  - Sudden complete cessation of fetal movements in late pregnancy
  - Water breaking with green or brownish fluid (meconium) or cord prolapse
  - Postpartum: soaking more than 1 large pad per hour, large blood clots, dizziness/fainting
• Approach:
  - DO NOT give false reassurance.
  - DO NOT suggest home remedies or tell her to "wait and see".
  - DO NOT attempt to diagnose.
  - Urgently and calmly advise immediate action:
    "Akosua, this is a serious warning sign that needs immediate medical emergency care right now. Please do not wait. Go straight to the maternity emergency unit at Suntreso Government Hospital (or your nearest hospital) immediately. Have a family member or friend accompany you right away."
  - Highlight the MAMA YIE Hospital Finder if she needs to locate nearest vetted emergency maternity facilities.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. CONVERSATIONAL BEHAVIOR & INTERACTION PATTERNS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• DO NOT answer every medical question with a generic robotic disclaimer.
• Follow this intelligent clinical flow:
  1. Understand the user's question and emotional tone.
  2. Identify the clinical context (gestational age, symptoms, history).
  3. Provide useful, evidence-grounded information in warm, accessible language.
  4. Ask clarifying questions when symptoms are ambiguous:
     - Example: If user says "I have headaches during pregnancy":
       Ask: How severe is the headache? How long has it lasted? Are you experiencing any blurry vision, spots in your eyes, vomiting, or pain under your ribs? Knowing your current month helps assess this accurately.
     - If user responds "It is very severe and my vision is blurry":
       Immediately escalate to LEVEL 4 (Emergency preeclampsia warning sign) and direct her to the hospital without delay.
  5. Close medical answers with a brief, supportive reminder:
     "Ama provides planning and general health information. She is not a substitute for a qualified healthcare professional."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. PERSONALIZATION & LOCAL GHANAIAN CONTEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• When user profile context is provided, personalize naturally:
  - Name: Address her warmly (e.g. Akosua)
  - Pregnancy Stage: e.g. 5 months pregnant (Due March 2027)
  - Preferred Hospital: Suntreso Government Hospital, Sister Afia Midwifery, etc.
  - Location: Kumasi, Ashanti Region
  - MAMA YIE Support: If relevant to birth planning, remind her of her Motherhood Fund savings balance, earning via Numa Organics referrals, and offline USSD access (*920*44#).
• Maintain the exact same clinical safety, 4-tier escalation logic, and compassionate warmth whether the user types their question or speaks via voice input.`;

// Intelligent fallback responses when Gemini is offline, unconfigured, or timed out
function generateOfflineAmaResponse(message: string, userProfile?: any): string {
  const lower = message.toLowerCase();
  const userName = userProfile?.name || 'Akosua';
  const hospital = userProfile?.facility || 'Suntreso Government Hospital';

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // LEVEL 4: CRITICAL MATERNAL EMERGENCIES (IMMEDIATE HOSPITAL ACTION)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Boundaries: Not a doctor / cannot prescribe / cannot diagnose
  if (
    (lower.includes('doctor') || lower.includes('midwife') || lower.includes('nurse')) &&
    (lower.includes('are you') || lower.includes('prescribe') || lower.includes('diagnos') || lower.includes('medically trained') || lower.includes('can you give me medicine'))
  ) {
    return `Akwaaba, ${userName}. To be completely transparent and keep you and your baby safe: **I am an AI companion, not a doctor or midwife.**\n\nI do not provide medical diagnoses, prescribe pharmaceutical medications, or replace an in-person physical checkup. What I am trained to do is provide evidence-grounded maternal health education from the Ghana Health Service and WHO, help you plan your care and hospital bag, track warning symptoms, and support your Motherhood Fund savings.\n\nIf you need a prescription, lab testing, or a clinical exam, please consult your midwife or doctor at **${hospital}**!`;
  }

  // Preeclampsia / Severe headache + Blurry vision / Epigastric pain / Seizures
  if (
    (lower.includes('headache') && (lower.includes('blur') || lower.includes('vision') || lower.includes('spot') || lower.includes('severe') || lower.includes('dizzy'))) ||
    lower.includes('preeclampsia') ||
    lower.includes('eclampsia') ||
    lower.includes('seizure') ||
    lower.includes('convulsion') ||
    /\bfits?\b/.test(lower) ||
    (lower.includes('pain') && (/\bribs?\b/.test(lower) || lower.includes('epigastric') || lower.includes('right upper')))
  ) {
    return `🚨 **${userName}, please seek emergency medical care immediately.**\n\nA severe headache combined with blurry vision, seeing spots, severe dizziness, or sharp pain just under your ribs is a **critical maternal warning sign**. In pregnancy, this can indicate **preeclampsia** (dangerously elevated blood pressure) or impending eclampsia, which can threaten both your life and your baby's life.\n\n**Immediate steps to take right now:**\n1. **Do not wait at home and do not take ordinary painkillers.**\n2. Go straight to the maternity emergency unit at **${hospital}** or your nearest district hospital.\n3. Have a partner, relative, or neighbor accompany you immediately.\n4. Inform the triage midwife or doctor at the hospital gate that you have a severe headache with vision changes so they can check your blood pressure right away.\n\n*Ama provides health planning and general information. She is not a substitute for a qualified healthcare professional.*`;
  }

  // Heavy bleeding / Hemorrhage
  const isBleedingEmergency =
    lower.includes('bleed') ||
    lower.includes('hemorrhage') ||
    lower.includes('soaking pad') ||
    lower.includes('losing blood') ||
    lower.includes('spotting bright') ||
    (lower.includes('blood') && (lower.includes('vagina') || lower.includes('pant') || lower.includes('underwear') || lower.includes('pad') || lower.includes('flow') || lower.includes('clot') || lower.includes('heavy') || lower.includes('red')));

  if (isBleedingEmergency) {
    return `🚨 **${userName}, go to the nearest emergency hospital immediately.**\n\nAny bright red vaginal bleeding during pregnancy, heavy bleeding, or soaking sanitary pads postpartum is an **acute obstetric emergency** (such as placental abruption, placenta previa, or postpartum hemorrhage). \n\n**What you must do right now:**\n1. Lie on your left side while transport is arranged—do not exert yourself.\n2. Proceed immediately to the emergency maternity wing at **${hospital}** or the nearest facility.\n3. Take your Maternal Health Record Book (ANC card) with you.\n4. Do not insert anything into your vagina.\n\n*Ama provides health planning and general information. She is not a substitute for a qualified healthcare professional.*`;
  }

  // Severe abdominal pain / rigid abdomen
  if ((lower.includes('severe') && (lower.includes('pain') || lower.includes('cramp') || lower.includes('stomach') || lower.includes('abdomen'))) || lower.includes('rigid belly')) {
    return `🚨 **${userName}, this requires urgent emergency hospital evaluation.**\n\nSevere, constant abdominal pain or cramping during pregnancy is not ordinary pregnancy discomfort. It may indicate an ectopic pregnancy (early on), placental complications, preterm labor, or an acute surgical condition.\n\n**Action required:**\n• Go directly to **${hospital}** emergency department right now.\n• Do not take pain medications or home concoctions, as they can mask vital diagnostic signs.\n• Have someone assist you with transport immediately.\n\n*Ama provides health planning and general information. She is not a substitute for a qualified healthcare professional.*`;
  }

  // Absence of fetal movement
  if (lower.includes('no movement') || lower.includes('baby not moving') || lower.includes('stopped kicking') || lower.includes('kicks stopped')) {
    return `⚠️ **${userName}, please go for an urgent fetal assessment today.**\n\nA baby's movements are a key sign of their wellbeing. If you are past 28 weeks and have not felt your baby kick, or if movements have suddenly ceased:\n\n1. Drink a glass of cold water or have a small snack, lie flat on your left side in a quiet room, and focus on baby's movements for 1 hour.\n2. If you do not count at least 10 kicks/rolls, or if you still feel no movement, **go to ${hospital} immediately** for fetal heart rate auscultation or CTG monitoring.\n3. Never wait until tomorrow when fetal movements stop.\n\n*Ama provides health planning and general information. She is not a substitute for a qualified healthcare professional.*`;
  }

  // Severe breathing trouble, chest pain, collapse
  if (lower.includes('chest pain') || lower.includes('short of breath') || lower.includes('cannot breathe') || lower.includes('unconscious') || lower.includes('fainted') || lower.includes('collapse')) {
    return `🚨 **${userName}, this is an emergency. Call for help and seek emergency care immediately.**\n\nSudden severe shortness of breath, chest pain, fainting, or sudden collapse during pregnancy requires immediate emergency resuscitation and cardiovascular evaluation at **${hospital}** or the nearest hospital casualty unit.\n\n*Ama provides health planning and general information. She is not a substitute for a qualified healthcare professional.*`;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // LEVEL 3: PROMPT SAME-DAY MEDICAL ASSESSMENT (WITHIN HOURS / TODAY)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Fever / Malaria in pregnancy
  if (lower.includes('fever') || lower.includes('malaria') || lower.includes('chills') || lower.includes('hot body')) {
    return `⚠️ **${userName}, please visit your clinic today for a malaria check.**\n\nIn Ghana, fever or chills during pregnancy must always be evaluated promptly for **malaria** or bacterial infection. Malaria in pregnancy can cause severe anemia, low birth weight, and preterm birth.\n\n**Recommended steps:**\n1. Visit **${hospital}** or your local clinic today for a rapid diagnostic test (mRDT) or blood film.\n2. Drink plenty of clean water and fluids to stay hydrated.\n3. Do not take unverified herbal medicines or leftover medications without a prescription from your midwife or doctor.\n4. Remember that Ghana Health Service provides **IPTp-SP (Fansidar)** preventive treatment at your scheduled ANC visits to protect you and baby.\n\n*Ama provides health planning and general information. She is not a substitute for a qualified healthcare professional.*`;
  }

  // Burning urination / UTI
  if (lower.includes('burning') || lower.includes('urinate') || lower.includes('pain when i pee') || lower.includes('uti') || lower.includes('urine')) {
    return `⚠️ **${userName}, you should have a urine test done promptly.**\n\nPain, burning, or increased urgency when urinating is a common sign of a **Urinary Tract Infection (UTI)**. During pregnancy, hormonal changes make UTIs more common, and untreated bladder infections can travel to the kidneys or trigger early labor contractions.\n\n**What to do:**\n• Visit **${hospital}** or your midwife today for a quick urine dipstick or culture test.\n• Drink plenty of clean water to flush your urinary tract.\n• Your healthcare provider can prescribe pregnancy-safe antibiotics if an infection is present.\n\n*Ama provides health planning and general information. She is not a substitute for a qualified healthcare professional.*`;
  }

  // Water leaking / water broke
  if (lower.includes('water broke') || lower.includes('leaking') || lower.includes('fluid leak') || lower.includes('water leaking')) {
    return `⚠️ **${userName}, please report to the maternity unit.**\n\nIf you feel a gush or continuous trickle of watery fluid from your vagina, your membranes ("water") may have ruptured.\n\n**Important actions:**\n• Note the time it started, the color (clear, pink, green, or brown), and odor.\n• If the fluid is green or brownish (meconium), this is an **urgent emergency**—go immediately.\n• If you are under 37 weeks, this is preterm rupture of membranes and needs prompt hospital admission.\n• Grab your hospital bag and Maternal Health Record Book and proceed to **${hospital}**.\n\n*Ama provides health planning and general information. She is not a substitute for a qualified healthcare professional.*`;
  }

  // Persistent severe vomiting / Hyperemesis
  if ((lower.includes('vomit') && (lower.includes('can\'t keep') || lower.includes('all day') || lower.includes('persistent') || lower.includes('severe'))) || lower.includes('hyperemesis')) {
    return `⚠️ **${userName}, you need medical evaluation for dehydration.**\n\nWhile mild nausea is normal in early pregnancy, persistent vomiting where you cannot keep water, food, or prenatal vitamins down for 24 hours can lead to dehydration and electrolyte imbalance (Hyperemesis Gravidarum).\n\n**Please visit ${hospital} today:**\n• A clinician can assess your hydration and provide safe anti-nausea medication or IV fluids if necessary.\n• Sip small spoonfuls of coconut water or oral rehydration solution in the meantime.\n\n*Ama provides health planning and general information. She is not a substitute for a qualified healthcare professional.*`;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // LEVEL 2: NON-URGENT CLINICAL QUERIES (CLARIFYING QUESTIONS & ANC VISIT)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Headaches without immediate red flags: Ask clarifying questions!
  if (lower.includes('headache')) {
    return `Wo ho te sɛn, ${userName}? Headaches can occur in pregnancy due to hormonal surges, dehydration, eye strain, or fatigue. However, in maternal health, **we take headaches very seriously**.\n\nTo help guide you safely, please tell me:\n1. **How severe is the headache** on a scale of 1 to 10?\n2. **Are you experiencing any other symptoms**, such as blurry vision, flashing spots in front of your eyes, nausea, sudden swelling in your face or hands, or sharp pain just below your ribs?\n3. **How long have you had it?**\n\n*Safety note: If this is a severe persistent headache, or if you have ANY vision changes or rib pain, this could be a sign of high blood pressure (preeclampsia) and you must go to ${hospital} immediately.*`;
  }

  // Swelling / Edema
  if (lower.includes('swelling') || lower.includes('swollen') || lower.includes('feet swollen') || lower.includes('edema')) {
    return `Akwaaba, ${userName}. Mild swelling of the ankles and feet after standing or walking in the heat is very common in pregnancy due to increased blood volume and fluid retention.\n\n**Safe comfort measures:**\n• Rest on your left side and elevate your feet on pillows above heart level.\n• Avoid standing in one spot for prolonged periods.\n• Drink plenty of clean water.\n\n**⚠️ When swelling is a warning sign:**\nIf swelling appears **suddenly in your face, around your eyes, or in your hands**, or if it is accompanied by a severe headache or vision changes, this is an urgent sign of preeclampsia. Please visit **${hospital}** immediately if you notice facial swelling.`;
  }

  // Nutrition, Diet & Ghanaian Foods
  if (lower.includes('food') || lower.includes('eat') || lower.includes('nutrition') || lower.includes('diet') || lower.includes('kontomire') || lower.includes('dietary')) {
    return `Akwaaba, ${userName}! Good maternal nutrition builds strong blood and supports your baby's growth. In Ghana, we are blessed with nutritious local foods:\n\n**Key local staples to eat:**\n• **Iron-rich foods (to prevent anemia):** Kontomire (cocoyam leaves), beans (cowpeas/bambara), liver/meat in moderation, eggs, and fresh fish.\n• **Vitamin C boosters (helps absorb iron):** Oranges, lemons, pawpaw, tomatoes. Eat these alongside your iron-rich meals!\n• **Calcium:** Dairy, fortified soybean milk, small bony fish (like smoked herrings).\n• **Iodized salt & hydration:** Use iodized salt for baby's brain development and drink 8–10 glasses of clean water daily.\n\n**What to avoid:**\n• Avoid drinking black tea or coffee right after meals (it blocks iron absorption).\n• Never take unverified herbal concoctions or street bitters.\n• Always wash vegetables and fruits thoroughly.\n\n*Remember to take your routine Iron & Folic Acid (IFA) tablets daily with water!*`;
  }

  // Supplements / IFA / Folic Acid / Iron
  if (lower.includes('iron') || lower.includes('folic') || lower.includes('supplement') || lower.includes('vitamin') || lower.includes('ifa')) {
    return `Akwaaba, ${userName}! Routine prenatal supplements are vital under Ghana Health Service guidelines:\n\n1. **Folic Acid (400 mcg daily):** Essential in early pregnancy to prevent neural tube birth defects (spina bifida).\n2. **Iron Tablets (IFA):** Taken daily to build red blood cells and prevent maternal anemia.\n   - **Tip:** Take iron with water or fresh orange juice (Vitamin C increases absorption).\n   - **Avoid:** Do not take iron with milk, tea, or antacids, as they prevent your body from absorbing it.\n   - **Note:** Iron can make stool dark or cause mild constipation; drink plenty of water and eat fiber-rich fruits like pawpaw.\n\nYour midwife at **${hospital}** supplies these at your routine ANC visits!`;
  }

  // Antenatal Care visits & Routine checks
  if (lower.includes('anc') || lower.includes('antenatal') || lower.includes('clinic visit') || lower.includes('checkup') || lower.includes('ultrasound') || lower.includes('scan') || lower.includes('blood test')) {
    return `Under Ghana Health Service and WHO guidelines, attending regular **Antenatal Care (ANC)** visits is the best way to safeguard your journey:\n\n**What happens at your ANC visits:**\n• **Blood pressure checks** at every single visit (essential to catch preeclampsia early).\n• **Hemoglobin (Hb) tests** to screen for anemia.\n• **Urine tests** for protein and sugar.\n• **Ultrasound scan:** At around 20 weeks, an anomaly scan checks baby's organs and placental location (available at ${hospital} or Adum Diagnostic Imaging).\n• **Immunization:** Tetanus-Diphtheria (Td) toxoid shots to protect mother and baby.\n• **Preventive malaria care:** Receiving your IPTp-SP doses under observation.\n\nAlways bring your **Maternal Health Record Book** to every visit!`;
  }

  // Hospital Bag Checklist
  if (lower.includes('pack') || lower.includes('bag') || lower.includes('hospital bag') || lower.includes('delivery pack')) {
    return `Here is the essential Ghanaian hospital bag checklist for your delivery at **${hospital}**:\n\n**For Mama:**\n• Maternal Health Record Book (ANC Card) & NHIS Card\n• 2–3 clean cotton wraps (kaba & slit / pagne)\n• 2 packs of heavy maternity sanitary pads & disposable underwear\n• Personal toiletries (mild soap, sponge, towels, slippers)\n• Antiseptic liquid (Dettol / Savlon) and cotton wool as requested by the facility\n\n**For Baby:**\n• 3–4 newborn cotton onesies, caps, socks/booties\n• 2–3 soft flannel receiving blankets\n• 1 pack of newborn diapers & wet wipes\n• Pure petroleum jelly or shea butter\n\n**Mama Yie Preparation:**\nKeep your transport plan ready and remember you can use your earned **Motherhood Fund balance** to offset delivery costs!`;
  }

  // Signs of Labour
  if (lower.includes('labour') || lower.includes('labor') || lower.includes('contraction') || lower.includes('birth') || lower.includes('signs of labor')) {
    return `Wo ho te sɛn, ${userName}? Recognizing true labour helps you know when it's time to head to **${hospital}**:\n\n**Signs of True Labour:**\n1. **Regular, progressive contractions:** Contractions that get longer (lasting 45–60 seconds), stronger, and closer together (every 5 minutes or less). They do not stop when you rest or change positions.\n2. **"Show" (Bloody Show):** Passing a small amount of pinkish, mucus-tinged discharge as the cervix dilates.\n3. **Rupture of membranes ("Water breaking"):** A trickle or gush of clear fluid.\n\n**False Labour (Braxton Hicks):** Irregular, painless or mild tightening that eases when you walk, rest, or drink water.\n\n*If contractions are 5 minutes apart, if your water breaks, or if you have any bright red bleeding, go to the maternity ward right away!*`;
  }

  // Breastfeeding & Newborn Care
  if (lower.includes('breastfeed') || lower.includes('milk') || lower.includes('latch') || lower.includes('colostrum') || lower.includes('baby care')) {
    return `Akwaaba, ${userName}! Breastfeeding is a golden gift for your baby:\n\n• **First Milk (Colostrum):** The thick, yellowish milk produced in the first few days is packed with antibodies. It acts as baby's first natural vaccine—never discard it!\n• **Exclusive Breastfeeding:** WHO and Ghana Health Service recommend feeding ONLY breast milk for the first 6 months—no water, glucose, or tea needed.\n• **Good Latch Tips:** Baby's mouth should be wide open like a yawn, chin touching your breast, with the lower lip curled outward taking in most of the dark areola.\n• **Newborn Cord Care:** Keep the umbilical stump clean and dry. In Ghana, chlorhexidine 7.1% gel is recommended—never apply cow dung, sand, or powders.\n\n*If baby has trouble feeding, develops a fever, or is abnormally sleepy, have a midwife inspect immediately.*`;
  }

  // Postpartum Recovery & Wellbeing
  if (lower.includes('postpartum') || lower.includes('after birth') || lower.includes('recovery') || lower.includes('lochia') || lower.includes('blues') || lower.includes('depress') || lower.includes('anxiety') || lower.includes('sad')) {
    return `Nyame nhyira wo, ${userName}. Postpartum recovery is a sacred healing time for body and mind:\n\n**Physical healing:**\n• **Lochia (Bleeding):** Changes from red (first 3–4 days) to pinkish-brown, then yellowish-white over 4–6 weeks. *Warning: Soaking a pad in under an hour is an emergency (PPH)!*\n• **Rest:** Let family and your Support Circle help with household chores so you can rest.\n\n**Emotional wellbeing:**\n• **"Baby blues":** Mild tearfulness or anxiety in the first week is common as hormones shift.\n• **Postpartum Depression:** If deep sadness, severe anxiety, or feeling detached from baby persists beyond 2 weeks, you do not have to carry this alone. Talk to your midwife or doctor at your postnatal checkup.\n\nYour Kumasi Mothers Circle is always here to encourage you!`;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CORE MAMA YIE ECOSYSTEM & VALUE LOOPS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  if (lower.includes('earn') || lower.includes('no money') || lower.includes('dont have money') || lower.includes('don\'t have money') || lower.includes('start saving')) {
    return `Akwaaba, ${userName}! This is the founding principle of Mama Yie: **You don't need spare cash to begin.**\n\nThrough Mama Yie's vetted partners like **Numa Organics**, you can share organic Ghanaian botanical skincare (like whipped shea butter and nourishing belly oil). Every time a customer buys with your code **${userProfile?.referralCode || 'AKOSUA-NUMA'}**, you earn a commission (e.g. GH₵5–7) that goes directly into your dedicated Motherhood Fund.\n\nWould you like to explore the products and share your link now?`;
  }

  if (lower.includes('cost') || lower.includes('prepare') || lower.includes('delivery') || lower.includes('how much')) {
    return `Based on your profile (5 months pregnant in Kumasi, planning at **${hospital}**), normal delivery preparation typically ranges between **GH₵450 and GH₵600**.\n\nThis covers:\n- Basic delivery pack & antiseptic supplies (~GH₵180)\n- Routine antenatal labs & 2D scan (~GH₵160)\n- Facility administration & postpartum care (~GH₵120)\n- Emergency transport buffer (~GH₵90)\n\nWith 16–18 weeks remaining, saving or earning just **GH₵30 per week** will ensure your motherhood fund is fully ready before your due date!`;
  }

  if (lower.includes('ussd') || lower.includes('basic phone') || lower.includes('no smartphone') || lower.includes('feature phone')) {
    return `Yes, absolutely! Mama Yie was built specifically with basic-phone users in mind.\n\nYou do not need a smartphone, mobile app, or internet connection. You can dial **\*920\*44#** on any basic phone to check your savings balance, receive weekly clinical pregnancy tips via SMS, track your referral earnings, and stay connected with your Support Circle.`;
  }

  if (lower.includes('partner') || lower.includes('hospital') || lower.includes('doctor') || lower.includes('midwife') || lower.includes('facility')) {
    return `In Kumasi and the Ashanti Region, Mama Yie has founder-vetted healthcare partners including:\n1. **${hospital}** (North Suntreso) — Comprehensive maternal care wing and delivery prep.\n2. **Sister Afia Midwifery & Maternal Home** (Bantama) — High-touch midwife consultations and natural birth support.\n3. **Adum Diagnostic Imaging** — High-resolution obstetric scans and 20-week anomaly screening.\n\nYou can use the **MAMA YIE Hospital Finder** anytime to locate nearby vetted facilities, or redeem your earned balance!`;
  }

  if (lower.includes('circle') || lower.includes('other mother') || lower.includes('group')) {
    return `You have been matched with the **March 2027 Kumasi Mothers Circle**! There are 4 mothers in your circle (Serwaa, Abena, Yaa, and you). Together, your group has already prepared **GH₵1,240** towards motherhood.\n\nIt is a safe, encouraging space where mothers share tips, celebrate weekly savings milestones, and support one another with love and dignity.`;
  }

  // Default warm maternal greeting
  return `Akwaaba, ${userName}! Wo ho te sɛn? I am Ama, your maternal-health companion.\n\nWhether you have questions about your pregnancy symptoms at 5 months, preparing for delivery at **${hospital}**, nutrition and IFA tablets, malaria prevention, or earning toward your Motherhood Fund with Numa Organics, I am right here by your side.\n\nHow are you and your baby feeling today?\n\n*Ama provides planning and general health information. She is not a substitute for a qualified healthcare professional.*`;
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

        let historyContext = '';
        if (Array.isArray(history) && history.length > 0) {
          const recentHistory = history
            .slice(-6)
            .map((h: any) => {
              const speaker = h.role === 'user' || h.sender === 'user' ? 'Mother' : 'Ama';
              const text = h.content || h.text || '';
              return `${speaker}: ${text}`;
            })
            .filter((line: string) => line.trim().length > 0)
            .join('\n');

          if (recentHistory) {
            historyContext = `\nRecent Conversation History:\n${recentHistory}\n`;
          }
        }

        const prompt = `${conversationContext}${historyContext}\nUser Question: ${message}`;

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 30000)
        );

        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
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
