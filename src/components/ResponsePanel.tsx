import { AlertCircle, CheckCircle2, Loader2, Mailbox, Sparkles } from "lucide-react";
import type { ItineraryResponse, TravelRequest } from "../lib/types";

export interface ResponseEntry {
  id: string;
  request: TravelRequest;
  response?: ItineraryResponse;
  error?: string;
  inFlight: boolean;
  createdAt: number;
}

interface ResponsePanelProps {
  entries: ResponseEntry[];
}

export function ResponsePanel({ entries }: ResponsePanelProps) {
  return (
    <aside className="glass flex h-full flex-col rounded-2xl p-6 shadow-xl shadow-brand-500/5">
      <div className="mb-4 flex items-center gap-2">
        <Mailbox className="h-4 w-4 text-brand-600" />
        <h3 className="text-sm font-bold text-slate-900">Recent activity</h3>
      </div>

      {entries.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="flex-1 space-y-3 overflow-y-auto pr-1">
          {entries.map((entry) => (
            <li key={entry.id} className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-start gap-2">
                <StatusIcon entry={entry} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {entry.request.destination}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(entry.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="truncate text-xs text-slate-500">
                    {entry.request.clientEmail} → {entry.request.agentEmail}
                  </p>
                  <Body entry={entry} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

function StatusIcon({ entry }: { entry: ResponseEntry }) {
  if (entry.inFlight) {
    return <Loader2 className="mt-0.5 h-4 w-4 animate-spin text-brand-500" />;
  }
  if (entry.error) {
    return <AlertCircle className="mt-0.5 h-4 w-4 text-rose-500" />;
  }
  return <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />;
}

function Body({ entry }: { entry: ResponseEntry }) {
  if (entry.inFlight) {
    return (
      <p className="mt-1 text-xs text-slate-500">
        Agent is running RAG retrieval, calling MCP tools, and composing emails…
      </p>
    );
  }
  if (entry.error) {
    return <p className="mt-1 text-xs text-rose-500">{entry.error}</p>;
  }
  return (
    <p className="mt-1 text-xs text-emerald-600">
      {entry.response?.message ?? "Itinerary generated successfully."}
    </p>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-10 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500/15 to-sunset-500/15 text-brand-700">
        <Sparkles className="h-5 w-5" />
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-700">No requests yet</p>
      <p className="mt-1 text-xs text-slate-500">
        Submit a request and the agent's response will land here.
      </p>
    </div>
  );
}
