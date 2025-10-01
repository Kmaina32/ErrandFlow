"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Lightbulb, Bot, LocateFixed, Map, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

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
import { submitErrandRequest } from '@/app/actions';
import { type ErrandPriceRecommendationOutput } from '@/ai/flows/errand-price-recommendation';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const formSchema = z.object({
  dispatcherName: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' }),
  dispatcherPhone: z
    .string()
    .min(10, { message: 'Please enter a valid phone number.' }),
  deliveryType: z.enum(['open', 'verified'], {
    required_error: 'You need to select a delivery type.',
  }),
  taskType: z.string().min(1, { message: 'Please select a task type.' }),
  pickupLocation: z
    .string()
    .min(3, { message: 'Pickup location must be at least 3 characters.' }),
  dropoffLocation: z
    .string()
    .min(3, { message: 'Drop-off location must be at least 3 characters.' }),
  notes: z.string().optional(),
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

const steps = [
    { id: 'Step 1', name: 'Personal Details', fields: ['dispatcherName', 'dispatcherPhone'] },
    { id: 'Step 2', name: 'Errand Details', fields: ['deliveryType', 'taskType', 'notes'] },
    { id: 'Step 3', name: 'Locations', fields: ['pickupLocation', 'dropoffLocation'] },
];

export function ErrandRequestForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [recommendation, setRecommendation] =
    useState<ErrandPriceRecommendationOutput | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dispatcherName: '',
      dispatcherPhone: '',
      deliveryType: 'open',
      taskType: '',
      pickupLocation: '',
      dropoffLocation: '',
      notes: '',
    },
  });

  async function processForm(values: FormValues) {
    setIsLoading(true);
    setRecommendation(null);
    try {
      const result = await submitErrandRequest(values);
      setRecommendation(result);
       toast({
        title: 'Price Recommended!',
        description: "Here is your price estimate. Your request has also been submitted.",
      });
    } catch (error) {
       const errorMessage = error instanceof Error ? error.message : 'There was a problem with your request. Please try again.';
      toast({
        variant: 'destructive',
        title: 'Oh no! Something went wrong.',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  type FieldName = keyof FormValues;

  const next = async () => {
    const fields = steps[currentStep].fields as FieldName[];
    const output = await form.trigger(fields, { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
        if (currentStep < steps.length -1) {
            setCurrentStep(step => step + 1);
        }
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1);
    }
  };


  const handleGetCurrentLocation = (field: 'pickupLocation' | 'dropoffLocation') => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          form.setValue(field, `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location", error);
          toast({
            variant: 'destructive',
            title: 'Location Error',
            description: 'Could not get your location. Please enter it manually.',
          });
          setIsLocating(false);
        }
      );
    } else {
      toast({
        variant: 'destructive',
        title: 'Location Error',
        description: 'Geolocation is not supported by your browser.',
      });
      setIsLocating(false);
    }
  };


  return (
    <ScrollArea className="h-full w-full">
        <div className="p-1">
            <Card className="w-full max-w-lg bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">
                Where to?
                </CardTitle>
                <CardDescription>
                Post an errand and let's get it done.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <Progress value={((currentStep + 1) / steps.length) * 100} className="w-full h-2" />
                    
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(processForm)} className="space-y-6">
                        {currentStep === 0 && (
                             <div className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="dispatcherName"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Your Name</FormLabel>
                                        <FormControl>
                                        <Input placeholder="e.g., Juma" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dispatcherPhone"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Your Phone</FormLabel>
                                        <FormControl>
                                        <Input placeholder="e.g., 0712345678" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                        )}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                               <FormField
                                    control={form.control}
                                    name="deliveryType"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                        <FormLabel>Delivery Type</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                            >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                <RadioGroupItem value="open" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                Open Delivery
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                <RadioGroupItem value="verified" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                Verified Shops Delivery
                                                </FormLabel>
                                            </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
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
                                <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Notes (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                        placeholder="e.g., 'Tafadhali, nunua maziwa lita mbili na mkate.'"
                                        className="resize-none"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>
                        )}
                        {currentStep === 2 && (
                             <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="pickupLocation"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pickup Location</FormLabel>
                                        <div className="relative">
                                        <FormControl>
                                            <Input placeholder="e.g., Nairobi CBD" {...field} />
                                        </FormControl>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                            onClick={() => handleGetCurrentLocation('pickupLocation')}
                                            disabled={isLocating}
                                        >
                                            <LocateFixed className="h-5 w-5 text-muted-foreground" />
                                        </Button>
                                        </div>
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
                                        <div className="relative">
                                        <FormControl>
                                            <Input placeholder="e.g., Westlands" {...field} />
                                        </FormControl>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                            onClick={() => handleGetCurrentLocation('dropoffLocation')}
                                            disabled={isLocating}
                                        >
                                            <LocateFixed className="h-5 w-5 text-muted-foreground" />
                                        </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                        )}
                        
                    </form>
                    </Form>
                     {/* Navigation */}
                    <div className="mt-8 pt-5">
                        <div className="flex justify-between">
                            <Button
                            type="button"
                            onClick={prev}
                            disabled={currentStep === 0}
                            variant="outline"
                            >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                            </Button>
                            
                            {currentStep < steps.length - 1 && (
                                <Button onClick={next}>
                                    Next
                                </Button>
                            )}
                            
                            {currentStep === steps.length - 1 && (
                                <Button
                                    type="submit"
                                    className="w-fit"
                                    disabled={isLoading || isLocating}
                                    onClick={form.handleSubmit(processForm)}
                                >
                                {isLoading ? (
                                    <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Finding best price...
                                    </>
                                ) : isLocating ? (
                                    <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Getting Location...
                                    </>
                                ): (
                                    'Get Price Estimate'
                                )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

               
                {recommendation && (
                <Card className="mt-6 border-primary/20 bg-primary/5">
                    <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-xl">
                        <Bot className="h-6 w-6 text-primary" />
                        AI Recommendation
                    </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    {recommendation.mapUrl && (
                        <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-lg border">
                            <Image
                            src={recommendation.mapUrl}
                            alt="Route map"
                            fill
                            className="object-cover"
                            />
                        </div>
                        )}
                    <div>
                        <h3 className="font-semibold text-foreground">
                        Recommended Price
                        </h3>
                        <p className="text-3xl font-bold text-primary">
                        {recommendation.recommendedPriceRange}
                        </p>
                        <p className="text-sm text-muted-foreground">
                        Based on distance, task complexity, and current demand.
                        </p>
                    </div>
                    <div>
                        <h3 className="flex items-center gap-2 font-semibold text-foreground">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        Pro Tips
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
        </div>
    </ScrollArea>
  );
}
