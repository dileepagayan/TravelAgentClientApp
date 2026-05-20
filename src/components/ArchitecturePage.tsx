import {
  Bot,
  Boxes,
  CheckCircle2,
  KeyRound,
  Layers,
  Network,
  ShieldCheck,
  Workflow
} from "lucide-react";
import { ArchitectureDiagram } from "./ArchitectureDiagram";

export function ArchitecturePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 pb-16 pt-2">
      <section className="mb-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          <Network className="h-3.5 w-3.5" />
          The story behind the demo
        </span>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
          One assistant. Three planes.
          <span className="block bg-gradient-to-r from-brand-600 to-sunset-500 bg-clip-text text-transparent">
            All composable.
          </span>
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
          The travel agency assistant is composed from three independently-managed planes —
          a public <strong>API plane</strong>, a private <strong>integration plane</strong>,
          and a governed <strong>AI plane</strong>. Each one has its own ownership boundary,
          its own security policies, and its own observability story.
        </p>
      </section>

      <div className="grid gap-3 md:grid-cols-3">
        <PillarCard
          accent="from-brand-500 to-brand-600"
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Bijira API Gateway"
          subtitle="Public-facing security perimeter"
          bullets={[
            "Auth, rate limits, throttling, audit",
            "Single public URL — TLS terminated",
            "Versioned APIs, lifecycle managed"
          ]}
        />
        <PillarCard
          accent="from-violet-500 to-violet-700"
          icon={<Boxes className="h-5 w-5" />}
          title="Devant Control Plane"
          subtitle="Where the integration logic runs"
          bullets={[
            "Two Ballerina BI services deployed",
            "Service-to-service composition",
            "Observability + tracing built-in"
          ]}
        />
        <PillarCard
          accent="from-sunset-400 to-sunset-600"
          icon={<Bot className="h-5 w-5" />}
          title="Bijira AI Gateway"
          subtitle="LLM + MCP governance"
          bullets={[
            "Owns provider keys — apps don't",
            "Mediates every LLM + tool call",
            "Per-key quotas, cost ceilings"
          ]}
        />
      </div>

      <section className="mt-8">
        <ArchitectureDiagram />
        <p className="mt-2 text-center text-xs text-slate-500">
          Tip: hover or click any node to focus on its connections.
        </p>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass rounded-2xl p-6 shadow-xl shadow-brand-500/5">
          <div className="mb-4 flex items-center gap-2">
            <Workflow className="h-4 w-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">Request flow</h3>
          </div>
          <ol className="space-y-3">
            <Step
              n={1}
              color="brand"
              title="Client submits to the API gateway"
              body="The React UI POSTs the travel request to the Bijira API Gateway. TLS, auth, throttling, and audit happen here. No service URL is ever exposed publicly."
            />
            <Step
              n={2}
              color="brand"
              title="API gateway forwards to Devant"
              body="Bijira proxies the request to the Travel Agent service running on the Devant control plane."
            />
            <Step
              n={3}
              color="violet"
              title="Agent retrieves packages from Pinecone (RAG)"
              body="The agent embeds the request and queries the vector store for the best-fit internal travel package — grounded answers, no hallucinated package names."
            />
            <Step
              n={4}
              color="sunset"
              title="LLM calls go through the AI gateway"
              body="The agent calls a Bijira-managed LLM endpoint, not OpenAI directly. The gateway owns the provider key, logs prompts, enforces quotas, and abstracts the model."
            />
            <Step
              n={5}
              color="sunset"
              title="MCP tools are accessed via the AI gateway"
              body="The agent invokes getWeatherImpact and findTravelPlaces through the AI Gateway's MCP proxy, which forwards to the MCP Tools service on Devant."
            />
            <Step
              n={6}
              color="violet"
              title="MCP service calls real-world APIs"
              body="Open-Meteo for weather, Geoapify for places. The agent never holds these keys — only the MCP service does."
            />
            <Step
              n={7}
              color="violet"
              title="Two emails dispatched"
              body="A warm customer itinerary and an internal prospect summary, sent via SMTP. The audience watches both land in real time."
            />
          </ol>
        </div>

        <div className="space-y-4">
          <ValueCard
            icon={<KeyRound className="h-4 w-4" />}
            title="No secret lives in the app"
            body="OpenAI, Geoapify, and SMTP keys are all owned by the AI gateway or the MCP service — never by the application code."
          />
          <ValueCard
            icon={<Layers className="h-4 w-4" />}
            title="Clean separation of concerns"
            body="Swap the model, switch vector stores, or add a new MCP tool without touching the API contract. Each plane changes independently."
          />
          <ValueCard
            icon={<CheckCircle2 className="h-4 w-4" />}
            title="Observability everywhere"
            body="Devant traces the BI services. Bijira API Gateway shows external traffic. Bijira AI Gateway shows every LLM and tool call, with cost and latency."
          />
        </div>
      </section>

      <section className="mt-10 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-sunset-500 p-[1px] shadow-glow">
        <div className="rounded-2xl bg-white px-6 py-6">
          <h3 className="text-base font-bold text-slate-900">Why this story matters</h3>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Traditional architectures bundle the API gateway, the integration runtime, and
            the AI provider into one tangled layer. Bijira and Devant split them apart so
            each team — platform, integration, and AI — can move at its own pace, under
            its own governance, without stepping on the others. That's the WSO2 promise:
            <span className="font-semibold text-slate-900">
              {" "}
              composable, governed, production-ready AI integration.
            </span>
          </p>
        </div>
      </section>
    </main>
  );
}

function PillarCard({
  accent,
  icon,
  title,
  subtitle,
  bullets
}: {
  accent: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  bullets: string[];
}) {
  return (
    <div className="glass relative overflow-hidden rounded-2xl p-5 shadow-lg shadow-brand-500/5">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
      <div className="flex items-center gap-2">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${accent} text-white shadow-sm`}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          <p className="text-[11px] text-slate-500">{subtitle}</p>
        </div>
      </div>
      <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-1.5">
            <span className="mt-1 h-1 w-1 rounded-full bg-slate-400" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Step({
  n,
  color,
  title,
  body
}: {
  n: number;
  color: "brand" | "violet" | "sunset";
  title: string;
  body: string;
}) {
  const palette = {
    brand: "bg-brand-100 text-brand-700 ring-brand-200",
    violet: "bg-violet-100 text-violet-700 ring-violet-200",
    sunset: "bg-orange-100 text-orange-700 ring-orange-200"
  }[color];

  return (
    <li className="flex gap-3">
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-1 ${palette}`}
      >
        {n}
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-0.5 text-xs text-slate-600">{body}</p>
      </div>
    </li>
  );
}

function ValueCard({
  icon,
  title,
  body
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="glass rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 text-brand-700">
        {icon}
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
      </div>
      <p className="mt-1.5 text-xs text-slate-600">{body}</p>
    </div>
  );
}
