import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { parseArgs } from 'util';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import open from 'open';
import { handleTraces } from './otlp.js';
import { store } from './store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { values } = parseArgs({
  options: {
    port: { type: 'string', default: '4318' },
    'no-open': { type: 'boolean', default: false },
  },
  strict: false,
});

const port = parseInt(values.port || '4318', 10);
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

// Body parsing: accept raw bytes for all OTLP content types
app.use('/v1', express.raw({ type: '*/*', limit: '10mb' }));

app.post('/v1/traces', (req, res) => {
  try {
    const contentType = req.headers['content-type'] || '';
    const body = contentType.includes('application/json')
      ? JSON.parse((req.body as Buffer).toString())
      : req.body;
    const spans = handleTraces(body, contentType);
    if (spans.length > 0) {
      broadcast({ type: 'spans', data: spans });
    }
  } catch (err) {
    console.error('Error processing traces:', err);
  }
  res.status(200).json({});
});

app.post('/v1/metrics', (_req, res) => {
  // Accept but don't process
  res.status(200).json({});
});

// Serve static frontend (only when built client exists — assets/ is created by Vite build)
const clientDir = join(__dirname, '..', 'client');
if (existsSync(join(clientDir, 'assets'))) {
  app.use(express.static(clientDir));
  app.get('*', (_req, res) => {
    res.sendFile(join(clientDir, 'index.html'));
  });
}

// WebSocket connections
wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ type: 'init', data: store.getAll() }));
});

function broadcast(data: object): void {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Start server
server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `\nPort ${port} is already in use. Try: npx tokviz --port <other-port>\n`
    );
    process.exit(1);
  }
  throw err;
});

server.listen(port, () => {
  console.log(`\n  tokviz running at http://localhost:${port}\n`);
  console.log(`  OTLP endpoint: http://localhost:${port}/v1/traces`);
  console.log(`  Set OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:${port}\n`);

  if (!values['no-open']) {
    open(`http://localhost:${port}`);
  }
});
