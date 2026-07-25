import { z } from 'zod';

export const chatSchema = z.object({
  message: z.string().trim().min(1).max(4000),
  language: z.enum(['en', 'fr', 'zh', 'am', 'om', 'ti']).default('en'),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(4000),
      }),
    )
    .max(20)
    .optional()
    .default([]),
});
