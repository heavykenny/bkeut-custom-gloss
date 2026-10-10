/// <reference types="vitest" />
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { UserConfig } from "vite";

const testConfig = {
  environment: "jsdom",
  setupFiles: ["./src/test-setup.ts"],
  globals: true,
} satisfies NonNullable<UserConfig["test"]>;

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    test: testConfig,
  },
});
