import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permet l'accès depuis l'extérieur du conteneur Docker
    port: 5173, // On fixe le port pour correspondre à ton docker-compose
    watch: {
      usePolling: true, // Nécessaire pour que le "Hot Reload" fonctionne sur Windows/Docker
    },
  },
});
