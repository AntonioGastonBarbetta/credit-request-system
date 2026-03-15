import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function initSocket() {
  if (socket) return socket;
  const url = (import.meta.env.VITE_SOCKET_URL as string) || window.location.origin;
  socket = io(url, { transports: ['websocket', 'polling'], autoConnect: true });

  socket.on('connect', () => {
    // concise debug visibility
    // eslint-disable-next-line no-console
    console.debug('[socket] connected', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    // eslint-disable-next-line no-console
    console.debug('[socket] disconnected', reason);
  });

  socket.on('connect_error', (err) => {
    // eslint-disable-next-line no-console
    console.debug('[socket] connect_error', err?.message ?? err);
  });

  return socket;
}

export function onEvent(event: string, handler: (payload: unknown) => void) {
  const s = socket || initSocket();
  s.on(event, handler);
  const off = () => s.off(event, handler);
  return off;
}

export function offEvent(event: string, handler: (payload: unknown) => void) {
  if (!socket) return;
  socket.off(event, handler);
}

export function closeSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}
