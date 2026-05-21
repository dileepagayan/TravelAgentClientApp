import type { AppConfig } from "./types";
import { DEFAULT_AGENT_EMAILS, DEFAULT_SERVER_URL } from "../data/seedData";

const STORAGE_KEY = "travel-agent-client::config::v5";

export function loadConfig(): AppConfig {
  if (typeof window === "undefined") {
    return defaultConfig();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultConfig();
    const parsed = JSON.parse(raw) as Partial<AppConfig>;
    return {
      serverUrl: parsed.serverUrl ?? DEFAULT_SERVER_URL,
      authToken: parsed.authToken ?? "",
      agentEmails:
        Array.isArray(parsed.agentEmails) && parsed.agentEmails.length > 0
          ? parsed.agentEmails
          : DEFAULT_AGENT_EMAILS
    };
  } catch {
    return defaultConfig();
  }
}

export function saveConfig(config: AppConfig): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

function defaultConfig(): AppConfig {
  return {
    serverUrl: DEFAULT_SERVER_URL,
    authToken: "",
    agentEmails: [...DEFAULT_AGENT_EMAILS]
  };
}
