import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FirebaseHospital } from '../types';

export const DEMO_HOSPITALS: FirebaseHospital[] = [
  {
    id: 'hosp_suntreso_01',
    name: 'Suntreso Maternal Care Wing & Polyclinic',
    location: 'North Suntreso, Kumasi, Ashanti Region',
    services: [
      'Antenatal Booking & Labs',
      '24/7 Labor & Delivery Ward',
      'Obstetric Ultrasound Unit',
      'Neonatal Observation Room',
      'Postnatal Support & Immunization',
    ],
    description: 'Accredited polyclinic with a dedicated maternal care wing serving expecting mothers across Kumasi West and Suntreso.',
    partnerBenefit: 'Mama Yie Partner: Negotiated rates for birth kits and obstetric scans using Motherhood Fund vouchers.',
    contact: '+233 32 202 4412',
    isDemo: true,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'hosp_afia_02',
    name: 'Sister Afia Midwifery & Maternal Home',
    location: 'Bantama High Street, Kumasi',
    services: [
      'One-on-One Midwife Consultations',
      'Natural Birth Coaching',
      'Birth Kit Preparation',
      'Fetal Heart Rate Doppler Monitoring',
      'Postpartum Home Visit Scheduling',
    ],
    description: 'Community-rooted midwifery facility specializing in respectful, compassionate maternal care and birth readiness counseling.',
    partnerBenefit: 'Mama Yie Partner: Accepts Motherhood Fund vouchers for midwife consultations and birth kits with 0 out-of-pocket cash.',
    contact: '+233 24 411 9820',
    isDemo: true,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'hosp_adum_03',
    name: 'Adum Diagnostic & Maternal Ultrasound Center',
    location: 'Adum Central (Opposite Market Post Office), Kumasi',
    services: [
      '2D/3D Obstetric Ultrasound',
      'Fetal Anatomy & Gender Scans',
      'Antenatal Blood & Urine Chemistry Labs',
      'Anemia & Iron Level Testing',
    ],
    description: 'Specialist maternal imaging clinic providing high-resolution fetal scans and diagnostic bloodwork for expectant mothers.',
    partnerBenefit: 'Mama Yie Partner: 20% negotiated concession on all obstetric scans when paid via Mama Yie vouchers.',
    contact: '+233 20 819 0233',
    isDemo: true,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
];

export async function getHospitalsFromFirestore(): Promise<FirebaseHospital[]> {
  try {
    const colRef = collection(db, 'hospitals');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list: FirebaseHospital[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as FirebaseHospital);
      });
      return list;
    }
  } catch (err) {
    console.warn('Error fetching hospitals from Firestore:', err);
  }
  return DEMO_HOSPITALS;
}
