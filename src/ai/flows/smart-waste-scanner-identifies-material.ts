'use server';

/**
 * @fileOverview Identifies waste material from an image and suggests disposal/reuse methods.
 *
 * - identifyWasteMaterial - Function to identify waste material and suggest disposal methods.
 * - IdentifyWasteMaterialInput - Input type for the identifyWasteMaterial function.
 * - IdentifyWasteMaterialOutput - Output type for the identifyWasteMaterial function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyWasteMaterialInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the waste material, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' /* example: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w+G4EAQg4EB8hEBAjEQE8KIBIQTALfkcjwAAAABJRU5ErkJggg== */
    ),
});
export type IdentifyWasteMaterialInput = z.infer<typeof IdentifyWasteMaterialInputSchema>;

const IdentifyWasteMaterialOutputSchema = z.object({
  material: z.string().describe('The identified waste material.'),
  disposalMethods: z.array(z.string()).describe('Suggested disposal or reuse methods.'),
});
export type IdentifyWasteMaterialOutput = z.infer<typeof IdentifyWasteMaterialOutputSchema>;

export async function identifyWasteMaterial(
  input: IdentifyWasteMaterialInput
): Promise<IdentifyWasteMaterialOutput> {
  return identifyWasteMaterialFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyWasteMaterialPrompt',
  input: {schema: IdentifyWasteMaterialInputSchema},
  output: {schema: IdentifyWasteMaterialOutputSchema},
  prompt: `You are a waste management expert. Analyze the image of the waste material and
suggest the best disposal or reuse methods.

Image: {{media url=photoDataUri}}

Respond in JSON format.
`,
});

const identifyWasteMaterialFlow = ai.defineFlow(
  {
    name: 'identifyWasteMaterialFlow',
    inputSchema: IdentifyWasteMaterialInputSchema,
    outputSchema: IdentifyWasteMaterialOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
