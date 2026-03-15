import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { createServer } from 'http';
import { initSocketServer } from './realtime/socketServer';
import { ensureAdminUser } from './services/seedService';

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
const host = process.env.HOST || 'localhost';

const app = createApp();
const server = createServer(app);

function formatSeparator(length = 49) {
  return '='.repeat(length);
}

function printStartupBanner(p: number) {
  const baseUrl = `http://${host}:${p}`;
  const sep = formatSeparator();
  const banner = `\n${sep}\n🚀 CREDIT REQUEST SYSTEM API\n${sep}\n\nServer running at:\n${baseUrl}\n\nHealth check:\n${baseUrl}/api/health\n\nAvailable endpoints:\n\nGET     /api/health\nPOST    /api/auth/login\nPOST    /api/auth/logout\nGET     /api/credit-requests\nPOST    /api/credit-requests\nGET     /api/credit-requests/:id\n\n${sep}\n`;
  // eslint-disable-next-line no-console
  console.log(banner);
}

server.listen(port, () => {
  printStartupBanner(port);
  initSocketServer(server);
  // ensure a local admin user exists for development
  ensureAdminUser().catch(() => undefined);
});
