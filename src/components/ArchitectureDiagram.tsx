import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  Brain,
  Cloud,
  Cpu,
  Database,
  Globe2,
  KeyRound,
  Mail,
  Monitor,
  Plug,
  RotateCcw,
  ShieldCheck,
  Wrench,
  type LucideIcon
} from "lucide-react";

type Variant = "client" | "apigw" | "devant" | "aigw" | "ext" | "auth";

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
  variant: "brand" | "violet" | "sunset" | "ext" | "auth";
  curveOffset?: number;
}

interface ZoneDef {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  subtitle: string;
  color: "violet" | "sunset";
  childNodes: string[];
}

const NODES: NodeDef[] = [
  { id: "client", x: 90, y: 360, label: "Travel Consultant UI", sub: "React client", Icon: Monitor, variant: "client" },
  { id: "apigw", x: 290, y: 360, label: "API Gateway", sub: "WSO2 API Platform", Icon: ShieldCheck, variant: "apigw" },
  { id: "travelagent", x: 580, y: 250, label: "AI Agent", sub: "Ballerina · on WSO2 Integration Platform", Icon: Bot, variant: "devant" },
  { id: "mcpsvc", x: 580, y: 540, label: "MCP Tools Service", sub: "Ballerina · on WSO2 Integration Platform", Icon: Wrench, variant: "devant" },
  { id: "llmproxy", x: 880, y: 330, label: "LLM Provider", sub: "WSO2 API Platform", Icon: Brain, variant: "aigw" },
  { id: "mcpproxy", x: 880, y: 460, label: "MCP Server Proxy", sub: "WSO2 API Platform", Icon: Plug, variant: "aigw" },
  { id: "pinecone", x: 1110, y: 110, label: "Pinecone", sub: "Vector store", Icon: Database, variant: "ext" },
  { id: "openai", x: 1110, y: 290, label: "OpenAI", sub: "gpt-4o-mini", Icon: Cpu, variant: "ext" },
  { id: "openmeteo", x: 1110, y: 430, label: "Open-Meteo", sub: "Weather + Geocode", Icon: Cloud, variant: "ext" },
  { id: "geoapify", x: 1110, y: 560, label: "Geoapify", sub: "Places", Icon: Globe2, variant: "ext" },
  { id: "gmail", x: 1110, y: 660, label: "Gmail SMTP", sub: "Email delivery", Icon: Mail, variant: "ext" },
  { id: "asgardeo", x: 890, y: 140, label: "Asgardeo", sub: "WSO2 · Token issuer", Icon: KeyRound, variant: "auth" }
];

const CONNECTIONS: ConnDef[] = [
  { from: "client", to: "apigw", variant: "brand" },
  { from: "apigw", to: "travelagent", variant: "brand" },
  { from: "travelagent", to: "pinecone", variant: "violet" },
  { from: "travelagent", to: "llmproxy", variant: "sunset" },
  { from: "llmproxy", to: "openai", variant: "ext" },
  { from: "travelagent", to: "mcpproxy", variant: "sunset" },
  { from: "mcpproxy", to: "mcpsvc", variant: "sunset", curveOffset: 80 },
  { from: "mcpsvc", to: "openmeteo", variant: "violet" },
  { from: "mcpsvc", to: "geoapify", variant: "violet" },
  { from: "travelagent", to: "gmail", variant: "violet", curveOffset: 120 },
  { from: "asgardeo", to: "llmproxy", variant: "auth", curveOffset: 50 },
  { from: "asgardeo", to: "mcpproxy", variant: "auth", curveOffset: 80 }
];

const ZONES: ZoneDef[] = [
  {
    id: "integration",
    x: 460,
    y: 160,
    w: 280,
    h: 500,
    title: "Integration Runtime",
    subtitle: "WSO2 Integration Platform",
    color: "violet",
    childNodes: ["travelagent", "mcpsvc"]
  },
  {
    id: "aigateway",
    x: 800,
    y: 270,
    w: 180,
    h: 260,
    title: "AI Gateway",
    subtitle: "WSO2 API Platform",
    color: "sunset",
    childNodes: ["llmproxy", "mcpproxy"]
  }
];

const NODE_BY_ID: Record<string, NodeDef> = Object.fromEntries(NODES.map((n) => [n.id, n]));

