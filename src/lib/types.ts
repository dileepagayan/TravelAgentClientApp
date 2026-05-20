export type Interest =
  | "romantic"
  | "relaxed"
  | "family"
  | "adventure"
  | "food"
  | "culture"
  | "music"
  | "nightlife"
  | "scenic"
  | "luxury"
  | "budget"
  | "shopping"
  | "shows"
  | "wellness"
  | "outdoors";

export interface TravelRequest {
  destination: string;
  travelDate: string;
  budget: number;
  interests: Interest[];
  clientEmail: string;
  agentEmail: string;
}

export interface ItineraryResponse {
  status: string;
  message: string;
  destination?: string;
  [key: string]: unknown;
}

export interface AppConfig {
  serverUrl: string;
  authToken: string;
  agentEmails: string[];
}
