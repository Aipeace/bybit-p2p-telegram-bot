import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  debug: process.env.DEBUG === 'true',

  // Telegram
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,

  // Bybit
  bybit: {
    apiKey: process.env.BYBIT_API_KEY || '',
    apiSecret: process.env.BYBIT_API_SECRET || '',
    testnet: process.env.BYBIT_TESTNET === 'true',
    domain: process.env.BYBIT_DOMAIN || 'com',
    tld: process.env.BYBIT_TLD || 'com'
  },

  // Database
  database: {
    path: process.env.DB_PATH || './data/users.db',
    encryptKey: process.env.DB_ENCRYPT_KEY || 'default_secret_key_change_me'
  },

  // CORS
  cors: {
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
    allowedMethods: (process.env.ALLOWED_METHODS || 'GET,POST,PUT,DELETE,OPTIONS').split(',')
  },

  // Session
  session: {
    expiryHours: parseInt(process.env.SESSION_EXPIRY_HOURS) || 24,
    refreshThresholdHours: parseInt(process.env.SESSION_REFRESH_THRESHOLD_HOURS) || 1
  },

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/app.log'
  }
};

export default config;
