export enum OutboxEventType {
  AUDIT_LOG_CREATED = 'AUDIT_LOG_CREATED',
  CREDIT_REQUEST_STATUS_CHANGED = 'CREDIT_REQUEST_STATUS_CHANGED'
}

export enum QueueNames {
  CREDIT_EVENTS = 'credit-events'
}
