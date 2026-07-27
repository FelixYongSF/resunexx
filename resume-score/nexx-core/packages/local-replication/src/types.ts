export type ReplicationWatermark = Readonly<{
  receivedAt: string;
  eventId: string;
}>;

export type ReplicaEvent = Readonly<{
  eventId: string;
  receivedAt: string;
  eventName: string;
  payload: Readonly<Record<string, unknown>>;
}>;

export type ReplicaPaymentFact = Readonly<{
  providerEventId: string;
  receivedAt: string;
  factType: string;
  payload: Readonly<Record<string, unknown>>;
}>;

export type ReplicaPayload = Readonly<{
  exportedAt: string;
  registry: ReadonlyArray<Readonly<Record<string, unknown>>>;
  events: ReadonlyArray<ReplicaEvent>;
  paymentFacts: ReadonlyArray<ReplicaPaymentFact>;
  nextWatermark?: ReplicationWatermark;
}>;

export type ReplicationManifest = Readonly<{
  version: 1;
  exportId: string;
  createdAt: string;
  sourceEnvironment: "development" | "test" | "staging";
  previousWatermark?: ReplicationWatermark;
  nextWatermark?: ReplicationWatermark;
  eventCount: number;
  paymentFactCount?: number;
  registryCount: number;
  archiveFile: string;
  ciphertextSha256: string;
  manifestMac: string;
}>;

export type LocalReplicationResult = Readonly<{
  exportId: string;
  eventCount: number;
  paymentFactCount: number;
  registryCount: number;
  resumedPendingExport: boolean;
}>;
