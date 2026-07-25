import express from 'express';
import cors from 'cors';
import './config/env.js';
import artifactRoutes from './routes/artifact.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'OK' });
});

// Yamini — Content APIs
app.use('/api/v1/artifacts', artifactRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
