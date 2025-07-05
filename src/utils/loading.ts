import { loadingController } from '@ionic/vue';
import { LoadingOptions } from "@ionic/core/components";
import { delay } from '@/utils/delay';

let loadingList: HTMLIonLoadingElement[] = []; // 处理并发的时候loading引用丢失的问题
let isLoading = false;

/**
 * 显示加载状态
 * @param message 加载提示信息
 * @param spinner 加载动画样式
 */
const showLoading = async (message?: string, spinner: LoadingOptions['spinner'] = 'bubbles') => {
  const ionMainTreeLoading = document.querySelector('ion-spinner[data-main-tree-loading]');
  if (isLoading || ionMainTreeLoading) return;
  isLoading = true;
  let loading = await loadingController.create({
    message,
    spinner,
    duration: 10000,
    mode: 'md',
    htmlAttributes: {
      inert: 'true'
    }
  });
  loading.present();
  loadingList.push(loading);
};

/**
 * 关闭加载状态
 * @param interval 延迟关闭时间
 */
const hideLoading = async (interval: number = 0) => {
  if (isLoading && loadingList.length) {
    while (loadingList.length) {
      const loading = loadingList.pop();
      if (loading) await loading.dismiss();
    }
    isLoading = false;
  }
}

export {
  showLoading,
  hideLoading
};
