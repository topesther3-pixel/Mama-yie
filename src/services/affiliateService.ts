import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  increment,
  query,
  where
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { FirebaseAffiliateLink } from '../types';

export async function getUserAffiliateLinks(userId: string): Promise<FirebaseAffiliateLink[]> {
  try {
    const colRef = collection(db, 'users', userId, 'affiliateLinks');
    const snap = await getDocs(colRef);
    const links: FirebaseAffiliateLink[] = [];
    snap.forEach((d) => {
      links.push({ id: d.id, ...d.data() } as FirebaseAffiliateLink);
    });
    return links;
  } catch (err) {
    console.warn('Error reading affiliate links:', err);
    return [];
  }
}

export async function generateAffiliateLink(params: {
  userId: string;
  productId: string;
  partnerId: string;
  customPrefix?: string;
}): Promise<{ success: boolean; link?: FirebaseAffiliateLink; error?: string }> {
  try {
    // Generate unique code format e.g. MAMA12345 or AKOSUA-NUMA
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const referralCode = params.customPrefix
      ? `${params.customPrefix.toUpperCase()}-${randomSuffix}`
      : `MAMA${randomSuffix}`;

    const linkId = `link_${params.productId}_${params.userId.slice(-6)}`;
    const linkRef = doc(db, 'users', params.userId, 'affiliateLinks', linkId);

    const linkData: FirebaseAffiliateLink = {
      id: linkId,
      productId: params.productId,
      partnerId: params.partnerId,
      userId: params.userId,
      referralCode,
      url: `mamayie.com/ref/${referralCode}`,
      clickCount: 0,
      conversionCount: 0,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    await setDoc(linkRef, linkData);
    return { success: true, link: linkData };
  } catch (err: any) {
    console.warn('Error generating affiliate link:', err);
    return { success: false, error: err?.message || 'Failed to create referral link' };
  }
}

export async function recordAffiliateClick(userId: string, linkId: string): Promise<void> {
  try {
    const linkRef = doc(db, 'users', userId, 'affiliateLinks', linkId);
    await updateDoc(linkRef, {
      clickCount: increment(1),
    });
  } catch (err) {
    console.warn('Error recording affiliate click:', err);
  }
}
