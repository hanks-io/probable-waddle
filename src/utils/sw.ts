import { getUrlParam } from "@/utils";
export function registerSW() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register('/sw.produce.min.2.1.6.js', { scope: '/' })
      .then((registration) => {
        console.log('Service worker registration successful with scope:', registration.scope);
        // 更新service worker
        registration.update();
        // 监听更新事件
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('New content is available; please refresh.');
                } else {
                  console.log('Content is cached for offline use.');
                }
              }
            };
          }
        }
      })
      .catch((error) => {
        console.error('Service worker registration failed:', error);
      });
  }
}

export function isGoogleType() {
  return getUrlParam('domainType') === "google";
}
