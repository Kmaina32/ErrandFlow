import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config';

// Check if the config is valid before initializing
if (!firebaseConfig || !firebaseConfig.projectId || firebaseConfig.projectId === 'your-project-id') {
  throw new Error(
    'Firebase project is not configured. Please add your Firebase configuration to src/lib/firebase-config.ts. You can get this from your project settings in the Firebase console.'
  );
}

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);

export { app, db };
