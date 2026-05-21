import { useState } from "react";
import { CalendarDays, DollarSign, Mail, MapPin, Send, UserRound } from "lucide-react";
import { InterestSelector } from "./InterestSelector";
import { POPULAR_DESTINATIONS } from "../data/seedData";
import type { Interest, TravelRequest } from "../lib/types";

interface ItineraryFormProps {
  agentEmails: string[];
  submitting: boolean;
  onSubmit: (req: TravelRequest) => void;
}

const today = () => new Date().toISOString().split("T")[0];

export function ItineraryForm({ agentEmails, submitting, onSubmit }: ItineraryFormProps) {
  const [destination, setDestination] = useState("Las Vegas");
  const [travelDate, setTravelDate] = useState(today());
  const [budget, setBudget] = useState<number>(2000);
  const [interests, setInterests] = useState<Interest[]>(["romantic", "shows", "food"]);
  const [clientEmail, setClientEmail] = useState("");
  const [agentEmail, setAgentEmail] = useState(agentEmails[0] ?? "");
  const [errors, setErrors] = useState<Partial<Record<keyof TravelRequest, string>>>({});

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!destination.trim()) next.destination = "Destination is required.";
    if (!travelDate) next.travelDate = "Pick a travel date.";
    if (!budget || budget <= 0) next.budget = "Budget must be greater than zero.";
    if (interests.length === 0) next.interests = "Choose at least one interest.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail))
      next.clientEmail = "Enter a valid client email.";
    if (!agentEmail) next.agentEmail = "Pick an agent.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      destination: destination.trim(),
      travelDate,
      budget: Number(budget),
      interests,
      clientEmail: clientEmail.trim(),
      agentEmail
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass relative overflow-hidden rounded-2xl p-6 shadow-xl shadow-brand-500/5"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 via-sunset-500 to-brand-500" />

      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">New Itinerary Request</h2>
          <p className="text-xs text-slate-500">
            Fill in the customer's preferences. The agent handles the rest.
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Client email"
          icon={<Mail className="h-4 w-4" />}
          error={errors.clientEmail}
        >
          <input
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            placeholder="jane@example.com"
            className={inputClass(!!errors.clientEmail)}
          />
        </Field>

        <Field
          label="Assigned travel consultant"
          icon={<UserRound className="h-4 w-4" />}
          error={errors.agentEmail}
        >
          <select
            value={agentEmail}
            onChange={(e) => setAgentEmail(e.target.value)}
            className={selectClass(!!errors.agentEmail)}
          >
            {agentEmails.length === 0 && <option value="">No consultants configured</option>}
            {agentEmails.map((email) => (
              <option key={email} value={email}>
                {email}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Destination"
          icon={<MapPin className="h-4 w-4" />}
          error={errors.destination}
        >
          <input
            list="destinations"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Las Vegas"
            className={inputClass(!!errors.destination)}
          />
          <datalist id="destinations">
            {POPULAR_DESTINATIONS.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </Field>

        <Field
          label="Travel date"
          icon={<CalendarDays className="h-4 w-4" />}
          error={errors.travelDate}
        >
          <input
            type="date"
            min={today()}
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            className={inputClass(!!errors.travelDate)}
          />
        </Field>

        <Field
          label="Budget (USD)"
          icon={<DollarSign className="h-4 w-4" />}
          error={errors.budget}
        >
          <input
            type="number"
            min={0}
            step={50}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className={inputClass(!!errors.budget)}
          />
        </Field>

        <div className="md:col-span-2">
          <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Interests
          </label>
          <InterestSelector value={interests} onChange={setInterests} />
          {errors.interests && (
            <p className="mt-2 text-xs text-rose-500">{errors.interests}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-200 pt-5">
        <p className="text-xs text-slate-500">
          Submitting will email the customer and the assigned consultant.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className={`h-4 w-4 ${submitting ? "animate-pulse" : ""}`} />
          {submitting ? "Generating itinerary…" : "Generate itinerary"}
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  icon,
  error,
  children
}: {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {icon}
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-rose-500">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-2 ${
    hasError
      ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
      : "border-slate-200 focus:border-brand-400 focus:ring-brand-100"
  }`;
}

function selectClass(hasError: boolean) {
  return inputClass(hasError);
}
