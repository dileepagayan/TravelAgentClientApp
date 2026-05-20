import type { Interest } from "../lib/types";

export const DEFAULT_AGENT_EMAILS: string[] = [
  "alex.morgan@travelco.com",
  "priya.sharma@travelco.com",
  "carlos.ramirez@travelco.com",
  "sophia.chen@travelco.com",
  "jamie.oconnor@travelco.com"
];

export const INTEREST_OPTIONS: { value: Interest; label: string; emoji: string }[] = [
  { value: "romantic", label: "Romantic", emoji: "💞" },
  { value: "relaxed", label: "Relaxed", emoji: "🌿" },
  { value: "family", label: "Family", emoji: "👨‍👩‍👧" },
  { value: "adventure", label: "Adventure", emoji: "🏔️" },
  { value: "food", label: "Food", emoji: "🍽️" },
  { value: "culture", label: "Culture", emoji: "🏛️" },
  { value: "music", label: "Music", emoji: "🎵" },
  { value: "nightlife", label: "Nightlife", emoji: "🌃" },
  { value: "scenic", label: "Scenic", emoji: "🌅" },
  { value: "luxury", label: "Luxury", emoji: "💎" },
  { value: "budget", label: "Budget", emoji: "💰" },
  { value: "shopping", label: "Shopping", emoji: "🛍️" },
  { value: "shows", label: "Shows", emoji: "🎭" },
  { value: "wellness", label: "Wellness", emoji: "🧘" },
  { value: "outdoors", label: "Outdoors", emoji: "🌲" }
];

export const POPULAR_DESTINATIONS: string[] = [
  "Las Vegas",
  "New York",
  "San Francisco",
  "Miami",
  "Austin",
  "Denver",
  "Chicago",
  "Seattle",
  "Honolulu",
  "Orlando"
];

export const DEFAULT_SERVER_URL =
  "/api/travelagent/travel-agent-api-service/v1.0";
