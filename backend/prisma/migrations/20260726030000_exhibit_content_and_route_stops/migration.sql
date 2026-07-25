-- AlterTable: exhibit content on artifacts
ALTER TABLE "artifacts" ADD COLUMN IF NOT EXISTS "slug" TEXT;
ALTER TABLE "artifacts" ADD COLUMN IF NOT EXISTS "subtitle" TEXT;
ALTER TABLE "artifacts" ADD COLUMN IF NOT EXISTS "coverImage" TEXT;
ALTER TABLE "artifacts" ADD COLUMN IF NOT EXISTS "paragraphs" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "artifacts" ADD COLUMN IF NOT EXISTS "kidsText" TEXT;
ALTER TABLE "artifacts" ADD COLUMN IF NOT EXISTS "facts" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "artifacts" ADD COLUMN IF NOT EXISTS "youtubeId" TEXT;
ALTER TABLE "artifacts" ADD COLUMN IF NOT EXISTS "videoCaption" TEXT;
ALTER TABLE "artifacts" ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS "artifacts_slug_key" ON "artifacts"("slug");
CREATE INDEX IF NOT EXISTS "artifacts_museumId_status_idx" ON "artifacts"("museumId", "status");
CREATE INDEX IF NOT EXISTS "artifacts_galleryId_idx" ON "artifacts"("galleryId");

-- Gallery / media / session indexes
CREATE INDEX IF NOT EXISTS "galleries_museumId_idx" ON "galleries"("museumId");
CREATE INDEX IF NOT EXISTS "media_artifactId_idx" ON "media"("artifactId");
CREATE INDEX IF NOT EXISTS "qr_scans_artifactId_idx" ON "qr_scans"("artifactId");
CREATE INDEX IF NOT EXISTS "qr_scans_sessionId_idx" ON "qr_scans"("sessionId");
CREATE INDEX IF NOT EXISTS "visitor_sessions_museumId_idx" ON "visitor_sessions"("museumId");
CREATE INDEX IF NOT EXISTS "visitor_sessions_visitorType_idx" ON "visitor_sessions"("visitorType");

-- TourRoute.museumId becomes a real FK
CREATE INDEX IF NOT EXISTS "tour_routes_museumId_idx" ON "tour_routes"("museumId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'tour_routes_museumId_fkey'
  ) THEN
    ALTER TABLE "tour_routes"
      ADD CONSTRAINT "tour_routes_museumId_fkey"
      FOREIGN KEY ("museumId") REFERENCES "museums"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- CreateTable: ordered stops on a tour route
CREATE TABLE IF NOT EXISTS "tour_route_stops" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "artifactId" TEXT,
    "order" INTEGER NOT NULL,
    "title" TEXT,
    "note" TEXT,

    CONSTRAINT "tour_route_stops_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "tour_route_stops_routeId_order_key" ON "tour_route_stops"("routeId", "order");
CREATE INDEX IF NOT EXISTS "tour_route_stops_artifactId_idx" ON "tour_route_stops"("artifactId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'tour_route_stops_routeId_fkey'
  ) THEN
    ALTER TABLE "tour_route_stops"
      ADD CONSTRAINT "tour_route_stops_routeId_fkey"
      FOREIGN KEY ("routeId") REFERENCES "tour_routes"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'tour_route_stops_artifactId_fkey'
  ) THEN
    ALTER TABLE "tour_route_stops"
      ADD CONSTRAINT "tour_route_stops_artifactId_fkey"
      FOREIGN KEY ("artifactId") REFERENCES "artifacts"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
