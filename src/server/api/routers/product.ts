import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { createProductSchema } from "@/lib/schemas/product/product-schema";

export const productRouter = createTRPCRouter({
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

  getAll: publicProcedure.query(async ({ ctx }) => {
    const product = await ctx.db.product.findMany();

    return product ?? null;
  }),
});
