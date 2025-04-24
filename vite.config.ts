import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mime from 'mime';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'add-avif-mime',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = (req as any).url || '';
          if (url && url.endsWith('.avif')) {
            res.setHeader('Content-Type', mime.getType('.avif') || 'image/avif');
          }
          next();
        });
      },
    },
  ],
})
