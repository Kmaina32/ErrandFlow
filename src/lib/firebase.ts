import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from './firebase-config';

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
}

export { app };
