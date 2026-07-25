/**
 * Map a Prisma Artifact (+ gallery/media/qr) into the frontend exhibit shape
 * used by ScanStage, ExhibitViewer, and /exhibit/:id.
 */
export function toExhibitDto(artifact) {
  if (!artifact) return null;

  const imageFromMedia = artifact.media?.find((m) => m.type === 'IMAGE')?.url;
  const publicId = artifact.slug || artifact.id;

  return {
    id: publicId,
    artifactId: artifact.id,
    slug: artifact.slug,
    title: artifact.title,
    subtitle: artifact.subtitle ?? null,
    era: artifact.era ?? null,
    gallery: artifact.gallery?.name ?? artifact.location ?? null,
    galleryId: artifact.galleryId ?? artifact.gallery?.id ?? null,
    image: artifact.coverImage || imageFromMedia || null,
    paragraphs: Array.isArray(artifact.paragraphs) ? artifact.paragraphs : [],
    kidsText: artifact.kidsText ?? null,
    facts: Array.isArray(artifact.facts) ? artifact.facts : [],
    youtubeId: artifact.youtubeId ?? null,
    videoCaption: artifact.videoCaption ?? null,
    description: artifact.description ?? null,
    category: artifact.category ?? null,
    location: artifact.location ?? null,
    museumId: artifact.museumId,
    status: artifact.status,
    qrCode: artifact.qrCode
      ? {
          code: artifact.qrCode.code,
          url: artifact.qrCode.url,
        }
      : null,
    media: (artifact.media ?? []).map((m) => ({
      id: m.id,
      url: m.url,
      type: m.type,
      filename: m.filename,
    })),
  };
}

export function toArtifactCardDto(artifact) {
  const exhibit = toExhibitDto(artifact);
  return {
    id: exhibit.id,
    artifactId: exhibit.artifactId,
    slug: exhibit.slug,
    title: exhibit.title,
    subtitle: exhibit.subtitle,
    description: exhibit.description,
    era: exhibit.era,
    category: exhibit.category,
    gallery: exhibit.gallery,
    galleryId: exhibit.galleryId,
    location: exhibit.location,
    image: exhibit.image,
    museumId: exhibit.museumId,
  };
}

export function toRouteDto(route) {
  const stops =
    route.routeStops?.map((stop) => ({
      order: stop.order,
      title: stop.title || stop.artifact?.title || null,
      note: stop.note ?? null,
      artifactId: stop.artifact?.slug || stop.artifactId || null,
      exhibit: stop.artifact ? toArtifactCardDto(stop.artifact) : null,
    })) ?? [];

  return {
    id: route.slug || route.id,
    routeId: route.id,
    slug: route.slug,
    title: route.title,
    description: route.description,
    duration: route.duration,
    stops: route.stops ?? stops.length,
    profile: route.profile,
    museumId: route.museumId,
    stopList: stops,
  };
}

export function toMuseumDto(museum) {
  return {
    id: museum.id,
    name: museum.name,
    description: museum.description,
    address: museum.address,
    openingHours: museum.openingHours,
    coverImage: museum.coverImage,
    status: museum.status,
    galleryCount: museum._count?.galleries ?? museum.galleries?.length ?? 0,
    artifactCount: museum._count?.artifacts ?? museum.artifacts?.length ?? 0,
    galleries: museum.galleries?.map((g) => ({
      id: g.id,
      name: g.name,
      description: g.description,
      floor: g.floor,
      room: g.room,
    })),
    artifacts: museum.artifacts?.map((a) => toArtifactCardDto(a)),
  };
}
