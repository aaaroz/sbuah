import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  getAllOrderSchema,
  orderCreateSchema,
  orderIdSchema,
  orderUpdateSchema,
} from "@/lib/schemas/order/order-schema";

export const orderRouter = createTRPCRouter({
  // ---------------------------
  // CREATE ORDER
  // ---------------------------
  create: publicProcedure
    .input(orderCreateSchema)
    .mutation(
      async ({
        ctx,
        input: {
          buyerName,
          items,
          subtotal,
          phoneNumber,
          totalAmount,
          paymentMethod,
          purchaseMethod,
          note,
          email,
        },
      }) => {
        return ctx.db.order.create({
          data: {
            buyerName,
            subtotal,
            phoneNumber,
            totalAmount,
            paymentMethod,
            purchaseMethod,
            note,
            email,

            items: {
              create: items,
            },
          },
        });
      },
    ),

  // ---------------------------
  // GET ALL (with infinite scroll and filters)
  // ---------------------------
  getAll: privateProcedure
    .input(getAllOrderSchema)
    .query(async ({ ctx, input }) => {
      const { limit, cursor, dateFrom, dateTo, status, sort = "desc" } = input;

      const isDesc = sort === "desc";

      const where = {
        ...(status &&
          status.length > 0 && {
            status: { in: status },
          }),

        ...(dateFrom || dateTo
          ? {
              createdAt: {
                ...(dateFrom && { gte: dateFrom }),
                ...(dateTo && { lte: dateTo }),
              },
            }
          : {}),

        ...(cursor && {
          OR: [
            {
              createdAt: isDesc
                ? { lt: cursor.createdAt }
                : { gt: cursor.createdAt },
            },
            {
              createdAt: cursor.createdAt,
              statusRank: isDesc
                ? { lt: cursor.statusRank }
                : { gt: cursor.statusRank },
            },
            {
              createdAt: cursor.createdAt,
              statusRank: cursor.statusRank,
              id: isDesc ? { lt: cursor.id } : { gt: cursor.id },
            },
          ],
        }),
      };

      const orders = await ctx.db.order.findMany({
        take: limit + 1,

        where,

        orderBy: [{ createdAt: sort }, { statusRank: sort }, { id: sort }],

        select: {
          id: true,
          orderNumber: true,
          buyerName: true,
          phoneNumber: true,
          status: true,
          statusRank: true,
          totalAmount: true,
          isPaid: true,
          proofImageUrl: true,
          createdAt: true,
          items: {
            select: {
              id: true,
              imageUrl: true,
              name: true,
              quantity: true,
            },
          },
        },
      });

      const hasNextPage = orders.length > limit;
      const data = hasNextPage ? orders.slice(0, limit) : orders;

      const last = data.at(-1);

      return {
        data,
        nextCursor:
          hasNextPage && last
            ? {
                id: last.id,
                createdAt: last.createdAt,
                statusRank: last.statusRank,
              }
            : undefined,
      };
    }),

  // ---------------------------
  // GET ONE ORDER BY ID
  // ---------------------------
  getOne: privateProcedure
    .input(orderIdSchema)
    .query(async ({ ctx, input }) => {
      return ctx.db.order.findUnique({
        where: { id: input.id },
        include: {
          items: true,
        },
      });
    }),

  // ---------------------------
  // UPDATE PRODUCT
  // ---------------------------
  update: privateProcedure
    .input(orderUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...orderData } = input;

      return ctx.db.order.update({
        where: { id },
        data: {
          ...orderData,
        },
      });
    }),
});
