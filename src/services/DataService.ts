import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';

const db = getFirestore();

export async function loadNotes(user: User | null): Promise<Record<string, any>> {
  if (!user) {
    const local = localStorage.getItem('matchup_notes');
    return local ? JSON.parse(local) : {};
  }

  const docRef = doc(db, 'notes', user.uid);
  const snap = await getDoc(docRef);

  return snap.exists() ? (snap.data() as Record<string, any>) : {};
}

export async function saveNotes(user: User | null, notes: Record<string, any>) {
  if (!user) {
    localStorage.setItem('matchup_notes', JSON.stringify(notes));
  } else {
    const docRef = doc(db, 'notes', user.uid);
    await setDoc(docRef, notes);
  }
}

export async function syncLocalAndCloud(user: User) {
  const cloud = await loadNotes(user);

  // ✅ Always replace localStorage with fresh cloud data
  localStorage.setItem('matchup_notes', JSON.stringify(cloud));

  // ✅ Re-save to ensure structure is normalized (optional)
  await saveNotes(user, cloud);
}
