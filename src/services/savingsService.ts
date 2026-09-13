import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { FirebaseSavingsProfile, SavingsTransaction, FirebaseWithdrawal } from '../types';

export async function getSavingsProfile(userId: string): Promise<FirebaseSavingsProfile | null> {
  try {
    const savingsDocRef = doc(db, 'users', userId, 'savings', 'profile');
    const snap = await getDoc(savingsDocRef);
    if (snap.exists()) {
      return snap.data() as FirebaseSavingsProfile;
    }
    return null;
  } catch (error) {
    console.warn('Error fetching savings profile from Firestore:', error);
    return null;
  }
}

export async function initSavingsProfile(
  userId: string,
  initialBalance = 120,
  goalAmount = 600
): Promise<FirebaseSavingsProfile | null> {
  try {
    const savingsDocRef = doc(db, 'users', userId, 'savings', 'profile');
    const existing = await getDoc(savingsDocRef);
    if (existing.exists()) {
      return existing.data() as FirebaseSavingsProfile;
    }

    const newProfile: FirebaseSavingsProfile = {
      goalAmount,
      currentBalance: initialBalance,
      availableBalance: initialBalance,
      pendingBalance: 0,
      currency: 'GHS',
      updatedAt: new Date().toISOString(),
    };

    await setDoc(savingsDocRef, newProfile);
    return newProfile;
  } catch (error) {
    console.warn('Error initializing savings profile:', error);
    return null;
  }
}

export async function getUserTransactions(userId: string): Promise<SavingsTransaction[]> {
  try {
    const txColRef = collection(db, 'users', userId, 'transactions');
    const q = query(txColRef, orderBy('createdAt', 'desc'), limit(50));
    const snap = await getDocs(q);
    const results: SavingsTransaction[] = [];
    snap.forEach((d) => {
      results.push({ id: d.id, ...d.data() } as SavingsTransaction);
    });
    return results;
  } catch (error) {
    console.warn('Error reading transactions from Firestore:', error);
    return [];
  }
}

// Trusted backend commission execution with server-side validation and idempotency
export async function claimDemoCommissionViaBackend(params: {
  userId: string;
  partnerId: string;
  productId: string;
  customerName?: string;
  partnerName?: string;
  idempotencyKey: string;
}): Promise<{
  success: boolean;
  newBalance?: number;
  commission?: number;
  transactionId?: string;
  alreadyProcessed?: boolean;
  error?: string;
}> {
  try {
    const response = await fetch('/api/savings/demo-commission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errJson.error || `Server returned ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      newBalance: data.newBalance,
      commission: data.commission,
      transactionId: data.transactionId,
      alreadyProcessed: data.alreadyProcessed,
    };
  } catch (err: any) {
    console.warn('Failed to claim demo commission via backend:', err);
    return {
      success: false,
      error: err?.message || 'Network error claiming commission',
    };
  }
}

// User requests withdrawal - stored with status 'DEMO_REQUESTED'
export async function requestWithdrawal(params: {
  userId: string;
  amount: number;
  method: 'MOBILE_MONEY' | 'BANK';
  phoneNumber?: string;
  momoNetwork?: 'MTN' | 'Telecel' | 'AT';
}): Promise<{ success: boolean; withdrawalId?: string; error?: string }> {
  try {
    const withdrawalId = `wd_${Date.now()}`;
    const wdRef = doc(db, 'users', params.userId, 'withdrawals', withdrawalId);
    const withdrawalData: FirebaseWithdrawal = {
      id: withdrawalId,
      amount: params.amount,
      method: params.method,
      phoneNumber: params.phoneNumber,
      momoNetwork: params.momoNetwork,
      status: 'DEMO_REQUESTED',
      createdAt: new Date().toISOString(),
    };
    await setDoc(wdRef, withdrawalData);
    return { success: true, withdrawalId };
  } catch (err: any) {
    console.warn('Error recording withdrawal in Firestore:', err);
    return { success: false, error: err?.message || 'Failed to submit withdrawal request' };
  }
}
