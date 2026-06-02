import { getSession, getUserById } from '../db.js';
import pino from 'pino';

const logger = pino();

export async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const session = await getSession(token);
    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const user = await getUserById(session.user_id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!user.bybit_api_key || !user.bybit_api_secret) {
      return res.status(403).json({ error: 'User not authenticated with Bybit' });
    }

    // Attach to request
    req.user = user;
    req.session = session;
    req.token = token;

    next();
  } catch (error) {
    logger.error({ error }, 'Auth middleware error');
    res.status(500).json({ error: 'Authentication failed' });
  }
}
