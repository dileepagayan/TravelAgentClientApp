import { Bot, Cloud, Globe2 } from "lucide-react";

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-10 pb-6">
      <div className="grid items-center gap-6 md:grid-cols-[1.4fr_1fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
            Live agentic AI
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
            Craft personalised itineraries
            <span className="block bg-gradient-to-r from-brand-600 to-sunset-500 bg-clip-text text-transparent">
              in under a minute.
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-slate-600 sm:text-base">
            An <span className="font-semibold text-slate-900">AI agent</span> built on{" "}
            <span className="font-semibold text-slate-900">WSO2 Ballerina Integrator</span>,
            deployed via the{" "}
            <span className="font-semibold text-slate-900">WSO2 Integration Platform</span>, and
            governed by the{" "}
            <span className="font-semibold text-slate-900">WSO2 API Platform</span>'s AI &
            API gateways. Travel consultants submit a customer request and watch the AI agent
            retrieve packages, check weather, find places, and email both the client and the
            consultant.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
          <StatPill icon={<Bot className="h-4 w-4" />} label="AI Agent" value="gpt-4o-mini" />
          <StatPill icon={<Globe2 className="h-4 w-4" />} label="Tools" value="MCP + RAG" />
          <StatPill icon={<Cloud className="h-4 w-4" />} label="Runtime" value="WSO2 Integration Platform" />
        </div>
      </div>
    </section>
  );
}

function StatPill({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="glass flex items-center gap-3 rounded-xl px-4 py-3 shadow-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500/15 to-sunset-500/15 text-brand-700">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider text-slate-500">{label}</span>
        <span className="text-sm font-semibold text-slate-800">{value}</span>
      </div>
    </div>
  );
}
