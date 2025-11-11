'use server';
/**
 * @fileOverview This file defines a Genkit flow for simulating the environmental impact of local policy scenarios.
 *
 * - simulatePolicyImpact - A function that takes a policy scenario as input and returns the simulated environmental impact.
 * - PolicyScenarioInput - The input type for the simulatePolicyImpact function.
 * - PolicyImpactOutput - The return type for the simulatePolicyImpact function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PolicyScenarioInputSchema = z.object({
  policyScenario: z
    .string()
    .describe(
      'A description of the policy scenario to simulate, e.g., a plastic bag ban or a city-wide composting program.'
    ),
  location: z
    .string()
    .describe(
      'The location where the policy scenario will be implemented, e.g., a city or county name.'
    ),
  environmentalMetrics: z
    .array(z.string())
    .describe(
      'A list of environmental metrics to measure the impact on, e.g., greenhouse gas emissions, landfill waste, recycling rates.'
    ),
});
export type PolicyScenarioInput = z.infer<typeof PolicyScenarioInputSchema>;

const PolicyImpactOutputSchema = z.object({
  simulatedImpact: z
    .string()
    .describe(
      'A detailed description of the simulated environmental impact of the policy scenario, including quantitative estimates for each environmental metric.'
    ),
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
  prompt: `You are an AI-driven environmental model. Your task is to simulate the environmental impact of different policy scenarios.

  Location: {{{location}}}
  Policy Scenario: {{{policyScenario}}}

  Consider the following environmental metrics:
  {{#each environmentalMetrics}}
    - {{{this}}}
  {{/each}}

  Provide a detailed description of the simulated environmental impact of the policy scenario, including quantitative estimates for each environmental metric. Be as accurate as possible.
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
