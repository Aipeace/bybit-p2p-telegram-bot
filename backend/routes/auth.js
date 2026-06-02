import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createUser, getUserByTelegramId, createSession, updateUserCredentials, getSession, getUserById } from '../db.js';
import { config } from '../config.js';
import pino from 'pino';

const router = express.Router();
const logger = pino({ level: config.logging.level });

// Register/Login with Bybit credentials
router.post('/login', async (req, res, next) => {
  try {
    const { telegram_id, username, api_key, api_secret, testnet } = req.body;

    if (!telegram_id || !api_key || !api_secret) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get or create user
    let user = await getUserByTelegramId(telegram_id);
    const userId = user?.id || uuidv4();

    if (!user) {
      await createUser(userId, telegram_id, username);
    }

    // Update credentials
    await updateUserCredentials(userId, api_key, api_secret);

    // Create session
    const token = uuidv4();
    const session = await createSession(token, userId, config.session.expiryHours);

    logger.info({ userId, telegram_id }, 'User logged in');

    res.json({
      success: true,
      token: session.token,
      expires_at: session.expiresAt,
      user_id: userId
    });
  } catch (error) {
    logger.error({ error }, 'Login failed');
    next(error);
  }
});

// Logout
router.post('/logout', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      // In production, delete the session
      // await deleteSession(token);
    }
    res.json({ success: true, message: 'Logged out' });
  } catch (error) {
    next(error);
  }
});

// Check authentication status
router.get('/status', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.json({ authenticated: false });
    }

    const session = await getSession(token);
    if (!session) {
      return res.json({ authenticated: false });
    }

    const user = await getUserById(session.user_id);
    res.json({
      authenticated: true,
      user_id: user.id,
      username: user.username,
      telegram_id: user.telegram_id,
      expires_at: session.expires_at
    });
  } catch (error) {
    next(error);
  }
});

export default router;
