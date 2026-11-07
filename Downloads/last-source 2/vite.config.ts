import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { adminApiPlugin } from './server/admin/vite-plugin.mjs';

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), '');
  for (const [name, value] of Object.entries(environment)) {
    if (/^(SUPABASE_|VITE_SUPABASE_|ADMIN_|ND_ADMIN_|ND_GROWTH_|GOOGLE_PSI_KEY$|GOOGLE_CRUX_KEY$|SITE_URL$)/.test(name) && process.env[name] === undefined) process.env[name] = value;
  }
  return {
    build: { manifest: true },
    plugins: [adminApiPlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
