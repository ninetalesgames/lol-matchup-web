import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBbnWiHNOj9SviLds8GaU0VaXZ5ZtzMwzs',
  authDomain: 'lol-matchup-master.firebaseapp.com',
  projectId: 'lol-matchup-master',
  storageBucket: 'lol-matchup-master.appspot.com',
  messagingSenderId: '252989715190',
  appId: '1:252989715190:web:dde5bb4cf494500290b2d7',
  measurementId: 'G-VGN7NRSTGB',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
