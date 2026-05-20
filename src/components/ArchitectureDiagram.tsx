import { useMemo, useState } from "react";
import {
  Bot,
  Brain,
  Cloud,
  Cpu,
  Database,
  Globe2,
  Mail,
  Monitor,
  Plug,
  ShieldCheck,
  Wrench,
  type LucideIcon
} from "lucide-react";

type Variant = "client" | "apigw" | "devant" | "aigw" | "ext";

interface NodeDef {
  id: string;
  x: number;
  y: number;
  label: string;
  sub: string;
  Icon: LucideIcon;
  variant: Variant;
}

interface ConnDef {
  from: string;
  to: string;
  step?: number;
  variant: "brand" | "violet" | "sunset" | "ext";
  curveOffset?: number;
}

const NODES: NodeDef[] = [
  { id: "client", x: 90, y: 360, label: "Travel Agent UI", sub: "React client", Icon: Monitor, variant: "client" },
  { id: "apigw", x: 290, y: 360, label: "Bijira API Gateway", sub: "Auth · Throttle · Audit", Icon: ShieldCheck, variant: "apigw" },
  { id: "travelagent", x: 580, y: 250, label: "Travel Agent Service", sub: "Ballerina · on Devant", Icon: Bot, variant: "devant" },
  { id: "mcpsvc", x: 580, y: 540, label: "MCP Tools Service", sub: "Ballerina · on Devant", Icon: Wrench, variant: "devant" },
  { id: "llmproxy", x: 880, y: 290, label: "LLM Provider", sub: "Bijira AI Gateway", Icon: Brain, variant: "aigw" },
  { id: "mcpproxy", x: 880, y: 430, label: "MCP Server Proxy", sub: "Bijira AI Gateway", Icon: Plug, variant: "aigw" },
  { id: "pinecone", x: 1110, y: 110, label: "Pinecone", sub: "Vector store", Icon: Database, variant: "ext" },
  { id: "openai", x: 1110, y: 290, label: "OpenAI", sub: "gpt-4o-mini", Icon: Cpu, variant: "ext" },
  { id: "openmeteo", x: 1110, y: 430, label: "Open-Meteo", sub: "Weather + Geocode", Icon: Cloud, variant: "ext" },
  { id: "geoapify", x: 1110, y: 560, label: "Geoapify", sub: "Places", Icon: Globe2, variant: "ext" },
  { id: "gmail", x: 1110, y: 660, label: "Gmail SMTP", sub: "Email delivery", Icon: Mail, variant: "ext" }
];

const CONNECTIONS: ConnDef[] = [
  { from: "client", to: "apigw", step: 1, variant: "brand" },
  { from: "apigw", to: "travelagent", step: 2, variant: "brand" },
  { from: "travelagent", to: "pinecone", step: 3, variant: "violet" },
  { from: "travelagent", to: "llmproxy", step: 4, variant: "sunset" },
  { from: "llmproxy", to: "openai", variant: "ext" },
  { from: "travelagent", to: "mcpproxy", step: 5, variant: "sunset" },
  { from: "mcpproxy", to: "mcpsvc", variant: "sunset", curveOffset: 80 },
  { from: "mcpsvc", to: "openmeteo", step: 6, variant: "violet" },
  { from: "mcpsvc", to: "geoapify", variant: "violet" },
  { from: "travelagent", to: "gmail", step: 7, variant: "violet", curveOffset: 120 }
];

const NODE_BY_ID: Record<string, NodeDef> = Object.fromEntries(NODES.map((n) => [n.id, n]));

const VARIANT_STYLES: Record<
  Variant,
  { gradient: string; ring: string; bg: string }
> = {
  client: {
    gradient: "from-slate-500 to-slate-700",
    ring: "ring-slate-200",
    bg: "bg-slate-100"
  },
  apigw: {
    gradient: "from-sky-500 to-sky-700",
    ring: "ring-sky-200",
    bg: "bg-sky-100"
  },
  devant: {
    gradient: "from-violet-500 to-violet-700",
    ring: "ring-violet-200",
    bg: "bg-violet-100"
  },
  aigw: {
    gradient: "from-orange-500 to-orange-600",
    ring: "ring-orange-200",
    bg: "bg-orange-100"
  },
  ext: {
    gradient: "from-emerald-500 to-emerald-700",
    ring: "ring-emerald-200",
    bg: "bg-emerald-100"
  }
};

const STROKE_BY_VARIANT: Record<ConnDef["variant"], string> = {
  brand: "#0ea5e9",
  violet: "#8b5cf6",
  sunset: "#f97316",
  ext: "#10b981"
};

