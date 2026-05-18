/// <reference types="vitest" />
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test-setup.ts"],
      globals: true,
    },
  },
});
