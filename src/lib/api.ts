import type { AppConfig, ItineraryResponse, TravelRequest } from "./types";

export async function submitItinerary(
  config: AppConfig,
  payload: TravelRequest
): Promise<ItineraryResponse> {
  const baseUrl = config.serverUrl.replace(/\/$/, "");
  const url = `${baseUrl}/itinerary`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json"
  };
  if (config.authToken.trim().length > 0) {
    headers["Authorization"] = `Bearer ${config.authToken.trim()}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  const text = await response.text();
  let parsed: unknown;
  try {
    parsed = text ? JSON.parse(text) : {};
  } catch {
    parsed = { status: response.ok ? "success" : "error", message: text };
  }

  if (!response.ok) {
    const errorMessage =
      (parsed as { message?: string })?.message ?? `Request failed (${response.status})`;
    throw new Error(errorMessage);
  }

  return parsed as ItineraryResponse;
}
