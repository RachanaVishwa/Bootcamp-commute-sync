/**
 * Express entry point for local development.
 * Run with: npx tsx express-server.ts
 * This starts the API server on port 3001.
 * Vite dev server (port 3000) proxies /api/* to this.
 */
import express from 'express';
import { registerServer } from './server.js';

const app = express();
// Allow requests from Vite dev server
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.sendStatus(204); return; }
  next();
});
app.use(express.json());

registerServer(app);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 Bootcamp Commute Sync API running at http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/docs`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  http://localhost:${PORT}/api/events`);
  console.log(`  GET  http://localhost:${PORT}/api/areas/:city`);
  console.log(`  POST http://localhost:${PORT}/api/commute`);
  console.log(`  POST http://localhost:${PORT}/api/commute/arrive`);
  console.log(`  GET  http://localhost:${PORT}/api/commute/summary/:event_id\n`);
});
