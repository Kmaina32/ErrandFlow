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
import qs from 'qs';

const ErrandPriceRecommendationInputSchema = z.object({
  taskType: z.string().describe('The type of task to be performed (e.g., grocery shopping, parcel pickup).'),
  pickupLocation: z.string().describe('The pickup location for the errand, as "latitude, longitude" or a place name within Kenya.'),
  dropoffLocation: z.string().describe('The drop-off location for the errand, as "latitude, longitude" or a place name within Kenya.'),
  notes: z.string().describe('Additional notes or details about the errand.'),
  dispatcherName: z.string().describe('The name of the person dispatching the errand.'),
  dispatcherPhone: z.string().describe('The phone number of the person dispatching the errand.'),
});
export type ErrandPriceRecommendationInput = z.infer<typeof ErrandPriceRecommendationInputSchema>;

const ErrandPriceRecommendationOutputSchema = z.object({
  recommendedPriceRange: z.string().describe('The recommended price range for the errand in Kenyan Shillings (Ksh) based on real-time data analysis.'),
  intelligentPrompts: z.string().describe('Intelligent prompts to help the customer get the best price.'),
  mapUrl: z.string().url().describe('A Google Maps URL showing the route from pickup to dropoff.'),
});
export type ErrandPriceRecommendationOutput = z.infer<typeof ErrandPriceRecommendationOutputSchema>;

export async function errandPriceRecommendation(input: ErrandPriceRecommendationInput): Promise<ErrandPriceRecommendationOutput> {
  return errandPriceRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'errandPriceRecommendationPrompt',
  input: {schema: ErrandPriceRecommendationInputSchema},
  output: {schema: ErrandPriceRecommendationOutputSchema.omit({ mapUrl: true })},
  prompt: `You are an expert in providing price recommendations for errands in Kenya. Analyze the provided details and provide a recommended price range in Kenyan Shillings (Ksh), and some intelligent prompts to get the best price.

Task Type: {{{taskType}}}
Pickup Location: {{{pickupLocation}}}
Drop-off Location: {{{dropoffLocation}}}
Notes: {{{notes}}}
Dispatcher Name: {{{dispatcherName}}}
Dispatcher Phone: {{{dispatcherPhone}}}

Base your recommendation on factors such as distance (especially if coordinates are provided), time of day, typical traffic conditions in Kenya, and the effort required for the task. Do not consider any budget from the user. Your goal is to provide a fair, data-driven market rate. Also, generate helpful prompts for the customer to get an even better price. Return the price range as a string (e.g., "Ksh 500 - Ksh 700"), and the prompts as a string.`,
});

const errandPriceRecommendationFlow = ai.defineFlow(
  {
    name: 'errandPriceRecommendationFlow',
    inputSchema: ErrandPriceRecommendationInputSchema,
    outputSchema: ErrandPriceRecommendationOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Could not generate a price recommendation.');
    }
    
    const mapParams = qs.stringify({
        center: input.pickupLocation,
        zoom: 12,
        size: '600x300',
        maptype: 'roadmap',
        markers: [
            `color:blue|label:A|${input.pickupLocation}`,
            `color:green|label:B|${input.dropoffLocation}`,
        ],
        path: `color:0x0000ff|weight:5|${input.pickupLocation}|${input.dropoffLocation}`,
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    });
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?${mapParams}`;

    return {
      ...output,
      mapUrl,
    };
  }
);
