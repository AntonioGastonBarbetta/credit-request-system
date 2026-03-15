import { logger } from '../logger';
import { webhookDeliveriesRepository } from '../repositories/webhookDeliveriesRepository';
import type { Insertable } from 'kysely';
import type { Database } from '../db/types';

type WebhookPayload = {
  event_type: string;
  credit_request_id?: string | null;
  country_code?: string | null;
  current_status?: string | null;
  requested_amount?: number | null;
  monthly_income?: number | null;
  timestamp: string;
  metadata?: Record<string, unknown> | null;
};

async function httpPostJson(url: string, body: unknown, timeoutMs = 5000): Promise<{ status: number; bodyText: string }> {
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(url);
      const isHttps = urlObj.protocol === 'https:';
      const lib = isHttps ? require('https') : require('http');
      const data = JSON.stringify(body);
      const opts: any = {
        method: 'POST',
        hostname: urlObj.hostname,
        port: urlObj.port || (isHttps ? 443 : 80),
        path: urlObj.pathname + (urlObj.search || ''),
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      };
      const req = lib.request(opts, (res: any) => {
        const chunks: Buffer[] = [];
        res.on('data', (c: Buffer) => chunks.push(c));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          resolve({ status: res.statusCode || 0, bodyText: text });
        });
      });
      req.on('error', (err: Error) => reject(err));
      req.setTimeout(timeoutMs, () => {
        req.destroy(new Error('Request timed out'));
      });
      req.write(data);
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

export async function sendWebhookNotification(eventType: string, payload: WebhookPayload) {
  const target = process.env.WEBHOOK_TARGET_URL;
  const now = new Date().toISOString();

  const deliveryEntry: Insertable<Database['webhook_deliveries']> = {
    credit_request_id: payload.credit_request_id ?? null,
    event_type: eventType,
    target_url: target || '',
    request_payload: payload as unknown as object,
    response_status_code: null,
    response_body: null,
    delivery_status: 'PENDING',
    error_message: null,
    created_at: now,
    updated_at: now
  } as unknown as Insertable<Database['webhook_deliveries']>;

  const created = await webhookDeliveriesRepository.create(deliveryEntry);
  const deliveryId = created.id;

  if (!target) {
    const msg = 'WEBHOOK_TARGET_URL not configured';
    logger.warn({ deliveryId }, 'webhook.attempt_no_target');
    await webhookDeliveriesRepository.updateStatus(deliveryId, 'FAILED', null, null, msg);
    return;
  }

  try {
    logger.info({ deliveryId, target }, 'webhook.attempt');
    const res = await httpPostJson(target, payload);
    await webhookDeliveriesRepository.updateStatus(deliveryId, 'SUCCESS', res.status, res.bodyText, null);
    logger.info({ deliveryId, status: res.status }, 'webhook.success');
  } catch (err: any) {
    const errMsg = err?.message ?? String(err);
    logger.error({ deliveryId, err: errMsg }, 'webhook.failure');
    try {
      await webhookDeliveriesRepository.updateStatus(deliveryId, 'FAILED', null, null, errMsg);
    } catch (e) {
      logger.error({ err: e }, 'webhook.delivery_persist_failed');
    }
  }
}
