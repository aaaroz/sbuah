import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  createProductSchema,
  getAllProductSchema,
  singleProductIdSchema,
  bulkUpdateStatusSchema,
  updateProductSchema,
} from "@/lib/schemas/product/product-schema";
import { type Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { deleteUploadThingFile, getUploadthingKey } from "@/lib/utils";

export const productRouter = createTRPCRouter({
  // ---------------------------
  // CREATE PRODUCT
  // ---------------------------
  create: privateProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.create({
        data: {
          name: input.name,
          description: input.description,
          price: input.price,
          imageUrl: input.imageUrl,
          categoryId: input.categoryId,
          status: input.status,
        },
      });
    }),

  // ---------------------------
  // GET ALL (with pagination)
  // ---------------------------
  getAll: publicProcedure
    .input(getAllProductSchema)
    .query(async ({ ctx, input }) => {
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 10;
      const skip = (page - 1) * limit;
      const categoryId = input?.categoryId;
      const searchQuery = input?.searchQuery;

      //      const where = categoryId ? { categoryId } : {};
      const where: Prisma.ProductWhereInput = {
        ...(categoryId && {
          categoryId,
        }),
        ...(searchQuery && {
          name: {
            contains: searchQuery,
            mode: "insensitive",
          },
        }),
      };

      const [items, totalCount] = await Promise.all([
        ctx.db.product.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: { stats: true, category: true },
          where,
        }),
        ctx.db.product.count({ where }),
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
    .input(singleProductIdSchema)
    .query(async ({ ctx, input }) => {
      return ctx.db.product
        .findUnique({
          where: { id: input.id },
        })
        .then((product) => ({
          ...product,
          price: product?.price.toNumber() ?? 0,
        }));
    }),

  // ---------------------------
  // UPDATE PRODUCT
  // ---------------------------
  update: privateProcedure
    .input(updateProductSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      return ctx.db.product.update({
        where: { id },
        data,
      });
    }),

  bulkUpdateStatus: privateProcedure
    .input(bulkUpdateStatusSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.updateMany({
        where: {
          id: { in: input.ids },
        },
        data: {
          status: input.status,
        },
      });
    }),

  // ---------------------------
  // DELETE PRODUCT
  // ---------------------------
  delete: privateProcedure
    .input(singleProductIdSchema)
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Produk tidak ditemukan.",
        });
      }

      const hasOrders = await ctx.db.orderItem.findFirst({
        where: { productId: input.id },
        select: { id: true },
      });

      if (hasOrders) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Produk sudah pernah dipesan dan tidak dapat dihapus",
        });
      }

      await ctx.db.product.delete({
        where: { id: input.id },
      });

      if (product.imageUrl) {
        const key = getUploadthingKey(product.imageUrl);
        if (key) {
          deleteUploadThingFile(key).catch(console.error);
        }
      }

      return {
        name: product.name,
      };
    }),

  bulkDelete: privateProcedure
    .input(bulkUpdateStatusSchema.omit({ status: true }))
    .mutation(async ({ ctx, input }) => {
      const { ids } = input;

      const products = await ctx.db.product.findMany({
        where: { id: { in: ids } },
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      });

      if (products.length < 1) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Produk tidak ditemukan.",
        });
      }

      const usedInOrders = await ctx.db.orderItem.findFirst({
        where: {
          productId: { in: ids },
        },
        select: {
          productId: true,
        },
      });

      if (usedInOrders) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Salah satu atau beberapa produk yang dipilih sudah pernah dipesan dan tidak dapat dihapus.",
        });
      }
      const result = await ctx.db.product.deleteMany({
        where: {
          id: { in: ids },
        },
      });

      for (const product of products) {
        if (product.imageUrl) {
          const key = getUploadthingKey(product.imageUrl);
          if (key) {
            deleteUploadThingFile(key).catch(console.error);
          }
        }
      }

      return {
        deletedCount: result.count,
      };
    }),
});
