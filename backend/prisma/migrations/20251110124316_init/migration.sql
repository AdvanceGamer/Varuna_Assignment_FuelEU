/*
  Warnings:

  - A unique constraint covering the columns `[ship_id,year]` on the table `ShipCompliance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ShipCompliance_ship_id_year_key" ON "ShipCompliance"("ship_id", "year");
