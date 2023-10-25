import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      devOptions: {
        enabled: true, // For making sure that the PWA is testable from the Local dev environment
      },
      registerType: "autoUpdate",
      manifest: {
        name: "Sport Center",
        short_name: "Sport Center",
        icons: [
          {
            src: "./src/assets/images/favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon",
          },
          {
            src: "./src/assets/images/favicon-16x16.png",
            type: "image/png",
            sizes: "16x16",
          },
          {
            src: "./src/assets/images/favicon-32x32.png",
            type: "image/png",
            sizes: "32x32",
          },
          {
            src: "./src/assets/images/android-launchericon-192-192.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "./src/assets/images/android-launchericon-512-512.png",
            type: "image/png",
            sizes: "512x512",
            purpose: "any maskable", // Icon format that ensures that your PWA icon looks great on all Android devices
          },
        ],
        theme_color: "#AAF",
      },
    }),
  ],
});
