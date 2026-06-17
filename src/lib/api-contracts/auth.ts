import { z } from 'zod';
import { userSchema } from '@/lib/api-contracts/users';

export { userSchema, type ApiUser } from '@/lib/api-contracts/users';

export const authTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const signInResponseSchema = authTokensSchema.extend({
  message: z.string().optional(),
  user: userSchema,
});

export const verifyEmailResponseSchema = authTokensSchema.extend({
  message: z.string().optional(),
  user: userSchema,
});

export const messageResponseSchema = z.object({
  message: z.string(),
});

export type AuthTokens = z.infer<typeof authTokensSchema>;
