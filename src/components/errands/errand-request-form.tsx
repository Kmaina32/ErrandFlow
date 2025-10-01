"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Lightbulb, Bot } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { getErrandPriceRecommendation } from '@/app/actions';
import { type ErrandPriceRecommendationOutput } from '@/ai/flows/errand-price-recommendation';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  taskType: z.string().min(1, { message: 'Please select a task type.' }),
  pickupLocation: z
    .string()
    .min(3, { message: 'Pickup location must be at least 3 characters.' }),
  dropoffLocation: z
    .string()
    .min(3, { message: 'Drop-off location must be at least 3 characters.' }),
  notes: z.string().optional(),
  budgetEstimate: z
    .string()
    .min(1, { message: 'Please provide a budget estimate.' }),
});

type FormValues = z.infer<typeof formSchema>;

const taskTypes = [
  'Grocery shopping',
  'Picking up parcels',
  'Dropping off laundry',
  'Paying bills',
  'Queueing service',
  'Other',
];

export function ErrandRequestForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] =
    useState<ErrandPriceRecommendationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskType: '',
      pickupLocation: '',
      dropoffLocation: '',
      notes: '',
      budgetEstimate: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setRecommendation(null);
    try {
      const result = await getErrandPriceRecommendation(values);
      setRecommendation(result);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Oh no! Something went wrong.',
        description: 'There was a problem with your request. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-lg shadow-2xl shadow-primary/10">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Request an Errand
        </CardTitle>
        <CardDescription>
          Fill out the details below to get an instant price estimate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="taskType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type of errand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {taskTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="pickupLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Westlands Mall" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dropoffLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drop-off Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., My home address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Please buy 2 litres of milk and some bread.'"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budgetEstimate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Budget Estimate</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., $10 - $15" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Get Price Recommendation'
              )}
            </Button>
          </form>
        </Form>
        {recommendation && (
          <Card className="mt-6 border-accent bg-accent/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-xl">
                <Bot className="h-6 w-6 text-accent" />
                AI Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground">
                  Recommended Price
                </h3>
                <p className="text-2xl font-bold text-primary">
                  {recommendation.recommendedPriceRange}
                </p>
                <p className="text-sm text-muted-foreground">
                  Based on distance, task complexity, and current demand.
                </p>
              </div>
              <div>
                <h3 className="flex items-center gap-2 font-semibold text-foreground">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Pro Tips for a Better Price
                </h3>
                <p className="text-muted-foreground">
                  {recommendation.intelligentPrompts}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
