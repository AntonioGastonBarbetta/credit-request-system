const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

type QueueWrapper = {
  add: (jobName: string, data: unknown, opts?: unknown) => Promise<unknown>;
  close: () => Promise<void>;
};

const queueCache = new Map<string, QueueWrapper>();

export async function getQueue(name: string): Promise<QueueWrapper> {
  const cached = queueCache.get(name);
  if (cached) return cached;

  const mod = (await import('bullmq')) as unknown;
  // runtime type: any-like, but we avoid 'any' in our code by treating imported module as unknown and narrowing
  const QueueCtor = (mod as any).Queue as unknown;
  // construct queue via dynamic constructor invocation
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const queueInstance = new (QueueCtor as any)(name, { connection: { url: REDIS_URL } });

  const wrapper: QueueWrapper = {
    add: (jobName: string, data: unknown, opts?: unknown) => {
      // call the underlying queue's add method
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return (queueInstance as unknown as { add: (n: string, d: unknown, o?: unknown) => Promise<unknown> }).add(jobName, data, opts);
    },
    close: async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await (queueInstance as unknown as { close: () => Promise<void> }).close();
      } catch (err) {
        // ignore close errors
      }
    }
  };

  queueCache.set(name, wrapper);
  return wrapper;
}

export async function createWorker(name: string, processor: (job: { id: string; name: string; data: unknown }) => Promise<void>, concurrency = 1) {
  const mod = (await import('bullmq')) as unknown;
  const WorkerCtor = (mod as any).Worker as unknown;
  // construct worker
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const workerInstance = new (WorkerCtor as any)(name, async (job: unknown) => {
    const j = job as unknown as { id: string; name: string; data: unknown };
    return processor({ id: j.id, name: j.name, data: j.data });
  }, { connection: { url: REDIS_URL }, concurrency });

  return workerInstance as { close: () => Promise<void> };
}
