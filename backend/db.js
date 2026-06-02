import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';
import pino from 'pino';
import { config } from './config.js';

const logger = pino({ level: config.logging.level });
let db = null;

export async function initDB() {
  try {
    // Ensure data directory exists
    await mkdir(dirname(config.database.path), { recursive: true });

    db = await open({
      filename: config.database.path,
      driver: sqlite3.Database
    });

    await db.exec('PRAGMA journal_mode = WAL');
    await db.exec('PRAGMA foreign_keys = ON');

    // Create tables
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        telegram_id INTEGER UNIQUE,
        username TEXT,
        bybit_api_key TEXT,
        bybit_api_secret TEXT,
        session_token TEXT UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_active TIMESTAMP,
        is_active INTEGER DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        bybit_session_data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS user_settings (
        user_id TEXT PRIMARY KEY,
        notifications_enabled INTEGER DEFAULT 1,
        auto_release_orders INTEGER DEFAULT 0,
        preferred_currency TEXT DEFAULT 'USDT',
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
    `);

    logger.info('✅ Database initialized successfully');
    return db;
  } catch (error) {
    logger.error({ error }, 'Database initialization failed');
    throw error;
  }
}

export async function getDB() {
  if (!db) {
    await initDB();
  }
  return db;
}

// User operations
export async function createUser(userId, telegramId, username) {
  const database = await getDB();
  try {
    await database.run(
      `INSERT INTO users (id, telegram_id, username, last_active)
       VALUES (?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(id) DO UPDATE SET last_active = CURRENT_TIMESTAMP`,
      [userId, telegramId, username]
    );
    logger.info({ userId, telegramId }, 'User created/updated');
  } catch (error) {
    logger.error({ error, userId }, 'Failed to create user');
    throw error;
  }
}

export async function getUserByTelegramId(telegramId) {
  const database = await getDB();
  try {
    return await database.get(
      'SELECT * FROM users WHERE telegram_id = ?',
      [telegramId]
    );
  } catch (error) {
    logger.error({ error, telegramId }, 'Failed to get user');
    throw error;
  }
}

export async function getUserById(userId) {
  const database = await getDB();
  try {
    return await database.get(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );
  } catch (error) {
    logger.error({ error, userId }, 'Failed to get user');
    throw error;
  }
}

export async function updateUserCredentials(userId, apiKey, apiSecret) {
  const database = await getDB();
  try {
    await database.run(
      `UPDATE users SET bybit_api_key = ?, bybit_api_secret = ?, last_active = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [apiKey, apiSecret, userId]
    );
    logger.info({ userId }, 'User credentials updated');
  } catch (error) {
    logger.error({ error, userId }, 'Failed to update credentials');
    throw error;
  }
}

// Session operations
export async function createSession(token, userId, expiryHours = 24) {
  const database = await getDB();
  try {
    const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000).toISOString();
    await database.run(
      `INSERT INTO sessions (token, user_id, created_at, expires_at)
       VALUES (?, ?, CURRENT_TIMESTAMP, ?)`,
      [token, userId, expiresAt]
    );
    return { token, expiresAt };
  } catch (error) {
    logger.error({ error, userId }, 'Failed to create session');
    throw error;
  }
}

export async function getSession(token) {
  const database = await getDB();
  try {
    const session = await database.get(
      `SELECT * FROM sessions WHERE token = ? AND expires_at > datetime('now')`,
      [token]
    );
    return session;
  } catch (error) {
    logger.error({ error, token }, 'Failed to get session');
    throw error;
  }
}

export async function deleteSession(token) {
  const database = await getDB();
  try {
    await database.run('DELETE FROM sessions WHERE token = ?', [token]);
  } catch (error) {
    logger.error({ error, token }, 'Failed to delete session');
    throw error;
  }
}

// Cleanup expired sessions
export async function cleanupExpiredSessions() {
  const database = await getDB();
  try {
    await database.run("DELETE FROM sessions WHERE expires_at < datetime('now')");
  } catch (error) {
    logger.error({ error }, 'Failed to cleanup sessions');
  }
}
