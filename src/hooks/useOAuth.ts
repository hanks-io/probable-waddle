// 处理三方登录相关
import { useRouter, useRoute } from 'vue-router';
import { PopupType } from '@/components/Popup/data';
import openAPK from '@/utils/pwa/openAPK';
import { useI18n } from '@/hooks/useI18n';

const { t } = useI18n();

/**
 * @description 检查当前是否为三方登录授权打开站点
 */
export function checkThirdPartyAuth() {
  const router = useRouter();
  const route = useRoute();
  const isThirdPartyAuth = route.query?.isApp === 'true';
  if (isThirdPartyAuth) {
    showPopup({
      type: PopupType.EXCEPTION,
      msg: t('toast.gotoAPK'),
      leftBtnCallback: async () => {
        await router.replace({ query: { ...route.query, isApp: '' } });
        openAPK(false)
        document.addEventListener("visibilitychange", handleVisibilityChange);
      },
    })
  }
}

async function handleVisibilityChange() {
  if (document.visibilityState === "hidden") {
    await useAppStore().removeToken();
    window.location.replace("about:blank");
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  }
}





