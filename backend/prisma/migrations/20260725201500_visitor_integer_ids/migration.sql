-- Recreate visitor tables with autoincrement integer IDs (1, 2, 3...)

ALTER TABLE "qr_scans" DROP CONSTRAINT IF EXISTS "qr_scans_sessionId_fkey";
ALTER TABLE "visitor_events" DROP CONSTRAINT IF EXISTS "visitor_events_sessionId_fkey";
ALTER TABLE "visitor_events" DROP CONSTRAINT IF EXISTS "visitor_events_artifactId_fkey";
ALTER TABLE "visitor_events" DROP CONSTRAINT IF EXISTS "visitor_events_galleryId_fkey";
ALTER TABLE "visitor_sessions" DROP CONSTRAINT IF EXISTS "visitor_sessions_museumId_fkey";

DROP TABLE IF EXISTS "visitor_events";
DROP TABLE IF EXISTS "visitor_sessions";

CREATE TABLE "visitor_sessions" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "museumId" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ageGroup" TEXT,
    "visitGoal" TEXT,
    "fullName" TEXT,
    "visitorType" TEXT,
    "education" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitor_sessions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "visitor_sessions_token_key" ON "visitor_sessions"("token");

ALTER TABLE "visitor_sessions" ADD CONSTRAINT "visitor_sessions_museumId_fkey" FOREIGN KEY ("museumId") REFERENCES "museums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "visitor_events" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "type" "VisitorEventType" NOT NULL,
    "artifactId" TEXT,
    "galleryId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitor_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "visitor_events_sessionId_type_idx" ON "visitor_events"("sessionId", "type");
CREATE INDEX "visitor_events_sessionId_createdAt_idx" ON "visitor_events"("sessionId", "createdAt");

ALTER TABLE "visitor_events" ADD CONSTRAINT "visitor_events_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "visitor_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "visitor_events" ADD CONSTRAINT "visitor_events_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "artifacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "visitor_events" ADD CONSTRAINT "visitor_events_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "galleries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Clear old text session refs on qr_scans, then switch column type to integer
UPDATE "qr_scans" SET "sessionId" = NULL;
ALTER TABLE "qr_scans" ALTER COLUMN "sessionId" TYPE INTEGER USING NULL;
ALTER TABLE "qr_scans" ADD CONSTRAINT "qr_scans_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "visitor_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
