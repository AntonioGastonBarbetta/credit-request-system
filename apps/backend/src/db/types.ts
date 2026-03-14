export type UUID = string;

export interface UsersTable {
  id: UUID;
  email: string;
  password_hash: string;
  created_at: string; // timestamp
  updated_at: string; // timestamp
}

export type CreditRequestStatus = 'PENDING' | 'UNDER_REVIEW' | 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export interface CreditRequestsTable {
  id: UUID;
  country_code: string;
  applicant_name: string;
  document_number: string;
  monthly_income: number;
  requested_amount: number;
  currency: string;
  status: CreditRequestStatus;
  bank_account_valid?: boolean;
  total_debt?: string; // numeric stored as string by pg
  decision_reason?: string | null;
  created_by_user_id: UUID;
  created_at: string;
  updated_at: string;
}

export interface StatusHistoryTable {
  id: UUID;
  credit_request_id: UUID;
  previous_status?: CreditRequestStatus | null;
  new_status: CreditRequestStatus;
  changed_by_user_id?: UUID | null;
  reason?: string | null;
  created_at: string;
}

export interface MigrationsTable {
  id: number;
  name: string;
  run_on: string;
}

export interface Database {
  users: UsersTable;
  credit_requests: CreditRequestsTable;
  status_history: StatusHistoryTable;
  migrations: MigrationsTable;
  outbox_events: {
    id: UUID;
    aggregate_type: string;
    aggregate_id: UUID;
    event_type: string;
    payload: string; // jsonb stored as string
    status: string;
    attempts: number;
    available_at: string;
    created_at: string;
    updated_at: string;
  };
  audit_logs: {
    id: UUID;
    credit_request_id?: UUID | null;
    event_type: string;
    payload: string;
    created_at: string;
  };
}
