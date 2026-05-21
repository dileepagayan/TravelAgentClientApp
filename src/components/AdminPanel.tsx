import { useEffect, useState } from "react";
import { KeyRound, Plus, ServerCog, Trash2, X } from "lucide-react";
import type { AppConfig } from "../lib/types";

interface AdminPanelProps {
  open: boolean;
  config: AppConfig;
  onClose: () => void;
  onSave: (next: AppConfig) => void;
}

export function AdminPanel({ open, config, onClose, onSave }: AdminPanelProps) {
  const [serverUrl, setServerUrl] = useState(config.serverUrl);
  const [authToken, setAuthToken] = useState(config.authToken);
  const [agentEmails, setAgentEmails] = useState<string[]>(config.agentEmails);
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setServerUrl(config.serverUrl);
      setAuthToken(config.authToken);
      setAgentEmails(config.agentEmails);
      setNewEmail("");
      setEmailError(null);
    }
  }, [open, config]);

  const handleAddEmail = () => {
    const candidate = newEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate)) {
      setEmailError("Enter a valid email address.");
      return;
    }
    if (agentEmails.includes(candidate)) {
      setEmailError("That email is already in the list.");
      return;
    }
    setAgentEmails([...agentEmails, candidate]);
    setNewEmail("");
    setEmailError(null);
  };

  const handleRemove = (email: string) => {
    setAgentEmails(agentEmails.filter((e) => e !== email));
  };

  const handleSave = () => {
    onSave({
      serverUrl: serverUrl.trim() || config.serverUrl,
      authToken: authToken.trim(),
      agentEmails: agentEmails.length > 0 ? agentEmails : config.agentEmails
    });
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md transform flex-col bg-white shadow-2xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
              <ServerCog className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Admin Settings</h3>
              <p className="text-[11px] text-slate-500">Stored locally in your browser</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <section>
            <SectionLabel icon={<ServerCog className="h-3.5 w-3.5" />} title="Backend" />
            <label className="mt-2 block text-xs font-medium text-slate-600">
              Server base URL
            </label>
            <input
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              placeholder="https://gateway.example.com/travelagent/travel-agent-api-service/v1.0"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              The client appends <code>/itinerary</code> when sending requests. Use{" "}
              <code>/api/...</code> to route through the built-in Express proxy (no CORS).
            </p>
          </section>

          <section>
            <SectionLabel icon={<KeyRound className="h-3.5 w-3.5" />} title="Authorization" />
            <label className="mt-2 block text-xs font-medium text-slate-600">
              Bearer token <span className="text-slate-400">(optional, future use)</span>
            </label>
            <input
              type="password"
              value={authToken}
              onChange={(e) => setAuthToken(e.target.value)}
              placeholder="Paste a token to send as Authorization: Bearer …"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </section>

          <section>
            <SectionLabel
              icon={<Plus className="h-3.5 w-3.5" />}
              title="Consultant email list (in-memory)"
            />
            <div className="mt-2 flex gap-2">
              <input
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value);
                  setEmailError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddEmail();
                  }
                }}
                placeholder="new.consultant@travelco.com"
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
              <button
                type="button"
                onClick={handleAddEmail}
                className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </button>
            </div>
            {emailError && <p className="mt-1 text-xs text-rose-500">{emailError}</p>}

            <ul className="mt-3 space-y-1.5">
              {agentEmails.map((email) => (
                <li
                  key={email}
                  className="group flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                >
                  <span className="truncate">{email}</span>
                  <button
                    type="button"
                    onClick={() => handleRemove(email)}
                    className="opacity-0 transition group-hover:opacity-100"
                    aria-label={`Remove ${email}`}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-rose-400 hover:text-rose-600" />
                  </button>
                </li>
              ))}
              {agentEmails.length === 0 && (
                <li className="rounded-md border border-dashed border-slate-300 bg-white px-3 py-3 text-center text-xs text-slate-400">
                  No consultants configured. Add at least one.
                </li>
              )}
            </ul>
          </section>
        </div>

        <footer className="border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={handleSave}
            className="w-full rounded-lg bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glow hover:shadow-lg"
          >
            Save settings
          </button>
        </footer>
      </aside>
    </>
  );
}

function SectionLabel({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
      {icon}
      {title}
    </div>
  );
}
