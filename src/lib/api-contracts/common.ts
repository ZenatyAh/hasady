import { z } from 'zod';

export const apiEnvelopeSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    timestamp: z.string().optional(),
  });

export const paginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

export const paginatedSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    meta: paginationMetaSchema,
  });

/** Alternative paginated shape used by some list endpoints */
export const paginatedItemsSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    meta: paginationMetaSchema.optional(),
    total: z.number().optional(),
    page: z.number().optional(),
    limit: z.number().optional(),
    totalPages: z.number().optional(),
    hasNextPage: z.boolean().optional(),
    hasPreviousPage: z.boolean().optional(),
  });
