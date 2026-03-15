import type { Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { logger } from '../logger';

let io: IOServer | null = null;

export function initSocketServer(server: HttpServer) {
  if (io) return io;
  io = new IOServer(server, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    logger.info({ id: socket.id }, 'socket.connection');
    socket.on('disconnect', (reason) => logger.info({ id: socket.id, reason }, 'socket.disconnect'));
  });

  logger.info('socket.server.started');
  return io;
}

export function emitEvent(event: string, payload: unknown) {
  if (!io) return;
  io.emit(event, payload);
}

export function getIo() {
  return io;
}
