import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Partner, PartnerProduct } from '../types';
import { INITIAL_PARTNERS } from '../data/initialData';

export async function getPartnersFromFirestore(): Promise<Partner[]> {
  try {
    const colRef = collection(db, 'partners');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const partnersList: Partner[] = [];
      for (const d of snapshot.docs) {
        const partnerData = d.data();
        // Load products for this partner from products collection or embedded list
        const productsRef = collection(db, 'products');
        const prodSnap = await getDocs(productsRef);
        const partnerProducts: PartnerProduct[] = [];
        prodSnap.forEach((pDoc) => {
          const pData = pDoc.data();
          if (pData.partnerId === d.id) {
            partnerProducts.push({
              id: pDoc.id,
              partnerId: pData.partnerId,
              name: pData.name,
              image: pData.imageUrl || pData.image || '',
              description: pData.description,
              retailPrice: pData.price || pData.retailPrice,
              price: pData.price || pData.retailPrice,
              demoCommission: pData.demoCommission,
              productUrl: pData.productUrl || partnerData.shopUrl || partnerData.website,
              category: pData.category || 'wellness',
              active: pData.active !== false,
              status: 'ACTIVE',
            });
          }
        });

        partnersList.push({
          id: d.id,
          name: partnerData.name,
          website: partnerData.website,
          category: partnerData.category,
          logo: partnerData.logo,
          description: partnerData.description,
          verificationStatus: partnerData.isDemo ? 'VERIFIED' : 'PENDING',
          isPotentialPartner: true,
          demoPartner: partnerData.isDemo,
          active: true,
          products: partnerProducts.length > 0 ? partnerProducts : (partnerData.products || []),
        });
      }

      if (partnersList.length > 0) {
        return partnersList;
      }
    }
  } catch (err) {
    console.warn('Error reading partners from Firestore, using initial dataset:', err);
  }

  // Graceful fallback to initial dataset
  return INITIAL_PARTNERS;
}

export async function savePartnerToFirestore(partner: Partner): Promise<boolean> {
  try {
    const docRef = doc(db, 'partners', partner.id);
    await setDoc(docRef, {
      name: partner.name,
      website: partner.website,
      category: partner.category || 'wellness',
      description: partner.description,
      logo: partner.logo || '',
      isDemo: partner.demoPartner || false,
      updatedAt: new Date().toISOString(),
    });

    if (partner.products && partner.products.length > 0) {
      for (const prod of partner.products) {
        const prodRef = doc(db, 'products', prod.id);
        await setDoc(prodRef, {
          partnerId: partner.id,
          name: prod.name,
          price: prod.retailPrice || prod.price || 0,
          demoCommission: prod.demoCommission || 5,
          category: prod.category || 'wellness',
          productUrl: prod.productUrl || partner.website,
          imageUrl: prod.image || '',
          active: true,
        });
      }
    }
    return true;
  } catch (err) {
    console.warn('Error saving partner to Firestore:', err);
    return false;
  }
}

