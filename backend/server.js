import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pino from 'pino';

import { initDB } from './db.js';
import authRoutes from './routes/auth.js';
import adsRoutes from './routes/ads.js';
import ordersRoutes from './routes/orders.js';
import userRoutes from './routes/user.js';
import chatRoutes from './routes/chat.js';
import { authMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

// Initialize database
await initDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info({ method: req.method, path: req.path, ip: req.ip });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes (public)
app.use('/api/auth', authRoutes);

// Protected routes (require authentication)
app.use('/api/ads', authMiddleware, adsRoutes);
app.use('/api/orders', authMiddleware, ordersRoutes);
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/chat', authMiddleware, chatRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, process.env.HOST || '0.0.0.0', () => {
  logger.info(`✅ Server running on http://0.0.0.0:${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
  logger.info(`Testnet: ${process.env.BYBIT_TESTNET === 'true' ? 'Yes' : 'No'}`);
});

export default app;
