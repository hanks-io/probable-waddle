
/**
 * @description 动态加载CSS文件
 */
export function loadCss(style: string) {
  const link = document.createElement("style");
  link.type = "text/css";
  link.innerHTML = style;
  link.rel = "stylesheet";
  link.id = "captcha-style";
  document.head.appendChild(link);
}

export async function createScript(src: string, version: string, id?: string) {
  const script = document.createElement('script');
  script.src = src + `?v=${version}`;
  if (id) {
    script.id = id;
  }
  document.head.appendChild(script);
}

export function createStyle(src: string, version: string) {
  const style = document.createElement('link');
  style.href = src + `?v=${version}`;
  style.rel = 'stylesheet';
  document.head.appendChild(style);
}

export function getVersion() {
  const { __APP_VERSION_KEY__ } = localStorage;
  const version = __APP_VERSION_KEY__ || window.__APP_CONFIG__?.version || 'v1';
  return version;
}
