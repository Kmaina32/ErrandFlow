
'use server';

import {
  errandPriceRecommendation,
  type ErrandPriceRecommendationInput,
  type ErrandPriceRecommendationOutput,
} from '@/ai/flows/errand-price-recommendation';
import { db } from '@/lib/firebase';
import { firebaseConfig } from '@/lib/firebase-config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type ErrandRequest = ErrandPriceRecommendationInput & {
  status: 'pending';
  createdAt: any;
};

export async function submitErrandRequest(
  input: ErrandPriceRecommendationInput
): Promise<ErrandPriceRecommendationOutput> {
  // Check if Firebase config is set up
  if (!firebaseConfig.projectId || firebaseConfig.projectId === 'your-project-id') {
      throw new Error('Firebase project is not configured. Please add your Firebase configuration to src/lib/firebase-config.ts.');
  }

  try {
    // 1. Get AI price recommendation
    const recommendation = await errandPriceRecommendation(input);

    // 2. Save the request to Firestore
    const requestData: ErrandRequest = {
      ...input,
      status: 'pending',
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, 'requests'), requestData);

    // 3. Return the AI recommendation to the user
    return recommendation;
  } catch (error) {
    console.error('Error in submitErrandRequest:', error);
    // Check if the error is a Firestore error and provide a more specific message
    if (error instanceof Error && 'code' in error) {
         // @ts-ignore
        if(error.code === 'permission-denied') {
            throw new Error('Firestore Security Rules are not set up correctly. Please check your rules in the Firebase Console.');
        }
    }
    // Re-throw specific known errors or a generic one
    if (error instanceof Error) {
        throw error;
    }

    throw new Error('Failed to submit errand request.');
  }
}
