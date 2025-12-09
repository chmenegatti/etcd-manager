export interface EtcdEntry {
  key: string;
  value: string;
  version: number;
  createRevision: number;
  modRevision: number;
}

export interface ConnectionStatus {
  connected: boolean;
  endpoint: string;
}
