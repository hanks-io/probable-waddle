// APP日志系统
import * as Sentry from "@sentry/vue";
import type { App } from 'vue';

export function setupSentry(app: App) {
  Sentry.init({
    app,
    dsn: window.__APP_CONFIG__?.SENTRY_AUTH_TOKEN || '',
    integrations: [
      Sentry.httpClientIntegration({
        failedRequestStatusCodes: [400, 401, 403, 500, 502, 503],
      }),
    ],
    // 禁用性能追踪（如果不需要）
    tracesSampleRate: 0,
    // 捕获请求头或 Cookie
    sendDefaultPii: true,
    // 过滤事件：只允许 HTTP 错误和自定义事件
    beforeSend(event, hint) {
      const isHttpError = (event?.contexts?.response?.status_code ?? 0) >= 400;
      const isCustomEvent = event?.tags?.custom === true;
      if (isHttpError || isCustomEvent) {
        return event; 
      }
      return null;
    },
  });
  window.Sentry = Sentry;
}

export function logMessage(title: string) {
  window.Sentry.captureMessage(title, {
    level: 'info',
    tags: {
      custom: true,
    },
    extra: {
      appConfig: window.__APP_CONFIG__,
    },
  });
  console.log(title);
}

export function logPixelReport(eventName: string, logData: any) {
  const remarkJson = JSON.stringify({
    pointType: useChannelStore().channelConfig?.pointType ?? "unknown",
    tenantId: useTenantStore().tenantInfo?.id ?? "unknown",
    channelId: useAppStore().channelId ?? "unknown",
    cururl: window.location.href,
    appType: useSystemStore().app?.build ?? "unknown",
  })
  logData['remark'] = remarkJson;
  window.Sentry.captureMessage(eventName, {
    user: {
      id: useUserStore().user?.id,
    },
    level: 'info',
    tags: { 
      custom: true,
      tenetId: useTenantStore().tenantInfo?.id ?? "unknown",
      channelId: useAppStore().channelId ?? "unknown",
      pixelId: logData.pixelId,
      pointType: useChannelStore().channelConfig?.pointType ?? "unknown",
    },
    extra: logData,
  });
}
