import express from 'express';
import pino from 'pino';
import { config } from '../config.js';

const router = express.Router();
const logger = pino({ level: config.logging.level });

// Get all online ads (public listings)
router.get('/online', async (req, res, next) => {
  try {
    const { coin, fiat, side } = req.query;
    // TODO: Call Bybit P2P API to get online ads
    res.json({ ads: [] });
  } catch (error) {
    next(error);
  }
});

// Get user's personal ads
router.get('/my-ads', async (req, res, next) => {
  try {
    // TODO: Call P2P API with user credentials
    res.json({ ads: [] });
  } catch (error) {
    next(error);
  }
});

// Get ad details
router.get('/:adId', async (req, res, next) => {
  try {
    const { adId } = req.params;
    // TODO: Fetch ad details
    res.json({ ad: {} });
  } catch (error) {
    next(error);
  }
});

// Create new ad
router.post('/', async (req, res, next) => {
  try {
    const { coin, side, quantity, price } = req.body;
    // TODO: Create ad via P2P API
    res.status(201).json({ ad: {} });
  } catch (error) {
    next(error);
  }
});

// Update ad
router.put('/:adId', async (req, res, next) => {
  try {
    const { adId } = req.params;
    // TODO: Update ad
    res.json({ ad: {} });
  } catch (error) {
    next(error);
  }
});

// Cancel ad
router.delete('/:adId', async (req, res, next) => {
  try {
    const { adId } = req.params;
    // TODO: Cancel ad
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
