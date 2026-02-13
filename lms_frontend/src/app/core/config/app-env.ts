export type AppEnv = {
  apiBaseUrl: string;
  notificationsSseUrl: string;
  notificationsWsUrl: string;
};

/**
 * Default environment values. In production, deployment can replace these via reverse proxy
 * or by injecting a global `window.__APP_ENV__`.
 */
const defaultEnv: AppEnv = {
  // IMPORTANT: In Kavia preview, frontend and backend are different origins.
  // If apiBaseUrl were just "/api", the browser would call the frontend origin.
  // Use window.__APP_ENV__ to override in deployments that provide a same-origin reverse proxy.
  apiBaseUrl: 'http://localhost:3001/api',
  notificationsSseUrl: 'http://localhost:3001/api/notifications/stream',
  // Backend STOMP endpoint is /ws (see WebSocketConfig). The app may choose SSE by default.
  notificationsWsUrl: 'ws://localhost:3001/ws',
};

declare global {
  interface Window {
    __APP_ENV__?: Partial<AppEnv>;
  }
}

// PUBLIC_INTERFACE
export function getAppEnv(): AppEnv {
  /** Returns app environment configuration with optional runtime overrides. */
  const overrides = (typeof window !== 'undefined' && window.__APP_ENV__) ? window.__APP_ENV__ : undefined;
  return { ...defaultEnv, ...(overrides ?? {}) };
}
