import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// Load settings from .env into process.env. Vite doesn't do this for its own config.
dotenv.config({ quiet: true });

// AiSEng lab-VM reverse-proxy convention: public URLs are
// https://<hostname>:<port> on ports 5000-5005 and 8100-8105.
// The port comes from VITE_PORT in .env, or 5000 if it isn't set.
const PORT = Number(process.env.VITE_PORT) || 5000;

export default defineConfig({
  plugins: [react()],
  css: {
    // GOV.UK Frontend's stylesheet contains old Internet Explorer-only hacks that
    // Vite's CSS minifier rejects. Modern browsers ignore them, so let it drop them.
    lightningcss: { errorRecovery: true },
  },
  server: {
    host: '0.0.0.0',
    port: PORT,
    strictPort: true,
    allowedHosts: [".labs.decoded.com"],
    // Live reload and its connection are off: the lab proxy drops Vite's
    // live-reload connection, and each drop made the page reload itself.
    // Refresh by hand after edits.
    hmr: false,
    ws: false,
  },
  // `npm run preview` has its own settings and would otherwise use port 4173,
  // which the lab proxy doesn't serve.
  preview: {
    host: '0.0.0.0',
    port: PORT,
    strictPort: true,
    allowedHosts: [".labs.decoded.com"],
  },
});
