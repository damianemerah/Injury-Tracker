-- CreateTable
CREATE TABLE "Reporter" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reporter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Injury" (
    "id" TEXT NOT NULL,
    "bodyMap" TEXT NOT NULL,
    "parts" TEXT[],
    "reporterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Injury_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Injury" ADD CONSTRAINT "Injury_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "Reporter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
