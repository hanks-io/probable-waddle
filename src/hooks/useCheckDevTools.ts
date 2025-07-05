// 检测当前用户是否开启了调试工具
import { addListener, crashBrowserCurrentTab, launch } from 'devtools-detector';
import { useI18n } from '@/hooks/useI18n';
import { isDev, isPre } from '@/utils';

function checkDevToolsIsOpen() {
  const urlParams = new URLSearchParams(window.location.search);
  const disableDetection = urlParams.get('check') === '0' || isDev();
  if (disableDetection) return;
  
  addListener((isOpen) => isOpen && crashBrowserCurrentTab());
  launch();
}

export { checkDevToolsIsOpen };
