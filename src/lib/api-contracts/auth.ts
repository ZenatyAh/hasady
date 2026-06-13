import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  fullName: z.string().nullable().optional(),
  role: z.enum(['BUYER', 'MERCHANT', 'ADMIN']),
  profileImage: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  ratingAvg: z.union([z.number(), z.string()]).optional(),
  ratingCount: z.number().optional(),
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
});

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

export type ApiUser = z.infer<typeof userSchema>;
export type AuthTokens = z.infer<typeof authTokensSchema>;
