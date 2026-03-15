import { Router, Request, Response } from 'express';
import { logger } from '../logger';

const router = Router();

// This is a local simulated external webhook endpoint for development/testing only.
router.post('/webhook', async (req: Request, res: Response) => {
  logger.info({ body: req.body }, 'mock-external.webhook.received');
  res.json({ ok: true, received: true });
});

export default router;
