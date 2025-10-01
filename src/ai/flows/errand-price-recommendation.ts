'use server';

/**
 * @fileOverview An Errand Price Recommendation AI agent.
 *
 * - errandPriceRecommendation - A function that handles the errand price recommendation process.
 * - ErrandPriceRecommendationInput - The input type for the errandPriceRecommendation function.
 * - ErrandPriceRecommendationOutput - The return type for the errandPriceRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ErrandPriceRecommendationInputSchema = z.object({
  taskType: z.string().describe('The type of task to be performed (e.g., grocery shopping, parcel pickup).'),
  pickupLocation: z.string().describe('The pickup location for the errand, as "latitude, longitude" or a place name within Kenya.'),
  dropoffLocation: z.string().describe('The drop-off location for the errand, as "latitude, longitude" or a place name within Kenya.'),
  notes: z.string().describe('Additional notes or details about the errand.'),
  budgetEstimate: z.string().describe('The customer\'s initial budget estimate for the errand in Kenyan Shillings (Ksh).'),
});
export type ErrandPriceRecommendationInput = z.infer<typeof ErrandPriceRecommendationInputSchema>;

const ErrandPriceRecommendationOutputSchema = z.object({
  recommendedPriceRange: z.string().describe('The recommended price range for the errand in Kenyan Shillings (Ksh) based on real-time data analysis.'),
  intelligentPrompts: z.string().describe('Intelligent prompts to help the customer get the best price.'),
});
export type ErrandPriceRecommendationOutput = z.infer<typeof ErrandPriceRecommendationOutputSchema>;

export async function errandPriceRecommendation(input: ErrandPriceRecommendationInput): Promise<ErrandPriceRecommendationOutput> {
  return errandPriceRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'errandPriceRecommendationPrompt',
  input: {schema: ErrandPriceRecommendationInputSchema},
  output: {schema: ErrandPriceRecommendationOutputSchema},
  prompt: `You are an expert in providing price recommendations for errands in Kenya. Analyze the provided details and provide a recommended price range in Kenyan Shillings (Ksh), and some intelligent prompts to get the best price.

Task Type: {{{taskType}}}
Pickup Location: {{{pickupLocation}}}
Drop-off Location: {{{dropoffLocation}}}
Notes: {{{notes}}}
Budget Estimate: {{{budgetEstimate}}}

Consider factors such as distance (if coordinates are provided), time, traffic, effort, and any special requirements within the Kenyan context to provide an accurate and competitive price range. Also, generate helpful prompts for the customer to get an even better price. Return the price range as a string (e.g., "Ksh 500 - Ksh 700"), and the prompts as a string.`, 
});

const errandPriceRecommendationFlow = ai.defineFlow(
  {
    name: 'errandPriceRecommendationFlow',
    inputSchema: ErrandPriceRecommendationInputSchema,
    outputSchema: ErrandPriceRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
