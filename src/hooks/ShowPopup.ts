// 公用的弹窗组件
import { modalController } from '@ionic/vue'
import { PopupParams, PopupType } from '@/components/Popup/data';
import { defineAsyncComponent } from 'vue';
import { getTheme } from '@/theme/hooks'
import { isFunction, isEqual } from '@/utils';

// 弹窗队列
const popupQueue = new Map<PopupType, Set<PopupParams>>([
  [PopupType.EXCEPTION, new Set()],
  [PopupType.TIPS, new Set()],
  [PopupType.FLOW, new Set()],
  [PopupType.BONUS, new Set()],
  [PopupType.TRIAL, new Set()],
  [PopupType.NEW_USER_EXCLUSIVE, new Set()]
]);

// 已经显示过的弹窗
const showedPopup = new Map<PopupType, Set<String | number>>([
  [PopupType.EXCEPTION, new Set()],
  [PopupType.TIPS, new Set()],
  [PopupType.FLOW, new Set()],
  [PopupType.BONUS, new Set()],
  [PopupType.TRIAL, new Set()],
  [PopupType.NEW_USER_EXCLUSIVE, new Set()],
]);

// 弹窗是否显示中
let isPopupShow = false;

/**
 * @description 将已经显示过的弹窗加入到已弹窗队列中
 */
function addShowedPopup(options: PopupParams) {
  if (options?.type && options?.uniqueId) {
    showedPopup.get(options.type)?.add(options.uniqueId);
  }
}

/**
 * @description 是否已经显示过该弹窗
 */
function hasShownPopup(options: PopupParams) {
  if (options?.type && options?.uniqueId) {
    return showedPopup.get(options.type)?.has(options.uniqueId) ?? false;
  }
  return false;
}

/**
 * @description 寻找下一个弹窗
 */
function findNextPopup(): PopupParams | undefined {
  for (const list of popupQueue.values()) {
    if (list.size > 0) {
      return list.values().next().value;
    }
  }
  return undefined;
}

/**
 * @description 添加弹窗到指定类型队列
 */
function addPopupToQueue(type: PopupType, options: PopupParams) {
  const set = popupQueue.get(type);
  for (const item of set!) {
    if (isEqual(item, options)) {
      return;
    }
  }
  set?.add(options);
}

/**
 * @description 删除指定类型队列中的第一个弹窗
 */
function shiftPopup(type: PopupType) {
  const list = popupQueue.get(type);
  const item = list?.values().next().value;
  if (item) {
    list?.delete(item);
  }
}

/**
 * @description 清除弹窗队列
 */
export function clearPopupQueue() {
  for (const list of popupQueue.values()) {
    if(list.size > 0) {
      list.clear();
    }
  }
}

/**
 * @description 显示下一个弹窗
 */
async function showNextPopup() {
  const options = findNextPopup();
  if (options) {
    const { type, component, id } = options;
    const { skin } = getTheme()
    const  skinName = skin === 'default' ? 'default' : 'first'
    isPopupShow = true;
    // 检测是否拦截当前弹窗
    if ((isFunction(options.checkIntercept) && options.checkIntercept()) || hasShownPopup(options)) {
      shiftPopup(type!); 
      showNextPopup();
      return;
    }

    // 弹窗显示
    const popup = await modalController.create({
      id: id ?? 'popup',
      component: component ?? defineAsyncComponent(() => import(`@/components/Popup/${skinName}/index.vue`)),
      componentProps: options,
      backdropDismiss: false,
      animated: true
    });
    await popup.present();
    addShowedPopup(options);
  
    // 弹窗关闭
    await popup.onWillDismiss();
    await popup.onDidDismiss();
    shiftPopup(type!);
    isPopupShow = false;
    showNextPopup();
  }
}

/**
 * @description 显示弹窗
 */
export async function showPopup(options: PopupParams) {
  const defaultOptions = {
    allowRepeat: false,
    type: PopupType.TIPS,
    component: null,
    msg: '',
    props: {},
  };
  const finalOptions = { ...defaultOptions, ...options }
  const { allowRepeat, type } = finalOptions;

  // 账号异常弹窗直接清除队列
  if (type === PopupType.EXCEPTION) {
    clearPopupQueue()
    modalController.dismiss().catch((error) => {
      console.warn('No Model=', error);
    }).finally(() =>{
      addPopupToQueue(type, finalOptions)
      if (!isPopupShow) {
        showNextPopup();
      }
    });
  } 
  else {
    addPopupToQueue(type, finalOptions);
  }

  if (!isPopupShow) {
    showNextPopup();
  }
}
