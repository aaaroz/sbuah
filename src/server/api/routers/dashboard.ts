import { createTRPCRouter, privateProcedure } from "@/server/api/trpc";

export const dashboardRouter = createTRPCRouter({
  getStats: privateProcedure.query(async ({ ctx }) => {
    const prisma = ctx.db;

    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      // THIS MONTH
      revenueThisMonth,
      salesThisMonth,
      reviewsThisMonth,

      // LAST MONTH
      revenueLastMonth,
      salesLastMonth,
      reviewsLastMonth,

      // RATINGS
      ratingThisMonth,
      ratingLastMonth,
    ] = await Promise.all([
      prisma.order.aggregate({
        where: {
          status: "COMPLETED",
          createdAt: { gte: startOfThisMonth },
        },
        _sum: { totalAmount: true },
      }),

      prisma.order.count({
        where: {
          status: "COMPLETED",
          createdAt: { gte: startOfThisMonth },
        },
      }),

      prisma.productRating.count({
        where: {
          createdAt: { gte: startOfThisMonth },
        },
      }),

      prisma.order.aggregate({
        where: {
          status: "COMPLETED",
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
        _sum: { totalAmount: true },
      }),

      prisma.order.count({
        where: {
          status: "COMPLETED",
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
      }),

      prisma.productRating.count({
        where: {
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
      }),

      prisma.productStats.aggregate({
        where: {
          product: {
            createdAt: { lte: now },
          },
        },
        _avg: { avgRating: true },
      }),

      prisma.productStats.aggregate({
        where: {
          product: {
            createdAt: { lte: endOfLastMonth },
          },
        },
        _avg: { avgRating: true },
      }),
    ]);

    const calcChange = (current: number, previous: number) => {
      if (previous === 0) return 0;
      return ((current - previous) / previous) * 100;
    };

    const currentRevenue = Number(revenueThisMonth._sum.totalAmount ?? 0);
    const lastRevenue = Number(revenueLastMonth._sum.totalAmount ?? 0);

    const currentSales = salesThisMonth;
    const lastSales = salesLastMonth;

    const currentReviews = reviewsThisMonth;
    const lastReviews = reviewsLastMonth;

    const currentRating = Number(ratingThisMonth._avg.avgRating ?? 0);
    const lastRating = Number(ratingLastMonth._avg.avgRating ?? 0);

    return {
      revenue: {
        value: currentRevenue,
        change: calcChange(currentRevenue, lastRevenue),
      },
      sales: {
        value: currentSales,
        change: calcChange(currentSales, lastSales),
      },
      reviews: {
        value: currentReviews,
        change: calcChange(currentReviews, lastReviews),
      },
      rating: {
        value: currentRating,
        change: calcChange(currentRating, lastRating),
      },
    };
  }),

  /**
   * 📊 Overview Chart Data
   * Returns monthly revenue for charts
   */
  getOverview: privateProcedure.query(async ({ ctx }) => {
    const prisma = ctx.db;

    const MONTH_COUNT = 8;
    const now = new Date();

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];

    const results = await Promise.all(
      Array.from({ length: MONTH_COUNT }).map(async (_, index) => {
        const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const revenue = await prisma.order.aggregate({
          where: {
            status: "COMPLETED",
            createdAt: { gte: start, lte: end },
          },
          _sum: { totalAmount: true },
        });

        return {
          name: monthNames[date.getMonth()],
          total: Number(revenue._sum.totalAmount ?? 0),
        };
      }),
    );

    // reverse so chart flows left → right (oldest → newest)
    return results.reverse();
  }),

  getRecentOrders: privateProcedure.query(async ({ ctx }) => {
    const prisma = ctx.db;

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        orderNumber: true,
        buyerName: true,
        phoneNumber: true,
        status: true,
        totalAmount: true,
        createdAt: true,
      },
    });

    return orders;
  }),
});