const VARIANT_STYLES: Record<
  Variant,
  { gradient: string; ring: string; bg: string }
> = {
  client: { gradient: "from-slate-500 to-slate-700", ring: "ring-slate-200", bg: "bg-slate-100" },
  apigw: { gradient: "from-sky-500 to-sky-700", ring: "ring-sky-200", bg: "bg-sky-100" },
  devant: { gradient: "from-violet-500 to-violet-700", ring: "ring-violet-200", bg: "bg-violet-100" },
  aigw: { gradient: "from-orange-500 to-orange-600", ring: "ring-orange-200", bg: "bg-orange-100" },
  ext: { gradient: "from-emerald-500 to-emerald-700", ring: "ring-emerald-200", bg: "bg-emerald-100" },
  auth: { gradient: "from-amber-400 to-amber-600", ring: "ring-amber-200", bg: "bg-amber-100" }
};

const STROKE_BY_VARIANT: Record<ConnDef["variant"], string> = {
  brand: "#0ea5e9",
  violet: "#8b5cf6",
  sunset: "#f97316",
  ext: "#10b981",
  auth: "#f59e0b"
};

const NODE_DETAILS: Record<string, { title: string; body: string }> = {
  client: {
    title: "Travel Consultant UI",
    body: "React + TypeScript client (this app). The human travel consultant uses it to submit a customer request to the API gateway and watch the AI agent respond."
  },
  apigw: {
    title: "API Gateway · WSO2 API Platform",
    body: "Public security perimeter on AWS. Owns the public TLS URL, enforces auth and rate limits, and audits every external call."
  },
  travelagent: {
    title: "AI Agent",
    body: "Ballerina BI service on the WSO2 Integration Platform. The autonomous AI agent runs RAG retrieval, orchestrates MCP tools, reasons over the customer request, and dispatches emails."
  },
  mcpsvc: {
    title: "MCP Tools Service",
    body: "Ballerina BI service on WSO2 Integration Platform. Exposes getWeatherImpact and findTravelPlaces as MCP tools. Owns the Geoapify key."
  },
  llmproxy: {
    title: "LLM Provider Proxy · WSO2 API Platform",
    body: "AI Gateway component. Owns the OpenAI key, applies per-key quotas, logs prompts, and abstracts the model provider."
  },
  mcpproxy: {
    title: "MCP Server Proxy · WSO2 API Platform",
    body: "AI Gateway component. Governs every MCP tool call from the agent and forwards to the WSO2 Integration Platform-hosted MCP service."
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
  },
  asgardeo: {
    title: "Asgardeo · Identity",
    body: "WSO2's identity-as-a-service. Issues OAuth tokens that the AI Gateway uses to securely invoke the LLM Provider and MCP Server Proxy."
  }
};

type Positions = Record<string, { x: number; y: number }>;
type ZonePositions = Record<string, { x: number; y: number }>;

const LAYOUT_STORAGE_KEY = "travel-agent-client::diagram-layout::v2";
const VIEWBOX_W = 1400;
const VIEWBOX_H = 860;
const SNAP_GRID = 10;
const DRAG_THRESHOLD = 3;

function defaultPositions(): Positions {
  return Object.fromEntries(NODES.map((n) => [n.id, { x: n.x, y: n.y }]));
}

function defaultZonePositions(): ZonePositions {
  return Object.fromEntries(ZONES.map((z) => [z.id, { x: z.x, y: z.y }]));
}

interface StoredLayout {
  nodes: Positions;
  zones: ZonePositions;
}

function loadLayout(): StoredLayout {
  if (typeof window === "undefined") {
    return { nodes: defaultPositions(), zones: defaultZonePositions() };
  }
  try {
    const raw = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (!raw) return { nodes: defaultPositions(), zones: defaultZonePositions() };
    const parsed = JSON.parse(raw) as Partial<StoredLayout>;
    return {
      nodes: { ...defaultPositions(), ...(parsed.nodes ?? {}) },
      zones: { ...defaultZonePositions(), ...(parsed.zones ?? {}) }
    };
  } catch {
    return { nodes: defaultPositions(), zones: defaultZonePositions() };
  }
}

function saveLayout(layout: StoredLayout): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layout));
  } catch {
    /* ignore storage errors */
  }
}

