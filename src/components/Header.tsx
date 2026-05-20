import { Network, Plane, Settings, Sparkles, Wand2 } from "lucide-react";
import type { PageKey } from "../App";

interface HeaderProps {
  page: PageKey;
  onChangePage: (page: PageKey) => void;
  onOpenAdmin: () => void;
}

export function Header({ page, onChangePage, onOpenAdmin }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 glass border-b border-slate-200/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-sunset-500 shadow-glow">
            <Plane className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900">
                Travel Agency AI Studio
              </span>
              <span className="hidden rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-700 sm:inline">
                Beta
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Sparkles className="h-3 w-3" />
              <span>WSO2Con North America 2026 demo</span>
            </div>
          </div>
        </div>

        <nav className="hidden items-center gap-1 rounded-xl border border-slate-200 bg-white/80 p-1 md:flex">
          <NavTab
            active={page === "console"}
            icon={<Wand2 className="h-3.5 w-3.5" />}
            label="Console"
            onClick={() => onChangePage("console")}
          />
          <NavTab
            active={page === "architecture"}
            icon={<Network className="h-3.5 w-3.5" />}
            label="Architecture"
            onClick={() => onChangePage("architecture")}
          />
        </nav>

        <button
          type="button"
          onClick={onOpenAdmin}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-300 hover:bg-white hover:text-brand-700"
        >
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Admin</span>
        </button>
      </div>
    </header>
  );
}

function NavTab({
  active,
  icon,
  label,
  onClick
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
