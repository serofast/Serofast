import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    watch: {
      ignored: [
        "**/Social_commerce/**",
        "**/.dart_tool/**",
        "**/build/**",
        "**/.flutter-plugins/**",
        "**/.flutter-plugins-dependencies/**",
        "**/serofast-interns/**",
      ],
    },
  },
});