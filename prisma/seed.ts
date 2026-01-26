import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
import { env } from "@/env";

type ProductRating = {
  productId: number;
  rating: number;
  reviewText: string;
};

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});
const prisma = new PrismaClient({
  adapter,
});
async function main() {
  console.log("🌱 Seeding categories...");

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "Aneka Jus" },
    }),
    prisma.category.create({
      data: { name: "Pop Ice" },
    }),
    prisma.category.create({
      data: { name: "Cappuccino Cincau" },
    }),
  ]);

  const [anekaJus, popIce, cappuccinoCincau] = categories;

  console.log("🌱 Seeding drink products...");

  // Drink product list grouped by category
  const drinks = [
    // Aneka Jus
    {
      name: "Sop Buah Spesial",
      description: "Sop buah segar dengan campuran buah tropis.",
      price: 12000,
      categoryId: anekaJus?.id,
    },
    {
      name: "Jus Mangga",
      description: "Jus mangga segar dari buah pilihan.",
      price: 13000,
      categoryId: anekaJus.id,
    },
    {
      name: "Jus Alpukat",
      description: "Jus alpukat kental dengan topping coklat.",
      price: 15000,
      categoryId: anekaJus.id,
    },

    // Pop Ice
    {
      name: "Es Coklat Premium",
      description: "Minuman coklat creamy dengan rasa manis seimbang.",
      price: 15000,
      categoryId: popIce.id,
    },
    {
      name: "Milk Tea Boba",
      description: "Milk tea dengan topping boba kenyal.",
      price: 18000,
      categoryId: popIce.id,
    },

    // Cappuccino Cincau
    {
      name: "Cappuccino Cincau Ori",
      description: "Minuman cappuccino segar dengan cincau kenyal.",
      price: 12000,
      categoryId: cappuccinoCincau.id,
    },
    {
      name: "Cappuccino Cincau Gula Aren",
      description: "Cappuccino cincau dengan gula aren premium.",
      price: 14000,
      categoryId: cappuccinoCincau.id,
    },

    // Common Drinks (Fallback category: Aneka Jus)
    {
      name: "Es Teh Manis",
      description: "Es teh manis segar pelepas dahaga.",
      price: 6000,
      categoryId: anekaJus.id,
    },
    {
      name: "Teh Tarik",
      description: "Teh tarik creamy ala Malaysia.",
      price: 10000,
      categoryId: anekaJus.id,
    },
    {
      name: "Lemon Tea",
      description: "Teh lemon segar dengan aroma citrus.",
      price: 9000,
      categoryId: anekaJus.id,
    },
  ];

  for (const drink of drinks) {
    const created = await prisma.product.create({
      data: {
        name: drink.name,
        description: drink.description,
        price: drink.price,
        categoryId: drink.categoryId,
        imageUrl: `https://placehold.co/600x400?text=${encodeURIComponent(
          drink.name,
        )}`,
      },
    });

    // Generate sample ratings
    const ratingCount = Math.floor(Math.random() * 5) + 3; // 3–7 reviews
    const ratingsArray = [];

    for (let i = 0; i < ratingCount; i++) {
      const value = Math.floor(Math.random() * 3) + 3; // rating 3–5

      ratingsArray.push(
        prisma.productRating.create({
          data: {
            productId: created.id,
            rating: value,
            reviewText: `Sample review #${i + 1} for ${drink.name}`,
          },
        }),
      );
    }

    const ratings = (await Promise.all(ratingsArray)) as ProductRating[];

    const avgRating =
      ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    await prisma.productStats.create({
      data: {
        productId: created.id,
        avgRating: Number(avgRating.toFixed(2)),
        reviewCount: ratings.length,
      },
    });
  }

  console.log("🌱 Drink seeding completed!");

  console.log("🌱 Seeding orders...");

  const products = await prisma.product.findMany();

  const randomItem = <T>(arr: T[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  for (let i = 0; i < 10; i++) {
    const itemCount = Math.floor(Math.random() * 3) + 1; // 1–3 items
    const selectedProducts = [...products]
      .sort(() => 0.5 - Math.random())
      .slice(0, itemCount);

    const orderItems = selectedProducts.map((product) => {
      const quantity = Math.floor(Math.random() * 3) + 1;

      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        note: Math.random() > 0.7 ? "Less ice" : null,
      };
    });

    const subtotal = orderItems.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );

    const deliveryFee = Math.random() > 0.5 ? 5000 : 0;
    const totalAmount = subtotal + deliveryFee;

    await prisma.order.create({
      data: {
        buyerName: `Customer ${i + 1}`,
        phoneNumber: `08${Math.floor(100000000 + Math.random() * 900000000)}`,
        email: Math.random() > 0.5 ? `customer${i + 1}@mail.com` : null,
        note: Math.random() > 0.6 ? "Tolong cepat ya" : null,

        paymentMethod: randomItem(["CASH", "TRANSFER"])!,
        purchaseMethod: randomItem(["PICK_UP", "DELIVERY"])!,
        status: randomItem(["PENDING", "PAID", "COMPLETED"]),

        subtotal,
        totalAmount,

        items: {
          create: orderItems,
        },
      },
    });
  }

  console.log("🌱 Order seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
