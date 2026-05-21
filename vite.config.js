import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        host: true,
        proxy: {
            "/api": {
                target: "https://ec2-18-118-107-166.us-east-2.compute.amazonaws.com:8443",
                changeOrigin: true,
                secure: false,
                rewrite: function (path) { return path.replace(/^\/api/, ""); }
            }
        }
    }
});
