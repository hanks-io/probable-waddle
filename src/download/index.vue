<script setup lang="ts">
import { IonPage } from '@ionic/vue';
import InstallCheckModal from '@/pwa/installModal/DownloadModal.vue';
import LoadingModal from './comp/LoadingModal.vue';
import { BROWSER } from '@/enums/device';
import {  getWebDomain } from '@/utils';
import { checkBrowser, checkWebView } from '@/utils/pwa/browser';
import {  iosInstallAction } from '@/pwa/hooks/useInstallPWAOrAPK';
import { useMatchType } from "@/pwa/hooks/useMatchType";
const router = useRouter(); // 路由实例
const route = useRoute();
const loading = ref(false);                   // 是否加载中
const appStore = useAppStore();         // 用户信息
const systemStore = useSystemStore();   // 系统信息
const channelStore = useChannelStore(); // 渠道信息
const unStandalone = computed(() => appStore.unStandalone);             // 是否未在PWA中运行且可以安装PWA
const template = computed(() => channelStore.downloadTemplate);         // APK下载模板信息


let checkTimer: number | null = null; // 检测定时器
const progress = ref(0);                      // 安装进度
const checked = ref(false);                   // 是否检测完成
const checking = ref(false);                  // 是否检测中


const { isPwa, isInAppBrowser, isPwaVisible,  isIOS } = toRefs(systemStore)

const webViewTodo = () => {
  const webViewTodoMap = new Map<string, () => false | Promise<void>>([
    ["ios", () => useMatchType('ios') && iosInstallAction()],
    ["android", () => useMatchType('google') && checkBrowser()]
  ])
  const key = isIOS.value ? "ios" : "android"
   webViewTodoMap.get(key)?.()
}
/**
 * @description 检测按钮点击事件
 */
const checkHandle = () => {
  const webView = checkWebView();
  if (webView || !isPwaVisible.value) {
    webViewTodo()
    return;
  }

  checking.value = true;  // 设置检测状态

  checkTimer = window.setInterval(() => {
    if (progress.value < 100) {
      if (unStandalone.value) {               // 判断是否可以安装PWA或按钮文本内容是否为'打开应用'
        progress.value += 5;
      } else {
        progress.value += 1;
      }
    } else {

      progress.value = 100;
      checked.value = true;
      if (checkTimer) {
        clearInterval(checkTimer);
      }

    }
  }, 50);
}


// 生命周期: 页面卸载前
onBeforeUnmount(() => {
  if (checkTimer) {
    clearInterval(checkTimer);
  }
});



const currentComponent = computed(() => {
  const style = template.value?.style;
  const imitationAppType = template.value?.imitationAppType;
  // first  four
  const templateList: Record<string, () => Promise<typeof import('*.vue')>> = {
    'style_1_google': () => import('@/download/comp/first.vue'),
    'style_2_google': () => import('@/download/comp/second.vue'),
    'style_3_google': () => import('@/download/comp/third.vue'),
    'style_4_google': () => import('@/download/comp/four.vue'),
    'style_1_ios': () => import('@/download/comp/IosFirst.vue'),
    'style_2_ios': () => import('@/download/comp/IosSecond.vue'),

  };
  console.log(`${style}_${imitationAppType}`, 'tttttttt')
  const components = templateList[`${style}_${imitationAppType}`];
  if (components) {
    const asyncComponent = defineAsyncComponent(components);
    return markRaw(asyncComponent) as unknown as ComponentPublicInstance | null;
  }
  return null;
})

const isSetInstallTypePWA = (ch?: string) => {
  if (!systemStore.isAndroidH5) return false
  const { guideInstall, downloadBtn } = channelStore.promotionInfo as any;
  if (!ch) return !guideInstall && !downloadBtn
  return !guideInstall
}

// 生命周期: 页面加载前
onMounted(async () => {
  //  pwa安装以后， 在三星浏览器，whatsapp, facebook拉起pwa还在下载页面，需要跳转到首页
  if (isPwa.value && isPwaVisible) {
    router.push('/main/inicio');
    return
  }
  const { from, ch } = route.query;
  const domain = getWebDomain();
  const makeLogic = () => {
    if (isSetInstallTypePWA(ch as string)) {
      channelStore.promotionInfo = {
        ...channelStore.promotionInfo,
        installType: "PWA"
      }
    }

    // 用户使用的浏览器安装不了pwa，在外部app打开我们的页面， 如何facebook等，需要拉起弹框， 让用户谷歌浏览器打开
    if (!isPwaVisible.value || isInAppBrowser.value) {
      webViewTodo()
    }
  }
  const next = (await channelStore.getDownloadTemplate(domain as string));
  if (next?.jumpDomainType?.includes('google')) { // 如果landing 包含google， 则使用商户的模板配置
    makeLogic()
  } else {
    if (!from) return
    // 带渠道， 渠道的guideInstall关闭后， 只能安装pwa, 现在有个问题，后台前端关闭安装引导之后（guideInstall）,installType 这个值还是商户上次配置的值，
    channelStore.getDownloadTemplate(from as string).then(makeLogic)
  }

  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});


</script>
<template>
  <ion-page v-if="template?.style">
    <component :is="currentComponent" @checkHandle="checkHandle" />
    <InstallCheckModal :visible="checking" :checking="checking" />
    <LoadingModal :visible="loading" />
  </ion-page>

</template>

<style scoped lang="less"></style>
