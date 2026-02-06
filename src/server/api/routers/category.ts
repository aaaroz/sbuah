import {
  createCategorySchema,
  singleCategoryIdSchema,
  updateCategorySchema,
} from "@/lib/schemas/category/category-schema";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import z from "zod";

export const categoryRouter = createTRPCRouter({
  // ---------------------------
  // CREATE
  // ---------------------------
  create: publicProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.category.create({
        data: {
          name: input.name,
        },
      });
    }),

  // ---------------------------
  // GET ALL
  // ---------------------------
  getAll: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return categories;
  }),

  getAllWithProducts: publicProcedure
    .input(
      z.object({
        sort: z.enum(["asc", "desc"]).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const categories = await ctx.db.category.findMany({
        orderBy: {
          name: input.sort ?? "asc",
        },
        select: {
          id: true,
          name: true,
          products: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
            },
          },
        },
      });

      return categories;
    }),

  // ---------------------------
  // GET ONE BY ID
  // ---------------------------
  getOne: publicProcedure
    .input(singleCategoryIdSchema)
    .query(async ({ ctx, input }) => {
      return ctx.db.category.findUnique({
        where: { id: input.id },
      });
    }),

  // ---------------------------
  // UPDATE
  // ---------------------------
  update: privateProcedure
    .input(updateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      return ctx.db.category.update({
        where: { id },
        data,
      });
    }),

  // ---------------------------
  // DELETE
  // ---------------------------
  delete: privateProcedure
    .input(singleCategoryIdSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.category.delete({
        where: { id: input.id },
      });
    }),
});
