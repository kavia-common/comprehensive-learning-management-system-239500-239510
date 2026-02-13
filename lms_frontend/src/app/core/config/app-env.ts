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
  apiBaseUrl: '/api',
  notificationsSseUrl: '/api/notifications/stream',
  notificationsWsUrl: '/ws/notifications',
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
