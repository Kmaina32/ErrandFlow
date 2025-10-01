'use server';

import {
  errandPriceRecommendation,
  type ErrandPriceRecommendationInput,
  type ErrandPriceRecommendationOutput,
} from '@/ai/flows/errand-price-recommendation';
import { supabase } from '@/lib/supabase';

export type ErrandRequest = ErrandPriceRecommendationInput & {
  status: 'pending';
};

export async function submitErrandRequest(
  input: ErrandPriceRecommendationInput
): Promise<ErrandPriceRecommendationOutput> {

  try {
    // 1. Get AI price recommendation
    const recommendation = await errandPriceRecommendation(input);

    // 2. Save the request to Supabase
    const requestData: ErrandRequest = {
      ...input,
      status: 'pending',
    };
    
    const { error } = await supabase.from('requests').insert([requestData]);

    if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Failed to save errand request to the database. ${error.message}`);
    }


    // 3. Return the AI recommendation to the user
    return recommendation;
  } catch (error) {
    console.error('Error in submitErrandRequest:', error);
    
    if (error instanceof Error) {
        throw error;
    }

    throw new Error('Failed to submit errand request.');
  }
}
