import { z } from 'zod';

const ROLE_VALUES = ['BUYER', 'MERCHANT', 'ADMIN'] as const;

export type Role = (typeof ROLE_VALUES)[number];

/** Normalize API role strings (e.g. lowercase from NestJS) to canonical uppercase Role */
export function normalizeRole(value: unknown): Role {
  if (typeof value !== 'string' || !value.trim()) {
    return 'BUYER';
  }
  const upper = value.toUpperCase().trim();
  if (ROLE_VALUES.includes(upper as Role)) {
    return upper as Role;
  }
  return 'BUYER';
}

export const roleSchema = z.unknown().transform((value): Role => normalizeRole(value));

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  fullName: z.string().nullable().optional(),
  role: roleSchema,
  profileImage: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  ratingAvg: z.union([z.number(), z.string()]).optional(),
  ratingCount: z.number().optional(),
  isActive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
});

/** Full authenticated profile from GET /users/me */
export const currentUserSchema = userSchema;
export type CurrentUser = z.infer<typeof currentUserSchema>;

/** Safe public fields from GET /users/:id/profile */
export const publicUserProfileSchema = z.object({
  id: z.string(),
  fullName: z.string().nullable().optional(),
  profileImage: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  role: roleSchema,
  ratingAvg: z.union([z.number(), z.string()]).optional(),
  ratingCount: z.number().optional(),
});

export type PublicUserProfile = z.infer<typeof publicUserProfileSchema>;

export type UpdateCurrentUserPayload = {
  fullName?: string;
  bio?: string;
};

/** @deprecated Use CurrentUser */
export type ApiUser = CurrentUser;
