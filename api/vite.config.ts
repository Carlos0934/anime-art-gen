import { defineConfig } from "vitest/config";
import path from "path";
export default defineConfig({
  test: {
    setupFiles: ["dotenv/config"],
    exclude: ["node_modules"],
  },

  resolve: {
    alias: {
      "@/core": path.resolve(__dirname, "src/modules/core"),
      "@/auth": path.resolve(__dirname, "src/modules/auth"),
      "@/payment": path.resolve(__dirname, "src/modules/payment"),
    },
  },
});
