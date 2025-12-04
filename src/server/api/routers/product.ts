import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import {
  createProductSchema,
  updateProductSchema,
} from "@/lib/schemas/product/product-schema";

export const productRouter = createTRPCRouter({
  // ---------------------------
  // CREATE PRODUCT
  // ---------------------------
  create: publicProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.create({
        data: {
          name: input.name,
          description: input.description,
          price: input.price,
          imageUrl: input.imageUrl,
        },
      });
    }),

  // ---------------------------
  // GET ALL (with pagination)
  // ---------------------------
  getAll: publicProcedure
    .input(
      z
        .object({
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(10),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 10;
      const skip = (page - 1) * limit;

      const [items, totalCount] = await Promise.all([
        ctx.db.product.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: { stats: true },
        }),
        ctx.db.product.count(),
      ]);

      return {
        items: items.map((i) => ({
          ...i,
          price: i.price.toNumber(),
          stats: i.stats
            ? {
                ...i.stats,
                avgRating: i.stats.avgRating.toNumber(),
              }
            : null,
        })),
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      };
    }),

  // ---------------------------
  // GET ONE PRODUCT BY ID
  // ---------------------------
  getOne: publicProcedure
    .input(
      z.object({
        id: z.uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.product.findUnique({
        where: { id: input.id },
      });
    }),

  // ---------------------------
  // UPDATE PRODUCT
  // ---------------------------
  update: publicProcedure
    .input(
      updateProductSchema.extend({
        id: z.uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      return ctx.db.product.update({
        where: { id },
        data,
      });
    }),

  // ---------------------------
  // DELETE PRODUCT
  // ---------------------------
  remove: publicProcedure
    .input(
      z.object({
        id: z.uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.delete({
        where: { id: input.id },
      });
    }),
});
