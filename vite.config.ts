import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: { outDir: "dist/pxotitas-portfolio/browser", emptyOutDir: true },
  server: { host: "0.0.0.0" },
});
