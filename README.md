# Travel Agency AI Studio — Client UI

A polished React + TypeScript demo client for the Travel Agency AI Assistant (WSO2 BI + Devant + Bijira). Travel agents can submit itinerary requests, pick from preconfigured agent emails, and watch the AI agent respond in real time.

Built as a presentation companion for **WSO2Con North America 2026**.

## Features

- Beautiful form with multi-select interest chips, destination suggestions, agent dropdown
- Live response panel showing each request's status (in-flight, success, error)
- Slide-in **Admin Panel** to configure server URL, future bearer token, and in-memory agent email list
- Settings persist in `localStorage` — no backend, no database
- Tailwind-powered design with brand gradient, glassmorphism, subtle animations

## Stack

- Vite 5 · React 18 · TypeScript 5
- Tailwind CSS 3 · lucide-react icons

## Quick start

```bash
cd travel-agent-client
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

## Configuration

Open the **Admin** button in the top-right to configure:

| Field | Purpose |
|---|---|
| **Server base URL** | Base URL of the API gateway. Defaults to `/api/travelagent/travel-agent-api-service/v1.0`, which is rewritten by the Vite dev proxy to the EC2 gateway (`https://ec2-18-118-107-166.us-east-2.compute.amazonaws.com:8443`). The client appends `/itinerary` dynamically when sending requests. Change in `vite.config.ts` to point at a different gateway. |
| **Bearer token** | Optional. If provided, sent as `Authorization: Bearer <token>` on every request. Use when Bijira API gateway enforces auth. |
| **Agent email list** | Add/remove agents shown in the form dropdown. Stored in browser memory only. |

The client POSTs to `{serverUrl}/itinerary` with the JSON body:

```json
{
  "destination": "Las Vegas",
  "travelDate": "2026-05-20",
  "budget": 2000,
  "interests": ["romantic", "shows", "food"],
  "clientEmail": "jane@example.com",
  "agentEmail": "alex.morgan@travelco.com"
}
```

## Build for production

```bash
npm run build
npm run preview
```

The build output lives in `dist/` — drop it into any static host or behind the Bijira API gateway.
