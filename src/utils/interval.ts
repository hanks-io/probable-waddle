import { useAppStore } from '@/store/app';
import { useSystemStore } from '@/store/system';

/**
 * @description 检测ProgressierJS是否存在
 * @param pollTimes 轮询次数
 * @param duration 延迟时间<毫秒>
 */
export function checkProgressierJS(pollTimes: number = 10, duration: number = 300): Promise<any> {
  return new Promise((resolve) => {
    let times = 0;
    const check = () => {
      // @ts-ignore
      const progressier = window.progressier;
      if (progressier) {
        resolve(progressier);
      } else if (++times < pollTimes) {
        setTimeout(check, duration);
      } else {
        resolve(undefined);
      }
    };
    check();
  });
}

/**
 * @description 是否有PWA启动按钮
 * @param pollTimes 轮询次数
 * @param duration 延迟时间<毫秒>
 */
export function checkPawLaunchButton(pollTimes: number = 20, duration: number = 300): Promise<boolean> {
  const appStore = useAppStore();
  const systemStore = useSystemStore();

  return new Promise((resolve, _reject) => {
    let times = 0;
    const interval = setInterval(() => {

      if (appStore.unStandalone) {
        clearInterval(interval);
        resolve(false);
      }

      if (!systemStore.isPwaVisible) {  // 判断是否为可安装PWA环境
        clearInterval(interval);

        resolve(false);
      }

      times++;
      if (times >= pollTimes) {
        clearInterval(interval);
        const installed = localStorage.getItem("webAppInstalled") === "true";
        if (installed) {
          appStore.setPwaLaunchAllow(true);
          appStore.setPwaFooterVisible(false);
          resolve(true);
        } else {
          resolve(false);
        }
      }
    }, duration);
  });
}
