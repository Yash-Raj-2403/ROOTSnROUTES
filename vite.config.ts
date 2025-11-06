import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  base: '/',
  publicDir: 'public',
  server: {
    host: "::",
    port: 8080,
  },
  preview: {
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      'three-dev': 'three'
    },
  },
  build: {
    rollupOptions: {
      external: ['three-dev', 'aframe', 'aframe-extras', 'aframe-core'],
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select', '@radix-ui/react-tabs'],
          'groq-ai': ['groq-sdk'],
          'supabase': ['@supabase/supabase-js'],
          'maps': ['leaflet', 'react-leaflet']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser' as const,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  optimizeDeps: {
    exclude: ['aframe', 'aframe-extras', 'aframe-core', 'three-dev']
  }
}));
