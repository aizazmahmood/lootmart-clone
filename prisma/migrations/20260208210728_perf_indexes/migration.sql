-- DropIndex
DROP INDEX "Product_title_idx";

-- CreateIndex
CREATE INDEX "Product_storeId_id_idx" ON "Product"("storeId", "id");

-- CreateIndex
CREATE INDEX "Product_storeId_inStock_idx" ON "Product"("storeId", "inStock");

-- CreateIndex
CREATE INDEX "Product_storeId_price_idx" ON "Product"("storeId", "price");

-- CreateIndex
CREATE INDEX "Product_storeId_title_idx" ON "Product"("storeId", "title");

-- CreateIndex
CREATE INDEX "Store_slug_idx" ON "Store"("slug");
