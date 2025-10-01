
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config';

let app: FirebaseApp;
let db: Firestore | null = null;

// Check if the config is valid before initializing
if (firebaseConfig && firebaseConfig.projectId && firebaseConfig.projectId !== 'your-project-id') {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  db = getFirestore(app);
} else {
    console.log('Firebase project is not configured. Please add your Firebase configuration to src/lib/firebase-config.ts. App will run without database functionality.');
}


export { app, db };
