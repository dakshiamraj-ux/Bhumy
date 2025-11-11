'use server';
/**
 * @fileOverview This file defines a Genkit flow for simulating the environmental impact of local policy scenarios.
 *
 * - simulatePolicyImpact - A function that takes a policy scenario as input and returns a detailed analysis.
 * - PolicyScenarioInput - The input type for the simulatePolicyImpact function.
 * - PolicyImpactOutput - The return type for the simulatePolicyImpact function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PolicyScenarioInputSchema = z.object({
  policyDescription: z
    .string()
    .describe(
      'A description of the policy scenario to simulate, e.g., "a city-wide ban on single-use plastic bags".'
    ),
  location: z
    .string()
    .describe(
      'The location where the policy will be implemented, e.g., "Noida, India".'
    ),
});
export type PolicyScenarioInput = z.infer<typeof PolicyScenarioInputSchema>;

const PolicyImpactOutputSchema = z.object({
  environmentalImpact: z.array(z.object({
      metric: z.string().describe("The environmental metric being measured, e.g., 'CO2 Emissions Reduced' or 'Landfill Diversion Rate'"),
      value: z.string().describe("The estimated quantitative impact, e.g., '15,000 tonnes/year' or '+25%'"),
      impact: z.enum(['positive', 'negative']).describe("Whether the impact is 'positive' or 'negative' for the environment.")
  })).describe('A list of key environmental impact metrics, their simulated values, and the direction of impact.'),
  alternativePolicies: z.array(z.object({
      title: z.string().describe('The title of the alternative or complementary policy.'),
      description: z.string().describe('A brief description of the suggested policy.'),
  })).describe('A list of suggested alternative or complementary policies.'),
  actionPlan: z.array(z.object({
      step: z.number().describe('The step number in the action plan.'),
      title: z.string().describe('The title of the action plan step.'),
      description: z.string().describe('A detailed description of the action to be taken.'),
      timeline: z.string().describe('The estimated timeline for this step, e.g., "1-3 Months".'),
      estimatedCost: z.string().describe('A rough estimate of the cost, e.g., "Low" or "₹50,00,000".'),
      expectedBenefit: z.string().describe('The primary benefit expected from this step.'),
  })).describe('A step-by-step action plan for implementing the policy.'),
});

export type PolicyImpactOutput = z.infer<typeof PolicyImpactOutputSchema>;

export async function simulatePolicyImpact(
  input: PolicyScenarioInput
): Promise<PolicyImpactOutput> {
  return simulatePolicyImpactFlow(input);
}

const prompt = ai.definePrompt({
  name: 'policyImpactPrompt',
  input: {schema: PolicyScenarioInputSchema},
  output: {schema: PolicyImpactOutputSchema},
  prompt: `You are an expert AI urban environmental policy advisor. Your task is to simulate the impact of a proposed waste management policy for a specific location.

  Location: {{{location}}}
  Proposed Policy: {{{policyDescription}}}

  Based on the proposed policy and location, provide a comprehensive analysis in the required JSON format.

  Your analysis must include:
  1.  **Environmental Impact**: Provide at least three key quantitative metrics (e.g., Landfill Waste Reduction, Recycling Rate Increase, GHG Emissions Reduction). Classify each impact as 'positive' or 'negative'. Be realistic and use typical units (e.g., tonnes/year, %).
  2.  **Alternative Policies**: Suggest two distinct alternative or complementary policies that could also be effective in this location.
  3.  **Action Plan**: Generate a practical, step-by-step action plan with 3-5 steps. For each step, include a title, description, estimated timeline, cost (use categories like 'Low', 'Medium', 'High', or a monetary value in local currency like ₹), and the expected benefit.
  `,
});

const simulatePolicyImpactFlow = ai.defineFlow(
  {
    name: 'simulatePolicyImpactFlow',
    inputSchema: PolicyScenarioInputSchema,
    outputSchema: PolicyImpactOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
