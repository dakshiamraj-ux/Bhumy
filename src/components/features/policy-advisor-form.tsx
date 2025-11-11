'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { simulatePolicyImpact, PolicyImpactOutput } from '@/ai/flows/local-policy-advisor-simulates-impact';
import { Lightbulb, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  location: z.string().min(2, 'Location must be at least 2 characters.'),
  policyScenario: z.string().min(10, 'Scenario description must be at least 10 characters.'),
  environmentalMetrics: z.string().min(3, 'Please list at least one metric.'),
});

type FormValues = z.infer<typeof formSchema>;

export function PolicyAdvisorForm() {
  const [simulationResult, setSimulationResult] = useState<PolicyImpactOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
      policyScenario: '',
      environmentalMetrics: 'Greenhouse gas emissions, landfill waste, recycling rates',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setSimulationResult(null);

    try {
      const result = await simulatePolicyImpact({
        ...values,
        environmentalMetrics: values.environmentalMetrics.split(',').map(m => m.trim()),
      });
      setSimulationResult(result);
    } catch (error) {
      console.error('Error simulating policy impact:', error);
      toast({
        variant: 'destructive',
        title: 'Simulation Failed',
        description: 'There was an error while running the simulation. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Simulate Policy Impact</CardTitle>
          <CardDescription>
            Use our AI-driven model to forecast the environmental effects of new policies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Sunnyvale, California" {...field} />
                    </FormControl>
                    <FormDescription>The city, county, or region for the simulation.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="policyScenario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Scenario</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the policy, e.g., 'Implement a city-wide ban on single-use plastic bags and provide reusable bags at a subsidized cost.'"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Be as descriptive as possible for an accurate simulation.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="environmentalMetrics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Environmental Metrics</FormLabel>
                    <FormControl>
                      <Input placeholder="List metrics separated by commas" {...field} />
                    </FormControl>
                    <FormDescription>The key metrics to measure the impact on.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Simulating...' : 'Run Simulation'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center text-muted-foreground min-h-[200px]">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="font-semibold">Running environmental simulation...</p>
                <p className="text-sm">This may take a moment.</p>
            </CardContent>
        </Card>
      )}

      {simulationResult && (
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="text-primary" />
              Simulation Results
            </CardTitle>
            <CardDescription>The projected impact of your policy scenario.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p>{simulationResult.simulatedImpact}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
