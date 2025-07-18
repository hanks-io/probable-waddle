/*!
  * version-polling v1.2.2
  * (c) 2023 JoeshuTT
  * @license MIT
  */
'use strict';

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

/**
 * 是否有值
 * @param {*} val
 */
/**
 * 创建一个 Web Work 实例
 * @param func
 */
function createWorker(func) {
  const blob = new Blob(["(" + func.toString() + ")()"]);
  const url = window.URL.createObjectURL(blob);
  const worker = new Worker(url);
  window.URL.revokeObjectURL(url);
  return worker;
}
function createWorkerFunc() {
  let timerId = null;
  let options;
  self.onmessage = event => {
    let code = event.data["code"];
    options = Object.assign({}, options, event.data["data"]);
    const {
      htmlFileUrl,
      lastEtag,
      appETagKey,
      pollingInterval,
      silentPollingInterval
    } = options;
    const runReq = () => {
      fetch(htmlFileUrl, {
        method: "HEAD",
        cache: "no-cache"
      }).then(response => {
        if (Number(response.status) !== 200) {
          return;
        }
        const etag = response.headers.get("etag").replace(/W\//, '');
        if (lastEtag !== etag) {
          self.postMessage({
            appETagKey,
            lastEtag,
            etag
          });
        }
      });
    };
    const startPollingTask = () => {
      if (!silentPollingInterval) {
        timerId = setInterval(runReq, pollingInterval);
      }
    };
    const pausePollingTask = () => {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    };
    if (code === "pause") {
      pausePollingTask();
    } else {
      runReq(); // 立即执行一次
      startPollingTask();
    }
  };
  return self;
}
function closeWorker(worker) {
  worker.terminate();
}

let APP_ETAG_KEY = "__APP_ETAG__";
let myWorker;
const defaultOptions = {
  appETagKey: APP_ETAG_KEY,
  pollingInterval: 5 * 60 * 1000,
  htmlFileUrl: `${location.origin}${location.pathname}`,
  silent: false,
  silentPollingInterval: false,
  silentPageVisibility: false,
  forceUpdate: false
};
let attached = false;
/**
 * 页面隐藏时停止轮询任务，页面再度可见时在继续
 */
function handleVisibilityChange() {
  if (document.visibilityState === "visible") {
    myWorker.postMessage({
      code: "resume"
    });
  } else {
    myWorker.postMessage({
      code: "pause"
    });
  }
}
class VersionPolling {
  constructor(options) {
    _defineProperty(this, "options", void 0);
    _defineProperty(this, "appEtag", "");
    this.options = Object.assign({}, defaultOptions, options);
    this.init();
  }
  async init() {
    const {
      htmlFileUrl
    } = this.options;
    const response = await fetch(htmlFileUrl, {
      method: "HEAD",
      cache: "no-cache"
    });
    if (Number(response.status) !== 200) {
      throw new Error(`[version-polling]: status is ${response.status}`);
    }
    const etag = response.headers.get("etag").replace(/W\//, '');
    // eslint-disable-next-line no-eq-null
    if (etag == null) {
      throw new Error(`[version-polling]: etag is null`);
    }
    this.appEtag = etag;
    localStorage.setItem(`${this.options.appETagKey}`, etag);
    this.start();
  }
  start() {
    const {
      appETagKey,
      pollingInterval,
      htmlFileUrl,
      silent,
      silentPollingInterval,
      silentPageVisibility
    } = this.options;
    if (silent) {
      return;
    }
    myWorker = createWorker(createWorkerFunc);
    myWorker.postMessage({
      code: "start",
      data: {
        appETagKey,
        pollingInterval,
        htmlFileUrl,
        silentPollingInterval,
        lastEtag: this.appEtag
      }
    });
    myWorker.onmessage = event => {
      const {
        lastEtag,
        etag
      } = event.data;
      if (lastEtag !== etag) {
        this.stop();
        this.options.onUpdate?.(this);
      }
    };
    if (!silentPageVisibility) {
      if (!attached) {
        document.addEventListener("visibilitychange", handleVisibilityChange);
        attached = true;
      }
    }
  }
  stop() {
    if (myWorker) {
      closeWorker(myWorker);
      if (attached) {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        attached = false;
      }
    }
  }
  onRefresh() {
    window.location.reload();
  }
  onCancel() {
    this.options.forceUpdate && this.start();
  }
}
function createVersionPolling(options) {
  const versionPolling = new VersionPolling(options);
  return versionPolling;
}

exports.VersionPolling = VersionPolling;
exports.createVersionPolling = createVersionPolling;
