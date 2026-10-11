import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // Transparent proxy to CashPay Shopping public API
  app.use('/api/cashpay-proxy', async (req, res) => {
    try {
      const targetUrl = `https://app.cashpay-all.com${req.url}`;
      const response = await fetch(targetUrl, {
        method: req.method,
        headers: {
          Accept: 'application/json',
        },
      });

      res.status(response.status);
      response.headers.forEach((val, key) => {
        // Don't forward transfer-encoding or content-encoding that might conflict
        if (!['transfer-encoding', 'content-encoding'].includes(key.toLowerCase())) {
          res.setHeader(key, val);
        }
      });

      const data = await response.text();
      res.send(data);
    } catch (err: any) {
      console.error('Proxy error:', err);
      res.status(502).json({ success: false, error: 'Proxy fetch failed', message: err.message });
    }
  });

  if (!isProd) {
    // Mount Vite middleware in development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static assets in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
