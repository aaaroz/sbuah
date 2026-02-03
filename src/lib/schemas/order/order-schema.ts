import { z } from "zod";

export const orderStatusEnum = z.enum([
  "PENDING",
  "ON_PROCESS",
  "COMPLETED",
  "CANCELLED",
]);

export const paymentMethodEnum = z.enum(["CASH", "TRANSFER"]);

export const purchaseMethodEnum = z.enum(["PICK_UP", "DELIVERY"]);

/* Order Item */

export const orderItemBaseSchema = z.object({
  productId: z.uuid(),
  name: z.string().min(1),
  price: z.coerce.number().positive(),
  quantity: z.number().int().positive(),
  imageUrl: z.url().optional().nullable(),
  note: z.string().optional().nullable(),
});

export const orderItemCreateSchema = orderItemBaseSchema;

export const orderItemUpdateSchema = orderItemBaseSchema.partial();

export const orderItemReadSchema = orderItemBaseSchema.extend({
  id: z.uuid(),
  orderId: z.uuid(),
});

/* Order Base */

export const orderBaseSchema = z.object({
  buyerName: z.string().min(1),
  phoneNumber: z.string().min(8),
  email: z.email().optional().nullable(),
  note: z.string().optional().nullable(),
  paymentMethod: paymentMethodEnum,
  purchaseMethod: purchaseMethodEnum,
  subtotal: z.coerce.number().nonnegative(),
  totalAmount: z.coerce.number().nonnegative(),
});

export const orderCreateSchema = orderBaseSchema.extend({
  items: z.array(orderItemCreateSchema).min(1),
});

export const orderReadSchema = orderBaseSchema.extend({
  id: z.uuid(),
  orderNumber: z.number().int(),
  status: orderStatusEnum,
  createdAt: z.date(),
  updatedAt: z.date(),
  items: z.array(orderItemReadSchema),
});

export const orderIdSchema = orderReadSchema.pick({ id: true });

export const orderUpdateSchema = z.object({
  id: z.uuid(),
  buyerName: z.string().min(1).optional(),
  phoneNumber: z.string().min(8).optional(),
  email: z.email().nullable().optional(),
  note: z.string().nullable().optional(),
  status: orderStatusEnum.optional(),
  paymentMethod: paymentMethodEnum.optional(),
  purchaseMethod: purchaseMethodEnum.optional(),
  subtotal: z.coerce.number().nonnegative().optional(),
  totalAmount: z.coerce.number().nonnegative().optional(),
});

export const getAllOrderSchema = z.object({
  limit: z.number().int().min(1).max(50).default(10),
  cursor: z
    .object({ id: z.uuid(), createdAt: z.date(), statusRank: z.number().int() })
    .optional(),
  status: z.array(orderStatusEnum).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  sort: z.enum(["asc", "desc"]).optional(),
});
