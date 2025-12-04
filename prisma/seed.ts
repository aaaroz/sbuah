import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      categoryId: anekaJus.id,
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

    const ratings = await Promise.all(ratingsArray);

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
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
