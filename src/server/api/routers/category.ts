import {
  createCategorySchema,
  singleCategoryIdSchema,
  updateCategorySchema,
} from "@/lib/schemas/category-schema";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";

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
    const categories = await ctx.db.category.findMany();

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
  remove: privateProcedure
    .input(singleCategoryIdSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.delete({
        where: { id: input.id },
      });
    }),
});
