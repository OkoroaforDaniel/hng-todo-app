import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5174,
    // Anything the React app calls with "/api/..." is forwarded to FastAPI,
    // so the browser only ever talks to one address and CORS never matters.
    proxy: {
      "/api": "http://127.0.0.1:8001",
    },
  },
});
