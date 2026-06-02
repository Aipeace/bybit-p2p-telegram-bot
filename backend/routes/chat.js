import express from 'express';
import pino from 'pino';
import { config } from '../config.js';

const router = express.Router();
const logger = pino({ level: config.logging.level });

// Get chat messages
router.get('/:orderId/messages', async (req, res, next) => {
  try {
    const { orderId } = req.params;
    // TODO: Fetch chat messages
    res.json({ messages: [] });
  } catch (error) {
    next(error);
  }
});

// Send chat message
router.post('/:orderId/messages', async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { message } = req.body;
    // TODO: Send message via P2P API
    res.status(201).json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Upload chat file
router.post('/:orderId/files/upload', async (req, res, next) => {
  try {
    const { orderId } = req.params;
    // TODO: Upload file to P2P API
    res.status(201).json({ fileUrl: '' });
  } catch (error) {
    next(error);
  }
});

export default router;
