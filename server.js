import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 8080;
const API_TARGET =
  process.env.API_TARGET ||
  "https://ec2-18-118-107-166.us-east-2.compute.amazonaws.com:8443";

// Proxy /api/* to the API gateway (server-to-server, accepts self-signed cert).
app.use(
  "/api",
  createProxyMiddleware({
    target: API_TARGET,
    changeOrigin: true,
    secure: false,
    pathRewrite: { "^/api": "" },
    logLevel: "warn"
  })
);

// Serve the React build.
const distDir = path.join(__dirname, "dist");
app.use(express.static(distDir));

// SPA fallback — every client-side route falls back to index.html.
app.get("*", (_req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`travel-agent-client listening on :${PORT}`);
  console.log(`/api/* proxied to ${API_TARGET}`);
});
