'use server';
/**
 * @fileOverview An AI agent that answers questions about waste disposal, recycling, composting, policies, and sustainable living.
 *
 * - answerWasteQuestion - A function that answers user questions related to waste and sustainability.
 * - AnswerWasteQuestionInput - The input type for the answerWasteQuestion function.
 * - AnswerWasteQuestionOutput - The return type for the answerWasteQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerWasteQuestionInputSchema = z.object({
  question: z.string().describe('The user question about waste disposal, recycling, composting, policies, or sustainable living.'),
});
export type AnswerWasteQuestionInput = z.infer<typeof AnswerWasteQuestionInputSchema>;

const AnswerWasteQuestionOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the user question.'),
});
export type AnswerWasteQuestionOutput = z.infer<typeof AnswerWasteQuestionOutputSchema>;

export async function answerWasteQuestion(input: AnswerWasteQuestionInput): Promise<AnswerWasteQuestionOutput> {
  return answerWasteQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerWasteQuestionPrompt',
  input: {schema: AnswerWasteQuestionInputSchema},
  output: {schema: AnswerWasteQuestionOutputSchema},
  prompt: `You are an AI assistant named Gaia, specializing in providing information about waste disposal, recycling, composting, policies, and sustainable living.
  Answer the following question clearly and concisely, using your knowledge of global data and best practices.

  Question: {{{question}}}
  `,
});

const answerWasteQuestionFlow = ai.defineFlow(
  {
    name: 'answerWasteQuestionFlow',
    inputSchema: AnswerWasteQuestionInputSchema,
    outputSchema: AnswerWasteQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
