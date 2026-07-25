-- AlterTable
ALTER TABLE "visitor_sessions" ADD COLUMN "fullName" TEXT;
ALTER TABLE "visitor_sessions" ADD COLUMN "visitorType" TEXT;
ALTER TABLE "visitor_sessions" ADD COLUMN "education" TEXT;

-- CreateTable
CREATE TABLE "tour_routes" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "duration" TEXT,
    "stops" INTEGER NOT NULL DEFAULT 0,
    "profile" TEXT NOT NULL,
    "museumId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tour_routes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tour_routes_slug_key" ON "tour_routes"("slug");

-- CreateIndex
CREATE INDEX "tour_routes_profile_idx" ON "tour_routes"("profile");
