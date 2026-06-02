import express from 'express';
import pino from 'pino';
import { config } from '../config.js';

const router = express.Router();
const logger = pino({ level: config.logging.level });

// Get account information
router.get('/info', async (req, res, next) => {
  try {
    // TODO: Fetch account info via P2P API
    res.json({ account: {} });
  } catch (error) {
    next(error);
  }
});

// Get counterparty info
router.get('/counterparty/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    // TODO: Fetch counterparty info
    res.json({ counterparty: {} });
  } catch (error) {
    next(error);
  }
});

// Get user payment methods
router.get('/payments', async (req, res, next) => {
  try {
    // TODO: Fetch payment methods
    res.json({ payments: [] });
  } catch (error) {
    next(error);
  }
});

// Get account balance
router.get('/balance', async (req, res, next) => {
  try {
    const { coin, accountType } = req.query;
    // TODO: Fetch balance
    res.json({ balance: {} });
  } catch (error) {
    next(error);
  }
});

export default router;
