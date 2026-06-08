import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackPlugin } from "@tanstack/react-start/vite";
import nitro from "nitro/config";

export default defineConfig({
  plugins: [
    tanstackPlugin(),
    react(),
    tailwindcss(),
    tsconfigPaths(),
    nitro(),
  ],
  server: {
    entry: "server",
  },
});
