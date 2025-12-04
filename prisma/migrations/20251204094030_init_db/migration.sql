-- CreateTable
CREATE TABLE "Product" (
    "id" CHAR(36) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductRating" (
    "id" CHAR(36) NOT NULL,
    "rating" INTEGER NOT NULL,
    "reviewText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductStats" (
    "productId" CHAR(36) NOT NULL,
    "avgRating" DECIMAL(3,2) NOT NULL,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductStats_pkey" PRIMARY KEY ("productId")
);

-- AddForeignKey
ALTER TABLE "ProductRating" ADD CONSTRAINT "ProductRating_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductStats" ADD CONSTRAINT "ProductStats_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
