/* eslint-disable @typescript-eslint/no-explicit-any */

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
import { env } from "@/env";
import { orderStatusMap, orderStatusRank } from "@/lib/data/order";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});
const prisma = new PrismaClient({
  adapter,
});

async function resetData() {
  console.log("🧹 Resetting non-auth tables...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  await prisma.productRating.deleteMany();
  await prisma.productStats.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // reset order table increment number
  await prisma.$executeRawUnsafe(`
  TRUNCATE TABLE "Order" RESTART IDENTITY CASCADE;
`);

  console.log("🧹 Reset completed");
}

const CATEGORY_DATA = ["Aneka Jus", "Pop Ice", "Cappuccino Cincau"];

async function seedCategories() {
  console.log("🌱 Seeding categories...");

  const categories = await Promise.all(
    CATEGORY_DATA.map((name) =>
      prisma.category.create({
        data: { name },
      }),
    ),
  );

  return Object.fromEntries(categories.map((c) => [c.name, c]));
}

type SeedProduct = {
  name: string;
  description: string;
  price: number;
  categoryName: string;
};

const PRODUCT_DATA: SeedProduct[] = [
  // ====================
  // Aneka Jus
  // ====================
  {
    name: "Sop Buah Spesial",
    description: "Sop buah segar dengan campuran buah tropis.",
    price: 12000,
    categoryName: "Aneka Jus",
  },
  {
    name: "Jus Mangga",
    description: "Jus mangga segar dari buah pilihan.",
    price: 13000,
    categoryName: "Aneka Jus",
  },
  {
    name: "Jus Alpukat",
    description: "Jus alpukat kental dengan topping coklat.",
    price: 15000,
    categoryName: "Aneka Jus",
  },
  {
    name: "Jus Jeruk Peras",
    description: "Jus jeruk segar tanpa gula tambahan.",
    price: 10000,
    categoryName: "Aneka Jus",
  },
  {
    name: "Jus Semangka",
    description: "Jus semangka dingin menyegarkan.",
    price: 9000,
    categoryName: "Aneka Jus",
  },
  {
    name: "Jus Melon",
    description: "Jus melon manis dan segar.",
    price: 9000,
    categoryName: "Aneka Jus",
  },
  {
    name: "Jus Strawberry",
    description: "Jus strawberry segar dengan rasa asam manis.",
    price: 14000,
    categoryName: "Aneka Jus",
  },

  // ====================
  // Pop Ice
  // ====================
  {
    name: "Es Coklat Premium",
    description: "Minuman coklat creamy dengan rasa manis seimbang.",
    price: 15000,
    categoryName: "Pop Ice",
  },
  {
    name: "Milk Tea Boba",
    description: "Milk tea dengan topping boba kenyal.",
    price: 18000,
    categoryName: "Pop Ice",
  },
  {
    name: "Pop Ice Coklat",
    description: "Pop Ice coklat dingin dan creamy.",
    price: 8000,
    categoryName: "Pop Ice",
  },
  {
    name: "Pop Ice Strawberry",
    description: "Pop Ice rasa strawberry favorit anak muda.",
    price: 8000,
    categoryName: "Pop Ice",
  },
  {
    name: "Pop Ice Vanilla Latte",
    description: "Perpaduan vanilla lembut dan kopi.",
    price: 10000,
    categoryName: "Pop Ice",
  },
  {
    name: "Pop Ice Taro",
    description: "Pop Ice taro dengan rasa manis khas.",
    price: 9000,
    categoryName: "Pop Ice",
  },

  // ====================
  // Cappuccino Cincau
  // ====================
  {
    name: "Cappuccino Cincau Ori",
    description: "Minuman cappuccino segar dengan cincau kenyal.",
    price: 12000,
    categoryName: "Cappuccino Cincau",
  },
  {
    name: "Cappuccino Cincau Gula Aren",
    description: "Cappuccino cincau dengan gula aren premium.",
    price: 14000,
    categoryName: "Cappuccino Cincau",
  },
  {
    name: "Cappuccino Cincau Susu",
    description: "Cappuccino cincau dengan susu creamy.",
    price: 13000,
    categoryName: "Cappuccino Cincau",
  },
  {
    name: "Cappuccino Cincau Extra Cincau",
    description: "Cappuccino cincau dengan topping cincau melimpah.",
    price: 15000,
    categoryName: "Cappuccino Cincau",
  },

  // ====================
  // Common / Tea Based
  // ====================
  {
    name: "Es Teh Manis",
    description: "Es teh manis segar pelepas dahaga.",
    price: 6000,
    categoryName: "Aneka Jus",
  },
  {
    name: "Teh Tarik",
    description: "Teh tarik creamy ala Malaysia.",
    price: 10000,
    categoryName: "Aneka Jus",
  },
  {
    name: "Lemon Tea",
    description: "Teh lemon segar dengan aroma citrus.",
    price: 9000,
    categoryName: "Aneka Jus",
  },
  {
    name: "Thai Tea",
    description: "Thai tea creamy dengan aroma khas.",
    price: 12000,
    categoryName: "Aneka Jus",
  },
  {
    name: "Green Tea Latte",
    description: "Green tea latte lembut dan menenangkan.",
    price: 14000,
    categoryName: "Aneka Jus",
  },
  {
    name: "Lychee Tea",
    description: "Teh leci segar dengan rasa manis alami.",
    price: 11000,
    categoryName: "Aneka Jus",
  },
  {
    name: "Peach Tea",
    description: "Teh persik dengan aroma fruity ringan.",
    price: 11000,
    categoryName: "Aneka Jus",
  },
];

async function seedProducts(categories: Record<string, any>) {
  console.log("🌱 Seeding products...");

  const products = [];

  for (const p of PRODUCT_DATA) {
    const product = await prisma.product.upsert({
      where: {
        // Prisma requires a unique constraint – workaround using findFirst
        id:
          (
            await prisma.product.findFirst({
              where: {
                name: p.name,
                categoryId: categories[p.categoryName].id,
              },
              select: { id: true },
            })
          )?.id ?? "___new___",
      },
      update: {},
      create: {
        name: p.name,
        description: p.description,
        price: p.price,
        categoryId: categories[p.categoryName].id,
        imageUrl: `https://placehold.co/600x400?text=${encodeURIComponent(p.name)}`,
      },
    });

    products.push(product);
  }

  return products;
}

async function seedRatingsAndStats(productId: string, productName: string) {
  const ratingCount = Math.floor(Math.random() * 5) + 3;

  const ratings = await prisma.$transaction(
    Array.from({ length: ratingCount }).map((_, i) =>
      prisma.productRating.create({
        data: {
          productId,
          rating: Math.floor(Math.random() * 3) + 3,
          reviewText: `Sample review #${i + 1} for ${productName}`,
        },
      }),
    ),
  );

  const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

  await prisma.productStats.upsert({
    where: { productId },
    update: {
      avgRating: avg,
      reviewCount: ratings.length,
    },
    create: {
      productId,
      avgRating: avg,
      reviewCount: ratings.length,
    },
  });
}

type OrderStatus = keyof typeof orderStatusMap;

async function seedOrders(products: any[]) {
  console.log("🌱 Seeding orders...");

  const randomItem = <T>(arr: readonly T[]): T =>
    arr[Math.floor(Math.random() * arr.length)]!;

  const STATUSES = Object.keys(orderStatusMap) as readonly OrderStatus[];

  for (let i = 0; i < 25; i++) {
    const selected = [...products]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1);

    const items = selected.map((p) => ({
      productId: p.id,
      name: p.name,
      price: p.price,
      imageUrl: p.imageUrl,
      quantity: Math.floor(Math.random() * 3) + 1,
      note: Math.random() > 0.7 ? "Less ice" : null,
    }));

    const subtotal = items.reduce(
      (s, i) => s + Number(i.price) * i.quantity,
      0,
    );

    const deliveryFee = Math.random() > 0.5 ? 5000 : 0;

    const status = randomItem(STATUSES);

    await prisma.order.create({
      data: {
        buyerName: `Customer ${i + 1}`,
        phoneNumber: `08${Math.floor(100000000 + Math.random() * 900000000)}`,
        email: Math.random() > 0.5 ? `customer${i + 1}@mail.com` : null,
        note: Math.random() > 0.6 ? "Tolong cepat ya" : null,
        address:
          Math.random() > 0.3
            ? "lorem ipsum dolor sit amet, consectetur adipiscing elit"
            : null,

        paymentMethod: randomItem(["CASH", "TRANSFER"] as const),
        purchaseMethod: randomItem(["PICK_UP", "DELIVERY"] as const),

        status,
        statusRank: orderStatusRank[status],

        subtotal,
        totalAmount: subtotal + deliveryFee,

        items: {
          create: items,
        },
      },
    });
  }
}

async function main() {
  await resetData();

  const categories = await seedCategories();
  const products = await seedProducts(categories);

  for (const p of products) {
    await seedRatingsAndStats(p.id, p.name);
  }

  await seedOrders(products);

  console.log("✅ Seeding completed successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
