import { z } from "zod";

// -------------------------
// Product Base Schema
// -------------------------
export const productStatusEnum = z.enum(["ACTIVE", "ARCHIVED", "DRAFT"]);

export const productSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Nama produk wajib diisi"),
  description: z.string().nullable(),
  price: z.number().positive("Harga harus lebih dari 0"),
  imageUrl: z.url().nullable().optional(),
  status: productStatusEnum.default("ACTIVE"),
  categoryId: z.uuid().nullable(),
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
  createdAt: true,
  updatedAt: true,
});

export const bulkUpdateStatusSchema = z.object({
  ids: z.array(z.uuid()),
  status: productStatusEnum.default("ACTIVE"),
});

// Schema for fetching all products
export const getAllProductSchema = z
  .object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
    categoryId: z.uuid().optional(),
    searchQuery: z.string().min(1).optional(),
  })
  .optional();

export const singleProductIdSchema = productSchema.pick({ id: true });

// -------------------------
// Product Types
// -------------------------
export type CreateProduct = z.infer<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
export type ProductsStatusEnum = z.infer<typeof productStatusEnum>;
