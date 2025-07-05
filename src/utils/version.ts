import { createVersionPolling } from '@/utils';
import { delay } from '@/utils';

export const initVersionPolling = async () => {
  await delay(1000);
  console.log('initVersionPolling');
  createVersionPolling({
    versionUrl: `${location.origin}/version.js`,
    pollingInterval: 60 * 1000,
    onVersionUpdate: (version) => {
      if (window.isGame) {
        window.isFresh = true;
        return
      }
      alert("The page has been updated, please refresh the page!");
      window.location.reload();
    },
  });
}
