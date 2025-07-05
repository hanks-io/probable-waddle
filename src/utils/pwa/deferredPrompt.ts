let deferredPrompt: any = null;

export const getDeferredPrompt = () => deferredPrompt;

export const setDeferredPrompt = (e: any) => {
  deferredPrompt = e;
};