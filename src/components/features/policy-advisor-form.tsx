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
import {
  simulatePolicyImpact,
  PolicyImpactOutput,
} from '@/ai/flows/local-policy-advisor-simulates-impact';
import {
  Lightbulb,
  Loader2,
  ChevronUp,
  ChevronDown,
  Scale,
  ClipboardList,
  Milestone,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

const formSchema = z.object({
  location: z.string().min(2, 'Location must be at least 2 characters.'),
  policyDescription: z.string().min(10, 'Scenario description must be at least 10 characters.'),
});

type FormValues = z.infer<typeof formSchema>;

export function PolicyAdvisorForm() {
  const [simulationResult, setSimulationResult] = useState<PolicyImpactOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: 'Noida, India',
      policyDescription: 'Implement a city-wide ban on single-use plastic bags and subsidize reusable bags.',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setSimulationResult(null);

    try {
      const result = await simulatePolicyImpact(values);
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
          <CardTitle>AI Policy Advisor</CardTitle>
          <CardDescription>
            Simulate the impact of waste management policies and get AI-driven recommendations.
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
                    <FormLabel>City / Region</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Noida, India" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="policyDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Idea</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the policy, e.g., 'Ban single-use plastics and provide reusable bags...'"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Be as descriptive as possible for an accurate simulation.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Simulating...' : 'Generate Action Plan'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center text-muted-foreground min-h-[300px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="font-semibold text-lg">Running Environmental Simulation...</p>
            <p className="text-sm">Our AI is analyzing the potential impacts. This may take a moment.</p>
          </CardContent>
        </Card>
      )}

      {simulationResult && (
        <div className="space-y-6">
            {/* Environmental Impact Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Scale/>Environmental Impact</CardTitle>
                </CardHeader>
                <CardContent className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                    {simulationResult.environmentalImpact.map((item, index) => (
                        <div key={index} className='flex items-center gap-4 rounded-lg border p-4'>
                             {item.impact === 'positive' ? (
                                <ChevronUp className='h-8 w-8 text-green-500 bg-green-500/10 p-1 rounded-full'/>
                             ) : (
                                <ChevronDown className='h-8 w-8 text-red-500 bg-red-500/10 p-1 rounded-full'/>
                             )}
                            <div>
                                <p className='text-sm text-muted-foreground'>{item.metric}</p>
                                <p className='font-bold text-lg'>{item.value}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Action Plan Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ClipboardList />Implementation Action Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {simulationResult.actionPlan.map((step, index) => (
                        <div key={index}>
                            <div className="flex items-start gap-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">{step.step}</div>
                                <div className="flex-1">
                                    <p className="font-semibold">{step.title}</p>
                                    <p className="text-sm text-muted-foreground">{step.description}</p>
                                    <div className='flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs'>
                                        <Badge variant='secondary'>Timeline: {step.timeline}</Badge>
                                        <Badge variant='secondary'>Cost: {step.estimatedCost}</Badge>
                                        <Badge variant='secondary'>Benefit: {step.expectedBenefit}</Badge>
                                    </div>
                                </div>
                            </div>
                            {index < simulationResult.actionPlan.length -1 && <Separator className='my-4'/>}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Alternative Policies Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Lightbulb/>Alternative & Complementary Policies</CardTitle>
                </CardHeader>
                 <CardContent className='grid gap-4 md:grid-cols-2'>
                    {simulationResult.alternativePolicies.map((policy, index) => (
                        <div key={index} className='p-4 border rounded-lg bg-background'>
                            <p className="font-semibold">{policy.title}</p>
                            <p className="text-sm text-muted-foreground">{policy.description}</p>
                        </div>
                    ))}
                 </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
