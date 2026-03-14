import { createWorker } from './connection';
import { QueueNames } from './jobTypes';
import { auditLogsRepository } from '../repositories/auditLogsRepository';
import { outboxRepository } from '../repositories/outboxRepository';
import { logger } from '../logger';
import type { Insertable } from 'kysely';
import type { Database } from '../db/types';

async function processor(job: { id: string; name: string; data: unknown }) {
  const data = job.data as { outboxId: string; payload: unknown } | undefined;
  if (!data || typeof data.outboxId !== 'string') {
    logger.error({ job }, 'worker.invalid_job_payload');
    // skip processing invalid job
    return;
  }
  const { outboxId, payload } = data;

  try {
    const entry: Insertable<Database['audit_logs']> = {
      credit_request_id: (payload as any)?.credit_request_id ?? null,
      event_type: job.name,
      payload: payload as unknown,
      created_at: new Date().toISOString()
    } as unknown as Insertable<Database['audit_logs']>;

    await auditLogsRepository.create(entry);
    await outboxRepository.markProcessed(outboxId);
    logger.info({ outboxId, job: job.name }, 'job.processed');
  } catch (err) {
    logger.error({ err, outboxId }, 'job.failed');
    try {
      await outboxRepository.markFailed(outboxId);
    } catch (e) {
      logger.error({ err: e, outboxId }, 'outbox.markFailed.error');
    }
    throw err;
  }
}

export async function startWorker(concurrency = 2) {
  const worker = await createWorker(QueueNames.CREDIT_EVENTS, processor, concurrency);
  logger.info({ concurrency }, 'worker.started');
  return worker;
}

if (require.main === module) {
  (async () => {
    try {
      const w = await startWorker(Number(process.env.WORKER_CONCURRENCY || '2'));
      // keep process alive
      process.on('SIGINT', async () => {
        await w.close();
        process.exit(0);
      });
    } catch (err) {
      logger.error({ err }, 'worker.failure');
      process.exit(1);
    }
  })();
}
