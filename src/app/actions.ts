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
        // Check for permission errors, which often point to RLS issues.
        if (error.code === '42501') { // permission_denied in Postgres
             console.error('Supabase permission error:', error);
             throw new Error(
                'Permission denied. Please check your Supabase Row Level Security (RLS) policies for the "requests" table.'
            );
        }
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
