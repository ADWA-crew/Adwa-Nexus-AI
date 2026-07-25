import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { checkDatabaseConnection } from './config/database.js';
import { success } from './utils/apiResponse.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import visitorRoutes from './routes/visitor.routes.js';
import artifactRoutes from './routes/artifact.routes.js';
import museumRoutes from './routes/museum.routes.js';
import routeRoutes from './routes/route.routes.js';
import galleryRoutes from './routes/gallery.routes.js';
import qrRoutes from './routes/qr.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import adminRoutes from './routes/admin.routes.js';
import aiRoutes from './routes/ai.routes.js';
import reportRoutes from './routes/report.routes.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/api/health', async (req, res, next) => {
  try {
    await checkDatabaseConnection();
    return success(res, {
      status: 'ok',
      service: 'adwa-nexus-api',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/v1/health', async (req, res, next) => {
  try {
    await checkDatabaseConnection();
    return success(res, {
      status: 'ok',
      service: 'adwa-nexus-api',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return next(error);
  }
});

/* Versioned visitor APIs used by Start Journey */
app.use('/api/v1/visitors', visitorRoutes);

/* Frontend axios baseURL is /api — mount resource routes there */
app.use('/api/visitors', visitorRoutes);
app.use('/api/museums', museumRoutes);
app.use('/api/artifacts', artifactRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/galleries', galleryRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reports', reportRoutes);

/* Also expose under /api/v1 for consistency */
app.use('/api/v1/museums', museumRoutes);
app.use('/api/v1/artifacts', artifactRoutes);
app.use('/api/v1/routes', routeRoutes);
app.use('/api/v1/galleries', galleryRoutes);
app.use('/api/v1/qr', qrRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/reports', reportRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
