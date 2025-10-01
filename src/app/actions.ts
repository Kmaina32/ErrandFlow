
'use server';

import {
  errandPriceRecommendation,
  type ErrandPriceRecommendationInput,
  type ErrandPriceRecommendationOutput,
} from '@/ai/flows/errand-price-recommendation';

export async function getErrandPriceRecommendation(
  input: ErrandPriceRecommendationInput
): Promise<ErrandPriceRecommendationOutput> {
  try {
    const result = await errandPriceRecommendation(input);
    return result;
  } catch (error) {
    console.error('Error in getErrandPriceRecommendation:', error);
    throw new Error('Failed to get price recommendation.');
  }
}
