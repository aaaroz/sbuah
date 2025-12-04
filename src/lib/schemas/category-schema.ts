import { z } from "zod";

// -------------------------
// Category Base Schema
// -------------------------
export const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Schema for create
export const createCategorySchema = categorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for update
export const updateCategorySchema = categorySchema.partial().omit({
  createdAt: true,
  updatedAt: true,
});

export const singleCategoryIdSchema = categorySchema.pick({ id: true });

// -------------------------
// Category Types
// -------------------------
export type Category = z.infer<typeof categorySchema>;
export type CreateCategory = z.infer<typeof createCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;
