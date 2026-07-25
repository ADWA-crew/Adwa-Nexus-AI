-- CreateEnum
CREATE TYPE "VisitorEventType" AS ENUM (
  'SESSION_START',
  'ARTIFACT_VIEW',
  'QR_SCAN',
  'GALLERY_ENTER',
  'PERSONALIZATION_UPDATE',
  'SESSION_END'
);

-- CreateTable
CREATE TABLE "visitor_sessions" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "museumId" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ageGroup" TEXT,
    "visitGoal" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitor_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_events" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "type" "VisitorEventType" NOT NULL,
    "artifactId" TEXT,
    "galleryId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitor_events_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "qr_scans" ADD COLUMN "sessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "visitor_sessions_token_key" ON "visitor_sessions"("token");

-- CreateIndex
CREATE INDEX "visitor_events_sessionId_type_idx" ON "visitor_events"("sessionId", "type");

-- CreateIndex
CREATE INDEX "visitor_events_sessionId_createdAt_idx" ON "visitor_events"("sessionId", "createdAt");

-- AddForeignKey
ALTER TABLE "visitor_sessions" ADD CONSTRAINT "visitor_sessions_museumId_fkey" FOREIGN KEY ("museumId") REFERENCES "museums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_events" ADD CONSTRAINT "visitor_events_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "visitor_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_events" ADD CONSTRAINT "visitor_events_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "artifacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visitor_events" ADD CONSTRAINT "visitor_events_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "galleries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_scans" ADD CONSTRAINT "qr_scans_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "visitor_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
