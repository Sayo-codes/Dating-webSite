import type { ModelSummary } from "@/lib/types/model";

export function getFeaturedModels(): ModelSummary[] {
  return [
    { name: "Eva", status: "online", tags: ["VIP", "New"] },
    { name: "Jessie", status: "online", tags: ["VIP"] },
    { name: "Queen", status: "offline", tags: ["Popular"] },
    { name: "Luna", status: "online", tags: ["Top Rated", "Fast Reply"] },
    { name: "Aria", status: "online", tags: ["New", "Verified Face"] },
    { name: "Mila", status: "offline", tags: ["VIP"] },
    { name: "Scarlett", status: "online", tags: ["Exclusive", "VIP"] },
  ];
}

