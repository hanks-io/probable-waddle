// 阿里云图形验证码
import { ref, onMounted, onBeforeUnmount, Ref } from 'vue';
import { useTenantStore } from "@/store/tenant";
import { useAppStore } from "@/store/app";
import { loadCss } from "@/utils/loader";

// 图形验证支持的多语言
const supportLanguage = ['cn', 'tw', 'en', 'ar', 'de', 'es', 'fr', 'in', 'it', 'ja', 'ko', 'pt', 'ru', 'ms', 'th', 'tr', 'vi'];

// 获取UI显示语言
async function getUILanguage() {
  const appStore = useAppStore() // 全局store
  const language = appStore.locale || 'en-US';
  const lang = language.split('-')[0];
  return supportLanguage.includes(lang) ? lang : 'en';
}

type CaptchaModel = {
  verify: Function;
  initAliyunCaptcha: Function;
}

// 初始化阿里云图形验证码
export function useCaptcha(apiCallback: Function): CaptchaModel {
  const captchaInstance: Ref<any> = ref(null);
  let captchaButton: HTMLElement | null = null;

  onMounted(() => {
    captchaButton = document.getElementById('captcha-button');
  })

  onBeforeUnmount(() => {
    // 必须删除相关元素，否则再次mount多次调用 initAliyunCaptcha 会导致多次回调 captchaVerifyCallback
    document.getElementById('aliyunCaptcha-mask')?.remove();
    document.getElementById('aliyunCaptcha-window-popup')?.remove();
    captchaInstance.value?.destroyCaptcha();
  })

  // 初始化阿里云图形验证
  async function initAliyunCaptcha(): Promise<void> {
    const language = await getUILanguage();
    const pageWidth = window.innerWidth;
    const rem = Math.floor((Math.min(pageWidth, 486) / 360) * 10) / 10;
    if (window.initAliyunCaptcha) {
      window.initAliyunCaptcha({
        SceneId: window.__APP_CONFIG__?.VITE_CAPTCHA_SCENE_ID || import.meta.env.VITE_CAPTCHA_SCENE_ID, // 场景ID
        prefix: window.__APP_CONFIG__?.VITE_CAPTCHA_PREFIX || import.meta.env.VITE_CAPTCHA_PREFIX, // 身份标
        mode: 'popup', // 验证码模式
        element: '#captcha-element', // 渲染验证码的元素
        button: '#captcha-button', // 触发验证码弹窗的元素
        captchaVerifyCallback: captchaVerifyCallback, // 业务请求(带验证码校验)回调函数
        onBizResultCallback: onBizResultCallback, // 业务请求结果回调函数
        getInstance: (instance) => captchaInstance.value = instance, // 绑定验证码实例函数
        slideStyle: {
          width: 320,
          height: 40,
        }, // 滑块验证码样式，支持自定义宽度和高度，单位为px。其中，width最小值为320 px
        rem, // rem基准值
        region: 'sgp', // 验证码区域
        language, // 验证码语言类型
      });
    }
  }

  // 阿里云图形验证执行验证回调函数
  async function captchaVerifyCallback(captchaVerifyParam) {
    try {
      await apiCallback(captchaVerifyParam);
    } catch (error) {
    } finally {
      return {
        captchaResult: true,
        bizResult: true,
      }
      // captchaInstance.value?.refresh();
    }
  }

  // 阿里云图形验证通过回调函数
  function onBizResultCallback() {
    console.log('onBizResultCallback');
  }

  // 执行验证
  function verify() {
    captchaButton?.click();
    nextTick(() => {
      const style = `
        #aliyunCaptcha-mask.mask-show {
            opacity: 0.7;
        }`
      loadCss(style);
    });
  }
  return { verify, initAliyunCaptcha };
}
