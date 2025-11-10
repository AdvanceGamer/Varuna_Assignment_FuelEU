-- CreateTable
CREATE TABLE "Route" (
    "id" SERIAL NOT NULL,
    "route_id" TEXT NOT NULL,
    "vessel_type" TEXT NOT NULL,
    "fuel_type" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "ghg_intensity" DOUBLE PRECISION NOT NULL,
    "fuel_tons" DOUBLE PRECISION NOT NULL,
    "distance_km" INTEGER NOT NULL,
    "total_emissions" DOUBLE PRECISION NOT NULL,
    "is_baseline" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipCompliance" (
    "id" SERIAL NOT NULL,
    "ship_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "cb_gco2eq" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ShipCompliance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankEntry" (
    "id" SERIAL NOT NULL,
    "ship_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BankEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pool" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoolMember" (
    "id" SERIAL NOT NULL,
    "pool_id" INTEGER NOT NULL,
    "ship_id" TEXT NOT NULL,
    "cb_before" DOUBLE PRECISION NOT NULL,
    "cb_after" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PoolMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Route_route_id_key" ON "Route"("route_id");

-- CreateIndex
CREATE INDEX "ShipCompliance_ship_id_year_idx" ON "ShipCompliance"("ship_id", "year");

-- CreateIndex
CREATE INDEX "BankEntry_ship_id_year_idx" ON "BankEntry"("ship_id", "year");

-- AddForeignKey
ALTER TABLE "PoolMember" ADD CONSTRAINT "PoolMember_pool_id_fkey" FOREIGN KEY ("pool_id") REFERENCES "Pool"("id") ON DELETE CASCADE ON UPDATE CASCADE;
