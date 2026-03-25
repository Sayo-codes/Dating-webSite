export type ModelStatus = "online" | "offline";

export interface ModelSummary {
  name: string;
  status: ModelStatus;
  tags: string[];
  /** Seed / browse username for profile & links */
  username: string;
  location: string;
  age: number;
  imageUrl: string;
}
