-- CreateTable
CREATE TABLE "Photo" (
    "id" SERIAL NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "tags" TEXT[],

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);
