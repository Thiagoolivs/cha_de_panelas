import { defineConfig, devices } from "@playwright/test";

const PORT = 3200;

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "off",
    viewport: { width: 375, height: 812 },
  },
  projects: [
    { name: "fluxo", testMatch: /flow\.spec\.ts/, use: { ...devices["Desktop Chrome"], viewport: { width: 375, height: 812 } } },
    { name: "visual", testMatch: /visual\.spec\.ts/, use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
  },
});