function snap(v: number): number {
  return Math.round(v / SNAP_GRID) * SNAP_GRID;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function connectedSet(activeId: string | null): Set<string> {
  if (!activeId) return new Set();
  const set = new Set<string>([activeId]);
  for (const c of CONNECTIONS) {
    if (c.from === activeId) set.add(c.to);
    if (c.to === activeId) set.add(c.from);
  }
  return set;
}

function pathBetween(
  a: { x: number; y: number },
  b: { x: number; y: number },
  curveOffset?: number
): string {
  const dx = b.x - a.x;
  const offset = curveOffset ?? Math.max(50, Math.abs(dx) * 0.4);
  const c1x = a.x + offset;
  const c1y = a.y;
  const c2x = b.x - offset;
  const c2y = b.y;
  return `M ${a.x} ${a.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${b.x} ${b.y}`;
}

export function ArchitectureDiagram() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const initialLayout = useMemo(() => loadLayout(), []);
  const [positions, setPositions] = useState<Positions>(initialLayout.nodes);
  const [zonePositions, setZonePositions] = useState<ZonePositions>(initialLayout.zones);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [draggingZoneId, setDraggingZoneId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const active = hovered ?? selected;
  const connected = useMemo(() => connectedSet(active), [active]);

  useEffect(() => {
    saveLayout({ nodes: positions, zones: zonePositions });
  }, [positions, zonePositions]);

  const handleReset = useCallback(() => {
    setPositions(defaultPositions());
    setZonePositions(defaultZonePositions());
  }, []);

  const startNodeDrag = useCallback(
    (e: React.PointerEvent, id: string) => {
      if (!containerRef.current) return;
      e.preventDefault();
      e.stopPropagation();

      const rect = containerRef.current.getBoundingClientRect();
      const scaleX = VIEWBOX_W / rect.width;
      const scaleY = VIEWBOX_H / rect.height;
      const startClientX = e.clientX;
      const startClientY = e.clientY;
      const startPos = positions[id] ?? { x: 0, y: 0 };
      let moved = false;

      const onMove = (ev: PointerEvent) => {
        const dx = (ev.clientX - startClientX) * scaleX;
        const dy = (ev.clientY - startClientY) * scaleY;
        if (!moved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
          moved = true;
          setDraggingId(id);
        }
        if (moved) {
          setPositions((prev) => ({
            ...prev,
            [id]: {
              x: clamp(startPos.x + dx, 30, VIEWBOX_W - 30),
              y: clamp(startPos.y + dy, 30, VIEWBOX_H - 30)
            }
          }));
        }
      };

      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);

        if (moved) {
          setPositions((prev) => {
            const cur = prev[id];
            return cur ? { ...prev, [id]: { x: snap(cur.x), y: snap(cur.y) } } : prev;
          });
        } else {
          setSelected((cur) => (cur === id ? null : id));
        }
        setDraggingId(null);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [positions]
  );

  const startZoneDrag = useCallback(
    (e: React.PointerEvent, zoneId: string) => {
      if (!containerRef.current) return;
      const zone = ZONES.find((z) => z.id === zoneId);
      if (!zone) return;
      e.preventDefault();
      e.stopPropagation();

      const rect = containerRef.current.getBoundingClientRect();
      const scaleX = VIEWBOX_W / rect.width;
      const scaleY = VIEWBOX_H / rect.height;
      const startClientX = e.clientX;
      const startClientY = e.clientY;
      const startZonePos = zonePositions[zoneId] ?? { x: zone.x, y: zone.y };
      const startChildPositions: Positions = {};
      zone.childNodes.forEach((nid) => {
        startChildPositions[nid] = positions[nid] ?? {
          x: NODE_BY_ID[nid]?.x ?? 0,
          y: NODE_BY_ID[nid]?.y ?? 0
        };
      });

      setDraggingZoneId(zoneId);

      const onMove = (ev: PointerEvent) => {
        const dx = (ev.clientX - startClientX) * scaleX;
        const dy = (ev.clientY - startClientY) * scaleY;

        const newZoneX = clamp(startZonePos.x + dx, 0, VIEWBOX_W - zone.w);
        const newZoneY = clamp(startZonePos.y + dy, 0, VIEWBOX_H - zone.h);
        const actualDx = newZoneX - startZonePos.x;
        const actualDy = newZoneY - startZonePos.y;

        setZonePositions((prev) => ({
          ...prev,
          [zoneId]: { x: newZoneX, y: newZoneY }
        }));

        setPositions((prev) => {
          const next = { ...prev };
          zone.childNodes.forEach((nid) => {
            const start = startChildPositions[nid];
            if (start) {
              next[nid] = {
                x: clamp(start.x + actualDx, 30, VIEWBOX_W - 30),
                y: clamp(start.y + actualDy, 30, VIEWBOX_H - 30)
              };
            }
          });
          return next;
        });
      };

      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);

        setZonePositions((prev) => {
          const cur = prev[zoneId];
          return cur ? { ...prev, [zoneId]: { x: snap(cur.x), y: snap(cur.y) } } : prev;
        });
        setPositions((prev) => {
          const next = { ...prev };
          zone.childNodes.forEach((nid) => {
            const cur = next[nid];
            if (cur) next[nid] = { x: snap(cur.x), y: snap(cur.y) };
          });
          return next;
        });
        setDraggingZoneId(null);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [positions, zonePositions]
  );

  return (
    <div className="glass overflow-hidden rounded-2xl p-3 shadow-xl shadow-brand-500/5">
      {/* Toolbar */}
      <div className="mb-2 flex items-center justify-between px-1">
        <p className="text-[11px] text-slate-500">
          Drag nodes individually · drag a zone chip to move a whole pane · click to focus
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
        >
          <RotateCcw className="h-3 w-3" />
          Reset layout
        </button>
      </div>

      {/* Diagram */}
      <div
        ref={containerRef}
        className="relative w-full select-none"
        style={{ aspectRatio: `${VIEWBOX_W} / ${VIEWBOX_H}` }}
        onClick={() => {
          if (!draggingId && !draggingZoneId) setSelected(null);
        }}
      >
        {/* Zones */}
        {ZONES.map((z) => {
          const pos = zonePositions[z.id] ?? { x: z.x, y: z.y };
          return (
            <Zone
              key={z.id}
              zoneId={z.id}
              x={pos.x}
              y={pos.y}
              w={z.w}
              h={z.h}
              title={z.title}
              subtitle={z.subtitle}
              color={z.color}
              dragging={draggingZoneId === z.id}
              onPointerDown={(e) => startZoneDrag(e, z.id)}
            />
          );
        })}

        {/* SVG connections */}
        <svg
          viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ zIndex: 5 }}
        >
          <defs>
            {CONNECTIONS.map((c, i) => {
              const a = positions[c.from];
              const b = positions[c.to];
              if (!a || !b) return null;
              return (
                <path
                  key={`def-${i}`}
                  id={`path-${i}`}
                  d={pathBetween(a, b, c.curveOffset)}
                  fill="none"
                />
              );
            })}
          </defs>

          {CONNECTIONS.map((c, i) => {
            const a = positions[c.from];
            const b = positions[c.to];
            if (!a || !b) return null;
            const stroke = STROKE_BY_VARIANT[c.variant];
            const isActive = active && (c.from === active || c.to === active);
            const dim = active && !isActive;
            return (
              <g
                key={`conn-${i}`}
                style={{ opacity: dim ? 0.18 : 1, transition: "opacity 200ms ease" }}
              >
                <use
                  href={`#path-${i}`}
                  stroke={stroke}
                  strokeOpacity={isActive ? 0.9 : 0.45}
                  strokeWidth={isActive ? 3 : 1.6}
                  fill="none"
                  strokeLinecap="round"
                />
                <circle r={isActive ? 5 : 3.5} fill={stroke}>
                  <animateMotion
                    dur={`${isActive ? 1.8 : 3.2}s`}
                    repeatCount="indefinite"
                    rotate="auto"
                  >
                    <mpath href={`#path-${i}`} />
                  </animateMotion>
                </circle>
              </g>
            );
          })}
        </svg>

        {/* HTML node layer */}
        {NODES.map((n) => {
          const pos = positions[n.id] ?? { x: n.x, y: n.y };
          return (
            <NodeButton
              key={n.id}
              node={n}
              x={pos.x}
              y={pos.y}
              active={active === n.id}
              dim={active !== null && !connected.has(n.id)}
              selected={selected === n.id}
              dragging={draggingId === n.id}
              onEnter={() => setHovered(n.id)}
              onLeave={() => setHovered(null)}
              onPointerDown={(e) => startNodeDrag(e, n.id)}
            />
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-3 left-4 flex flex-wrap items-center gap-3 rounded-full bg-white/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider shadow-sm">
          <LegendDot color="#0ea5e9" label="API plane" />
          <LegendDot color="#8b5cf6" label="Control plane" />
          <LegendDot color="#f97316" label="AI plane" />
          <LegendDot color="#f59e0b" label="Identity" />
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
  x,
  y,
  active,
  dim,
  selected,
  dragging,
  onEnter,
  onLeave,
  onPointerDown
}: {
  node: NodeDef;
  x: number;
  y: number;
  active: boolean;
  dim: boolean;
  selected: boolean;
  dragging: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onPointerDown: (e: React.PointerEvent) => void;
}) {
  const styles = VARIANT_STYLES[node.variant];
  const Icon = node.Icon;
  return (
    <div
      role="button"
      tabIndex={0}
      onPointerDown={onPointerDown}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5 ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{
        left: `${(x / VIEWBOX_W) * 100}%`,
        top: `${(y / VIEWBOX_H) * 100}%`,
        opacity: dim ? 0.35 : 1,
        transition: dragging
          ? "none"
          : "opacity 200ms ease, transform 200ms ease, left 200ms ease, top 200ms ease",
        transform: `translate(-50%, -50%) scale(${dragging ? 1.12 : active ? 1.08 : 1})`,
        touchAction: "none",
        zIndex: dragging ? 20 : 10
      }}
    >
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${styles.gradient} text-white shadow-lg ring-4 ${styles.ring} ${
          active ? "shadow-2xl" : ""
        } ${selected ? "outline outline-2 outline-offset-2 outline-slate-900/60" : ""}`}
      >
        <Icon className="h-6 w-6" />
      </span>
      <span className="rounded-md bg-white/85 px-2 py-0.5 text-[11px] font-bold text-slate-900 shadow-sm whitespace-nowrap">
        {node.label}
      </span>
      <span className="text-[10px] text-slate-500 whitespace-nowrap">{node.sub}</span>
    </div>
  );
}

function Zone({
  zoneId,
  x,
  y,
  w,
  h,
  title,
  subtitle,
  color,
  dragging,
  onPointerDown
}: {
  zoneId: string;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  subtitle: string;
  color: "violet" | "sunset";
  dragging: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
}) {
  const palette =
    color === "violet"
      ? {
          border: "border-violet-300",
          chip: "bg-violet-100 text-violet-700 hover:bg-violet-200",
          glow: "shadow-[0_0_60px_-20px_rgba(139,92,246,0.5)]",
          dragBorder: "border-violet-500"
        }
      : {
          border: "border-orange-300",
          chip: "bg-orange-100 text-orange-700 hover:bg-orange-200",
          glow: "shadow-[0_0_60px_-20px_rgba(249,115,22,0.5)]",
          dragBorder: "border-orange-500"
        };
  return (
    <div
      data-zone-id={zoneId}
      className={`absolute rounded-3xl border-2 border-dashed ${
        dragging ? palette.dragBorder : palette.border
      } ${palette.glow}`}
      style={{
        left: `${(x / VIEWBOX_W) * 100}%`,
        top: `${(y / VIEWBOX_H) * 100}%`,
        width: `${(w / VIEWBOX_W) * 100}%`,
        height: `${(h / VIEWBOX_H) * 100}%`,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.25))",
        backdropFilter: "blur(6px)",
        transition: dragging ? "none" : "left 200ms ease, top 200ms ease",
        pointerEvents: "none",
        zIndex: 1
      }}
    >
      <div
        onPointerDown={onPointerDown}
        className={`absolute -top-3 left-3 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm transition ${palette.chip} ${
          dragging ? "cursor-grabbing ring-2 ring-offset-1" : "cursor-grab"
        }`}
        style={{ pointerEvents: "auto", touchAction: "none", zIndex: 15 }}
        title="Drag to move this pane and its components"
      >
        <span>{title}</span>
        <span className="opacity-60">·</span>
        <span className="font-medium normal-case tracking-normal">{subtitle}</span>
      </div>
    </div>
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
        Hover, click, or drag any node. Drag a zone chip to move the whole pane.
      </div>
    );
  }
  const node = NODE_BY_ID[nodeId];
  const detail = NODE_DETAILS[nodeId];
  if (!node || !detail) return null;
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
