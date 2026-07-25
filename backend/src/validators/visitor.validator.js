import { z } from 'zod';

/** Matches frontend PersonalizationForm payload */
export const startSessionSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  visitorType: z.enum(['tourist', 'research', 'child']),
  ageGroup: z.enum(['under18', 'above18']).nullable().optional(),
  education: z.string().min(1).max(64),
  museumId: z.string().min(1).optional(),
  language: z.string().min(2).max(16).optional().default('en'),
});

export const updateProfileSchema = z
  .object({
    fullName: z.string().trim().min(2).max(80).optional(),
    visitorType: z.enum(['tourist', 'research', 'child']).optional(),
    ageGroup: z.enum(['under18', 'above18']).nullable().optional(),
    education: z.string().min(1).max(64).optional(),
    language: z.string().min(2).max(16).optional(),
    interests: z.array(z.string().min(1)).max(20).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one profile field is required',
  });

export const recordEventSchema = z
  .object({
    type: z.enum(['ARTIFACT_VIEW', 'QR_SCAN', 'GALLERY_ENTER']),
    artifactId: z.string().min(1).optional(),
    galleryId: z.string().min(1).optional(),
    qrCode: z.string().min(1).optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'ARTIFACT_VIEW' && !data.artifactId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'artifactId is required for ARTIFACT_VIEW',
        path: ['artifactId'],
      });
    }
    if (data.type === 'GALLERY_ENTER' && !data.galleryId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'galleryId is required for GALLERY_ENTER',
        path: ['galleryId'],
      });
    }
    if (data.type === 'QR_SCAN' && !data.qrCode && !data.artifactId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'qrCode or artifactId is required for QR_SCAN',
        path: ['qrCode'],
      });
    }
  });

export const recommendationsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
