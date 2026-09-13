import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FirebaseUserProfile } from '../types';

export async function getUserProfile(userId: string): Promise<FirebaseUserProfile | null> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data() as FirebaseUserProfile;
    }
    return null;
  } catch (error) {
    console.warn('Error fetching user profile from Firestore:', error);
    return null;
  }
}

export async function saveUserProfile(profile: FirebaseUserProfile): Promise<boolean> {
  try {
    const userDocRef = doc(db, 'users', profile.uid);
    const now = new Date().toISOString();
    await setDoc(userDocRef, {
      ...profile,
      updatedAt: now,
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('Error saving user profile to Firestore:', error);
    return false;
  }
}

export async function updateUserProfileDoc(userId: string, updates: Partial<FirebaseUserProfile>): Promise<boolean> {
  try {
    const userDocRef = doc(db, 'users', userId);
    const now = new Date().toISOString();
    await updateDoc(userDocRef, {
      ...updates,
      updatedAt: now,
    });
    return true;
  } catch (error) {
    console.warn('Error updating user profile in Firestore:', error);
    return false;
  }
}
