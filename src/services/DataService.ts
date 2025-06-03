import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';

const LOCAL_KEY = 'matchupNotes';

export async function loadNotes(user: User | null): Promise<Record<string, any>> {
  if (user) {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().notes || {};
    } else {
      return {};
    }
  } else {
    const saved = localStorage.getItem(LOCAL_KEY);
    return saved ? JSON.parse(saved) : {};
  }
}

export async function saveNotes(user: User | null, notes: Record<string, any>): Promise<void> {
  if (user) {
    const docRef = doc(db, 'users', user.uid);
    await setDoc(docRef, { notes });
  } else {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(notes));
  }
}

export async function syncLocalAndCloud(user: User): Promise<Record<string, any>> {
  const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}');
  const docRef = doc(db, 'users', user.uid);
  const docSnap = await getDoc(docRef);
  const cloud = docSnap.exists() ? docSnap.data().notes || {} : {};

  const merged: Record<string, any> = {};

  const allKeys = new Set([...Object.keys(local), ...Object.keys(cloud)]);
  allKeys.forEach((key) => {
    const localNote = local[key];
    const cloudNote = cloud[key];

    if (!localNote) {
      merged[key] = cloudNote;
    } else if (!cloudNote) {
      merged[key] = localNote;
    } else {
      // Compare timestamps
      merged[key] =
        localNote.lastUpdated > cloudNote.lastUpdated ? localNote : cloudNote;
    }
  });

  await setDoc(docRef, { notes: merged });
  localStorage.setItem(LOCAL_KEY, JSON.stringify(merged));

  return merged;
}
