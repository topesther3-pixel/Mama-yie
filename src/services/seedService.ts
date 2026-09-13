import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { DEMO_CONSULTANTS } from './consultantService';
import { DEMO_HOSPITALS } from './hospitalService';
import { INITIAL_GROUPS } from './communityService';

export const SEED_PARTNERS = [
  {
    id: 'partner_numa_organics',
    name: 'Numa Organics',
    website: 'https://numaorganics.shop',
    shopUrl: 'https://numaorganics.shop/shop',
    category: 'Natural Ghanaian skincare',
    description: 'Artisanal Ghanaian botanical skincare and organic body care handcrafted with ethically sourced unrefined shea butter, baobab seed, and calming plant oils.',
    logo: 'https://images.unsplash.com/photo-1608248597359-399066601f78?w=160&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    isDemo: true, // Prototype demo partner only
    createdAt: new Date().toISOString(),
  },
  {
    id: 'partner_affordable_perfumes_gh',
    name: 'Affordable Perfumes GH',
    website: 'https://www.affordableperfumesgh.com',
    shopUrl: 'https://www.affordableperfumesgh.com/shop',
    category: 'Fragrances & Body Care',
    description: 'Curated personal fragrances and everyday body sprays popular among Ghanaian young professionals and retail shoppers.',
    logo: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=160&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    isDemo: true, // Prototype demo partner only
    createdAt: new Date().toISOString(),
  },
  {
    id: 'partner_diya_organics',
    name: 'Diya Organics',
    website: 'https://www.shopdiyaorganics.com',
    shopUrl: 'https://www.shopdiyaorganics.com/shop',
    category: 'Organic Wellness & Haircare',
    description: 'Holistic organic oils, nutrient-dense hair butters, and gentle postpartum soothing elixirs formulated in West Africa.',
    logo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=160&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    isDemo: true, // Prototype demo partner only
    createdAt: new Date().toISOString(),
  },
];

export const SEED_PRODUCTS = [
  {
    id: 'numa_prod_01',
    partnerId: 'partner_numa_organics',
    name: 'Shea Butter Body Care Bundle',
    description: 'Pure, ultra-nourishing Northern Ghanaian unrefined shea butter whipped with calming organic lavender. Deep hydration for expanding skin.',
    price: 55,
    currency: 'GHS',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80',
    demoCommission: 5,
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'numa_prod_02',
    partnerId: 'partner_numa_organics',
    name: 'Pure Baobab & Sweet Almond Nourish Oil',
    description: 'Antioxidant-rich organic baobab seed oil to support belly elasticity, ease tight skin, and reduce stretch marks during mid-to-late pregnancy.',
    price: 75,
    currency: 'GHS',
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-399066601f78?w=500&auto=format&fit=crop&q=80',
    demoCommission: 7,
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'perfume_prod_01',
    partnerId: 'partner_affordable_perfumes_gh',
    name: 'Calm Jasmine & Vanilla Gentle Mist',
    description: 'Alcohol-free, light soothing floral mist designed for sensitive olfactory senses during pregnancy.',
    price: 65,
    currency: 'GHS',
    imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=500&auto=format&fit=crop&q=80',
    demoCommission: 6,
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'diya_prod_01',
    partnerId: 'partner_diya_organics',
    name: 'Herbal Scalp & Hair Strength Elixir',
    description: 'Fortifying moringa, neem, and castor root oil blend to safeguard hair density during hormonal postpartum transitions.',
    price: 60,
    currency: 'GHS',
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-399066601f78?w=500&auto=format&fit=crop&q=80',
    demoCommission: 6,
    active: true,
    createdAt: new Date().toISOString(),
  },
];

export async function seedDemoDataIfEmpty(): Promise<void> {
  try {
    // Seed partners
    for (const partner of SEED_PARTNERS) {
      const pRef = doc(db, 'partners', partner.id);
      const snap = await getDoc(pRef);
      if (!snap.exists()) {
        await setDoc(pRef, partner);
      }
    }

    // Seed products
    for (const prod of SEED_PRODUCTS) {
      const prodRef = doc(db, 'products', prod.id);
      const snap = await getDoc(prodRef);
      if (!snap.exists()) {
        await setDoc(prodRef, prod);
      }
    }

    // Seed consultants
    for (const consultant of DEMO_CONSULTANTS) {
      const cRef = doc(db, 'consultants', consultant.id);
      const snap = await getDoc(cRef);
      if (!snap.exists()) {
        await setDoc(cRef, consultant);
      }
    }

    // Seed hospitals
    for (const hospital of DEMO_HOSPITALS) {
      const hRef = doc(db, 'hospitals', hospital.id);
      const snap = await getDoc(hRef);
      if (!snap.exists()) {
        await setDoc(hRef, hospital);
      }
    }

    // Seed community groups
    for (const group of INITIAL_GROUPS) {
      const gRef = doc(db, 'communityGroups', group.id);
      const snap = await getDoc(gRef);
      if (!snap.exists()) {
        await setDoc(gRef, group);
      }
    }
  } catch (err) {
    console.warn('Seed demo data note (non-blocking):', err);
  }
}
