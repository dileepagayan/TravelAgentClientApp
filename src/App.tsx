import { useCallback, useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ItineraryForm } from "./components/ItineraryForm";
import { AdminPanel } from "./components/AdminPanel";
import { ResponsePanel, type ResponseEntry } from "./components/ResponsePanel";
import { Footer } from "./components/Footer";
import { ArchitecturePage } from "./components/ArchitecturePage";
import { loadConfig, saveConfig } from "./lib/config";
import { submitItinerary } from "./lib/api";
import type { AppConfig, TravelRequest } from "./lib/types";

export type PageKey = "console" | "architecture";

export default function App() {
  const [config, setConfig] = useState<AppConfig>(() => loadConfig());
  const [adminOpen, setAdminOpen] = useState(false);
  const [entries, setEntries] = useState<ResponseEntry[]>([]);
  const [page, setPage] = useState<PageKey>("console");

  useEffect(() => {
    saveConfig(config);
  }, [config]);

  const submitting = useMemo(() => entries.some((e) => e.inFlight), [entries]);

  const handleSubmit = useCallback(
    async (request: TravelRequest) => {
      const id = crypto.randomUUID();
      const entry: ResponseEntry = {
        id,
        request,
        inFlight: true,
        createdAt: Date.now()
      };
      setEntries((prev) => [entry, ...prev].slice(0, 8));

      try {
        const response = await submitItinerary(config, request);
        setEntries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, inFlight: false, response } : e))
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setEntries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, inFlight: false, error: message } : e))
        );
      }
    },
    [config]
  );

  return (
    <div className="min-h-screen">
      <Header
        page={page}
        onChangePage={setPage}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {page === "console" ? (
        <>
          <Hero />
          <main className="mx-auto grid max-w-7xl gap-6 px-6 pb-12 lg:grid-cols-[1.5fr_1fr]">
            <ItineraryForm
              agentEmails={config.agentEmails}
              submitting={submitting}
              onSubmit={handleSubmit}
            />
            <ResponsePanel entries={entries} />
          </main>
        </>
      ) : (
        <ArchitecturePage />
      )}

      <Footer />

      <AdminPanel
        open={adminOpen}
        config={config}
        onClose={() => setAdminOpen(false)}
        onSave={setConfig}
      />
    </div>
  );
}
