import { collection, getDocs, doc, setDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FirebaseConsultant, FirebaseConsultation } from '../types';

export const DEMO_CONSULTANTS: FirebaseConsultant[] = [
  {
    id: 'consultant_afia_01',
    name: 'Sister Afia Mensah',
    profession: 'Registered Midwife & Maternal Nurse',
    specialty: 'Antenatal counseling, birth plan preparation & natural delivery coaching',
    bio: 'Over 14 years supporting mothers across Bantama and Suntreso. Expert in respectful maternity care, traditional comfort measures, and birth preparation.',
    location: 'Bantama, Kumasi',
    consultationFee: 50,
    partnerRate: 35,
    availability: 'Mon – Sat, 08:00 – 17:00 (On-call triage for registered mothers)',
    isDemo: true,
    status: 'AVAILABLE',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'consultant_kwame_02',
    name: 'Dr. Kwame Boateng',
    profession: 'Consultant Obstetrician & Gynecologist',
    specialty: 'High-risk pregnancy guidance, ultrasound review & maternal triage',
    bio: 'Specialist physician providing maternal consultations, early complication screening, and clinical guidance for expecting mothers.',
    location: 'North Suntreso, Kumasi',
    consultationFee: 120,
    partnerRate: 90,
    availability: 'Tue, Thu, Sat • 09:00 – 15:00',
    isDemo: true,
    status: 'AVAILABLE',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'consultant_joyce_03',
    name: 'Dr. Joyce Osei-Tutu',
    profession: 'Maternal Nutritionist & Dietitian',
    specialty: 'Gestational nutrition, anemia prevention & indigenous dietary planning',
    bio: 'Dedicated to affordable maternal nutrition using local Ghanaian superfoods (kontomire, dawadawa, moringa, tigernuts) to maintain optimal iron and fetal growth.',
    location: 'Adum Central, Kumasi',
    consultationFee: 45,
    partnerRate: 30,
    availability: 'Mon – Fri • 09:00 – 16:00',
    isDemo: true,
    status: 'AVAILABLE',
    createdAt: new Date().toISOString(),
  },
];

export async function getConsultantsFromFirestore(): Promise<FirebaseConsultant[]> {
  try {
    const colRef = collection(db, 'consultants');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list: FirebaseConsultant[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as FirebaseConsultant);
      });
      return list;
    }
  } catch (err) {
    console.warn('Error reading consultants from Firestore:', err);
  }
  return DEMO_CONSULTANTS;
}

export async function requestConsultationBooking(params: {
  userId: string;
  consultantId: string;
  consultantName?: string;
  reason: string;
  requestedDate: string;
  requestedTime: string;
  fee: number;
}): Promise<{ success: boolean; consultationId?: string; error?: string }> {
  try {
    const consultationId = `cons_${Date.now()}`;
    const consRef = doc(db, 'consultations', consultationId);
    const data: FirebaseConsultation = {
      id: consultationId,
      userId: params.userId,
      consultantId: params.consultantId,
      consultantName: params.consultantName,
      reason: params.reason,
      requestedDate: params.requestedDate,
      requestedTime: params.requestedTime,
      fee: params.fee,
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
    };
    await setDoc(consRef, data);
    return { success: true, consultationId };
  } catch (err: any) {
    console.warn('Error booking consultation in Firestore:', err);
    return { success: false, error: err?.message || 'Failed to request consultation' };
  }
}