const NODE_DETAILS: Record<string, { title: string; body: string }> = {
  client: {
    title: "Travel Agent UI",
    body: "React + TypeScript client (this app). Sends the customer request to the API gateway and renders live status."
  },
  apigw: {
    title: "Bijira API Gateway",
    body: "Public security perimeter on AWS. Owns the public TLS URL, enforces auth and rate limits, and audits every external call."
  },
  travelagent: {
    title: "Travel Agent Service",
    body: "Ballerina BI service on Devant. Hosts the AI agent, runs RAG retrieval, orchestrates MCP tools, and dispatches emails."
  },
  mcpsvc: {
    title: "MCP Tools Service",
    body: "Ballerina BI service on Devant. Exposes getWeatherImpact and findTravelPlaces as MCP tools. Owns the Geoapify key."
  },
  llmproxy: {
    title: "LLM Provider Proxy",
    body: "Bijira AI Gateway component. Owns the OpenAI key, applies per-key quotas, logs prompts, and abstracts the model provider."
  },
  mcpproxy: {
    title: "MCP Server Proxy",
    body: "Bijira AI Gateway component. Governs every MCP tool call from the agent and forwards to the Devant-hosted MCP service."
  },
  pinecone: {
    title: "Pinecone",
    body: "Vector store holding the agency's package knowledge base. Queried directly by the agent for RAG retrieval."
  },
  openai: {
    title: "OpenAI",
    body: "gpt-4o-mini for reasoning and text-embedding-3-small for embeddings. Reached only through the AI Gateway."
  },
  openmeteo: {
    title: "Open-Meteo",
    body: "Free weather + geocoding API. Called by the MCP service to drive weather-aware itinerary scheduling."
  },
  geoapify: {
    title: "Geoapify Places",
    body: "Real-world points-of-interest. Called by the MCP service to find attractions matching the customer's interests."
  },
  gmail: {
    title: "Gmail SMTP",
    body: "Outbound email channel. The agent sends two HTML emails — a customer itinerary and an internal prospect summary."
  }
};

function connectedSet(activeId: string | null): Set<string> {
  if (!activeId) return new Set();
  const set = new Set<string>([activeId]);
  for (const c of CONNECTIONS) {
    if (c.from === activeId) set.add(c.to);
    if (c.to === activeId) set.add(c.from);
  }
  return set;
}

function pathFor(conn: ConnDef): string {
  const a = NODE_BY_ID[conn.from];
  const b = NODE_BY_ID[conn.to];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const offset = conn.curveOffset ?? Math.max(50, Math.abs(dx) * 0.4);
  // Bezier curve: control points pull horizontally
  const c1x = a.x + offset;
  const c1y = a.y;
  const c2x = b.x - offset;
  const c2y = b.y;
  return `M ${a.x} ${a.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${b.x} ${b.y}`;
}

export function ArchitectureDiagram() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const active = hovered ?? selected;
  const connected = useMemo(() => connectedSet(active), [active]);

  return (
    <div className="glass overflow-hidden rounded-2xl p-3 shadow-xl shadow-brand-500/5">
      {/* Diagram */}
      <div
        className="relative w-full select-none"
        style={{ aspectRatio: "1200 / 720" }}
        onClick={() => setSelected(null)}
      >
        {/* Zones (Devant + AI Gateway) */}
        <Zone
          xPct={(460 / 1200) * 100}
          yPct={(160 / 720) * 100}
          wPct={(280 / 1200) * 100}
          hPct={(500 / 720) * 100}
          title="Devant"
          subtitle="Control plane"
          color="violet"
        />
        <Zone
          xPct={(800 / 1200) * 100}
          yPct={(230 / 720) * 100}
          wPct={(180 / 1200) * 100}
          hPct={(280 / 720) * 100}
          title="Bijira AI Gateway"
          subtitle="LLM + MCP governance"
          color="sunset"
        />

        {/* SVG connections */}
        <svg
          viewBox="0 0 1200 720"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <defs>
            {CONNECTIONS.map((c, i) => {
              const id = `path-${i}`;
              return (
                <path key={id} id={id} d={pathFor(c)} fill="none" />
              );
            })}
          </defs>

          {CONNECTIONS.map((c, i) => {
            const id = `path-${i}`;
            const stroke = STROKE_BY_VARIANT[c.variant];
            const isActive =
              active && (c.from === active || c.to === active);
            const dim = active && !isActive;
            return (
              <g
                key={`conn-${i}`}
                style={{
                  opacity: dim ? 0.18 : 1,
                  transition: "opacity 200ms ease"
                }}
              >
                <use
                  href={`#${id}`}
                  stroke={stroke}
                  strokeOpacity={isActive ? 0.9 : 0.45}
                  strokeWidth={isActive ? 3 : 1.6}
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Animated particle */}
                <circle r={isActive ? 5 : 3.5} fill={stroke}>
                  <animateMotion
                    dur={`${isActive ? 1.8 : 3.2}s`}
                    repeatCount="indefinite"
                    rotate="auto"
                  >
                    <mpath href={`#${id}`} />
                  </animateMotion>
                </circle>
                {/* Step badge */}
                {c.step !== undefined && (
                  <StepBadge conn={c} stroke={stroke} />
                )}
              </g>
            );
          })}
        </svg>

        {/* HTML node layer */}
        {NODES.map((n) => (
          <NodeButton
            key={n.id}
            node={n}
            active={active === n.id}
            dim={active !== null && !connected.has(n.id)}
            selected={selected === n.id}
            onEnter={() => setHovered(n.id)}
            onLeave={() => setHovered(null)}
            onClick={(e) => {
              e.stopPropagation();
              setSelected((cur) => (cur === n.id ? null : n.id));
            }}
          />
        ))}

        {/* Legend */}
        <div className="absolute bottom-3 left-4 flex flex-wrap items-center gap-3 rounded-full bg-white/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider shadow-sm">
          <LegendDot color="#0ea5e9" label="API plane" />
          <LegendDot color="#8b5cf6" label="Control plane" />
          <LegendDot color="#f97316" label="AI plane" />
          <LegendDot color="#10b981" label="External" />
        </div>
      </div>

      {/* Detail card */}
      <div className="mt-3">
        <DetailCard nodeId={active} />
      </div>
    </div>
  );
}

