import { getDoc, doc, setDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import type { User } from 'firebase/auth';

export async function loadNotes(user: User | null): Promise<Record<string, any>> {
  const localRaw = localStorage.getItem('matchup_notes');
  const localNotes = localRaw ? JSON.parse(localRaw) : {};

  if (user) {
    const db = getFirestore();
    const userDoc = doc(db, 'users', user.uid);
    const snap = await getDoc(userDoc);
    const cloudData = snap.exists() ? snap.data() : null;

    const cloudNotes = cloudData?.notes || {};
    const isCloudEmpty = Object.keys(cloudNotes).length === 0;

    // ✅ Only sync local to cloud if cloud is empty and local has notes
    if (isCloudEmpty && Object.keys(localNotes).length > 0) {
      await saveNotes(user, localNotes);
      return localNotes;
    }

    return cloudNotes;
  }

  return localNotes;
}

export async function saveNotes(user: User | null, notes: Record<string, any>) {
  if (user) {
    const db = getFirestore();
    const userDoc = doc(db, 'users', user.uid);
    await setDoc(userDoc, { notes }, { merge: true });
  } else {
    localStorage.setItem('matchup_notes', JSON.stringify(notes));
  }
}
