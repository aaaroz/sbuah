import { z } from "zod";

// -------------------------
// Product Base Schema
// -------------------------
export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().positive(),
  imageUrl: z.url().nullable().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Schema for create
export const createProductSchema = productSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for update
export const updateProductSchema = productSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// -------------------------
// Product Types
// -------------------------
export type Product = z.infer<typeof productSchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