function NodeButton({
  node,
  active,
  dim,
  selected,
  onEnter,
  onLeave,
  onClick
}: {
  node: NodeDef;
  active: boolean;
  dim: boolean;
  selected: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClick: (e: React.MouseEvent) => void;
}) {
  const styles = VARIANT_STYLES[node.variant];
  const Icon = node.Icon;
  return (
    <button
      type="button"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
      style={{
        left: `${(node.x / 1200) * 100}%`,
        top: `${(node.y / 720) * 100}%`,
        opacity: dim ? 0.35 : 1,
        transition: "opacity 200ms ease, transform 200ms ease",
        transform: `translate(-50%, -50%) scale(${active ? 1.08 : 1})`
      }}
    >
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${styles.gradient} text-white shadow-lg ring-4 ${styles.ring} ${
          active ? "shadow-2xl" : ""
        } ${selected ? "outline outline-2 outline-offset-2 outline-slate-900/60" : ""}`}
        style={{
          boxShadow: active
            ? `0 0 0 6px rgba(255,255,255,0.6), 0 12px 36px -8px ${STROKE_BY_VARIANT[node.variant === "client" ? "brand" : node.variant === "apigw" ? "brand" : node.variant === "devant" ? "violet" : node.variant === "aigw" ? "sunset" : "ext"]}`
            : undefined
        }}
      >
        <Icon className="h-6 w-6" />
      </span>
      <span className="rounded-md bg-white/85 px-2 py-0.5 text-[11px] font-bold text-slate-900 shadow-sm whitespace-nowrap">
        {node.label}
      </span>
      <span className="text-[10px] text-slate-500 whitespace-nowrap">{node.sub}</span>
    </button>
  );
}

function Zone({
  xPct,
  yPct,
  wPct,
  hPct,
  title,
  subtitle,
  color
}: {
  xPct: number;
  yPct: number;
  wPct: number;
  hPct: number;
  title: string;
  subtitle: string;
  color: "violet" | "sunset";
}) {
  const palette =
    color === "violet"
      ? {
          border: "border-violet-300",
          chip: "bg-violet-100 text-violet-700",
          glow: "shadow-[0_0_60px_-20px_rgba(139,92,246,0.5)]"
        }
      : {
          border: "border-orange-300",
          chip: "bg-orange-100 text-orange-700",
          glow: "shadow-[0_0_60px_-20px_rgba(249,115,22,0.5)]"
        };
  return (
    <div
      className={`absolute rounded-3xl border-2 border-dashed ${palette.border} ${palette.glow}`}
      style={{
        left: `${xPct}%`,
        top: `${yPct}%`,
        width: `${wPct}%`,
        height: `${hPct}%`,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.25))",
        backdropFilter: "blur(6px)"
      }}
    >
      <div
        className={`absolute -top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm ${palette.chip}`}
      >
        <span>{title}</span>
        <span className="opacity-60">·</span>
        <span className="font-medium normal-case tracking-normal">{subtitle}</span>
      </div>
    </div>
  );
}

function StepBadge({ conn, stroke }: { conn: ConnDef; stroke: string }) {
  const a = NODE_BY_ID[conn.from];
  const b = NODE_BY_ID[conn.to];
  const cx = (a.x + b.x) / 2;
  const cy = (a.y + b.y) / 2 - 16;
  return (
    <g>
      <circle cx={cx} cy={cy} r="13" fill="white" stroke={stroke} strokeWidth="2" />
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fontSize="12"
        fontWeight="800"
        fill={stroke}
      >
        {conn.step}
      </text>
    </g>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-slate-600">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

function DetailCard({ nodeId }: { nodeId: string | null }) {
  if (!nodeId) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-3 text-xs text-slate-500">
        Hover or click any node to see what it does.
      </div>
    );
  }
  const node = NODE_BY_ID[nodeId];
  const detail = NODE_DETAILS[nodeId];
  const styles = VARIANT_STYLES[node.variant];
  const Icon = node.Icon;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${styles.gradient} text-white shadow-sm`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-900">{detail.title}</p>
        <p className="mt-0.5 text-xs text-slate-600">{detail.body}</p>
      </div>
    </div>
  );
}
