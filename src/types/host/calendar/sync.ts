export enum SyncStatus {
  Failed = 'FAILED',
  Idle = 'IDLE',
  Queued = 'QUEUED',
  Running = 'RUNNING',
  Skipped = 'SKIPPED',
  Success = 'SUCCESS',
}

export interface SyncStatusResponse {
  finishedAt?: string;
  lastSyncedAt?: string;
  message?: string;
  queuedAt: string;
  startedAt?: string;
  status: SyncStatus;
}
