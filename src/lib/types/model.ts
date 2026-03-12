export type ModelStatus = "online" | "offline";

export interface ModelSummary {
  name: string;
  status: ModelStatus;
  tags: string[];
}

