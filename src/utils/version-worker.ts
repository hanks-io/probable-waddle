export type VersionPollingOptions = {
  versionUrl: string;
  pollingInterval: number;
  applicationKey?: string;
  onVersionUpdate?: (version: string) => void;
};

const createWorker = (options: VersionPollingOptions) => {
  const workerFunction = () => {
    self.onmessage = async function(event) {
      const { versionUrl, applicationKey, isFirstTime } = event.data;
      try {
        const absoluteUrl = new URL(versionUrl, self.location.origin).href;
        const response = await fetch(absoluteUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const { version } = data;
        if (version) {
          self.postMessage({ version, applicationKey, isFirstTime });
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
  };

  const blob = new Blob([`(${workerFunction.toString()})()`], { type: 'application/javascript' });
  const worker = new Worker(URL.createObjectURL(blob));

  worker.onmessage = function(event) {
    const { version, applicationKey, isFirstTime } = event.data;
    console.warn('version', version, applicationKey, isFirstTime);
    const lastVersion = localStorage.getItem(applicationKey);
    localStorage.setItem(applicationKey, version);
    if (lastVersion && version !== lastVersion && !isFirstTime) {
      options.onVersionUpdate?.(version);
    }
  };

  return worker;
};

export const createVersionPolling = (options: VersionPollingOptions) => {
  const { versionUrl, pollingInterval, applicationKey = '__APP_VERSION_KEY__' } = options;
  const worker = createWorker(options);
  worker.postMessage({ versionUrl, applicationKey, isFirstTime: true });
  const handleVersionUpdate = () => {
    if (document.visibilityState === 'visible') {
      worker.postMessage({ versionUrl, applicationKey });
    }
  };

  const intervalId = setInterval(handleVersionUpdate, pollingInterval);

  document.addEventListener('visibilitychange', handleVersionUpdate);

  // Clear interval and remove event listener when worker is terminated
  worker.onmessageerror = () => {
    clearInterval(intervalId);
    document.removeEventListener('visibilitychange', handleVersionUpdate);
    console.error('Worker encountered an error');
  };
};


