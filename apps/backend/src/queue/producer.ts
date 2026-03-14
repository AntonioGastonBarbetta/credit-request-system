import { outboxRepository } from '../repositories/outboxRepository';
import { getQueue } from './connection';
import { QueueNames } from './jobTypes';
import { logger } from '../logger';

export async function produceOnce(limit = 50) {
  const pending = await outboxRepository.listPending(limit);
  if (pending.length === 0) return 0;

  const queue = await getQueue(QueueNames.CREDIT_EVENTS);

  for (const ev of pending) {
    try {
      await queue.add(ev.event_type, { outboxId: ev.id, payload: ev.payload });
      await outboxRepository.markEnqueued(ev.id);
      logger.info({ outboxId: ev.id, event: ev.event_type }, 'outbox.enqueued');
    } catch (err) {
      logger.error({ err, outboxId: ev.id }, 'outbox.enqueue.failed');
    }
  }

  return pending.length;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runProducerDaemon() {
  const raw = process.env.OUTBOX_POLL_INTERVAL_MS;
  let interval = 1000;
  if (raw !== undefined) {
    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed > 0) interval = parsed;
  }

  logger.info({ interval }, 'producer.started');

  const queue = await getQueue(QueueNames.CREDIT_EVENTS);

  let running = true;

  const shutdown = async () => {
    if (!running) return;
    running = false;
    logger.info('producer.stopping');
    try {
      await queue.close();
    } catch (err) {
      logger.warn({ err }, 'producer.shutdown.close.queue.failed');
    }
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  while (running) {
    try {
      logger.info('producer.polling');
      const n = await produceOnce(100);
      logger.info({ events_found: n }, 'producer.events_found');
      if (n > 0) logger.info({ count: n }, 'producer.events_enqueued');
    } catch (err) {
      logger.error({ err }, 'producer.iteration_error');
    }

    if (!running) break;
    logger.info({ sleeping_ms: interval }, 'producer.sleeping');
    await sleep(interval);
  }

  logger.info('producer.stopped');
}

if (require.main === module) {
  (async () => {
    try {
      await runProducerDaemon();
      process.exit(0);
    } catch (err) {
      logger.error({ err }, 'producer.fatal');
      process.exit(1);
    }
  })();
}
