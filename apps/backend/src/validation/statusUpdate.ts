import { z } from 'zod';
import { CreditRequestStatus } from '@credit-request-system/shared';

export const statusUpdateSchema = z.object({
  status: z.nativeEnum(CreditRequestStatus),
  reason: z.string().max(1000).optional()
});

export type StatusUpdate = z.infer<typeof statusUpdateSchema>;
