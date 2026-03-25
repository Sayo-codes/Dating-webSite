import type { ModelSummary } from "@/lib/types/model";

/** Mirrors seed avatars/locations so featured rail matches browse when DB is seeded. */
export function getFeaturedModels(): ModelSummary[] {
  return [
    {
      name: "Eva",
      status: "online",
      tags: ["VIP", "New"],
      username: "eva",
      location: "Los Angeles, CA",
      age: 24,
      imageUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop",
    },
    {
      name: "Jessie",
      status: "online",
      tags: ["VIP"],
      username: "jessie",
      location: "Miami, FL",
      age: 26,
      imageUrl:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop",
    },
    {
      name: "Luna",
      status: "online",
      tags: ["Top Rated", "Fast Reply"],
      username: "luna",
      location: "New York, NY",
      age: 23,
      imageUrl:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop",
    },
    {
      name: "Maya",
      status: "online",
      tags: ["Verified Face"],
      username: "maya",
      location: "Austin, TX",
      age: 25,
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
    },
    {
      name: "Zoe",
      status: "offline",
      tags: ["Popular"],
      username: "zoe",
      location: "Seattle, WA",
      age: 27,
      imageUrl:
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop",
    },
    {
      name: "Ivy",
      status: "online",
      tags: ["New"],
      username: "ivy",
      location: "Chicago, IL",
      age: 22,
      imageUrl:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop",
    },
    {
      name: "Ruby",
      status: "online",
      tags: ["Exclusive", "VIP"],
      username: "ruby",
      location: "Las Vegas, NV",
      age: 28,
      imageUrl:
        "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?w=400&h=500&fit=crop",
    },
  ];
}
