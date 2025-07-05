// 三方登录 逻辑层
import { useAppStore } from "@/store/app";
import { openUrl, isGray } from "@/utils/app";
import { useTenantStore } from "@/store/tenant";
import { useRoute } from "vue-router";
import { computed } from "vue";
import { addQueryParams, clearAndroidLoginInfo } from "@/utils/app"


export default function useThirdPartyAuthLogic() {
  const route = useRoute(); // 当前路由
  const appStore = useAppStore(); // 全局store
  const tenantStore = useTenantStore(); // 商户store
  const systemStore = useSystemStore(); // 系统store
  const { sd, ch } = route.query;
  const isIosApp = sd === '4' ;
  const channelId = computed(() => appStore.channelId || ch || 0); // 渠道ID
  const thirdPartyLoginTypes = computed(() => {
    const authInfo = tenantStore.authInfo?.thirdPartyAuthInfo ?? [];
    // 苹果app不显示google登录
    return isIosApp ? (authInfo.filter((item: any) => !['google'].includes(item.item)) || []) : authInfo;
  }); // 第三方登录类型

  /**
   * @description 第三方登录
   */
  function thirdPartyLoginHandle(item: any) {
    clearAndroidLoginInfo();
    const redirectUrl = encodeURIComponent(addQueryParams(globalThis.location, { isApp: systemStore.isApk }));
    const url = `${item.oauthLoginUrl}${redirectUrl}${channelId.value ? `&channelId=${channelId.value}` : ""}
    ${isGray() ? "&is_gray=1" : ""}`;
    openUrl(url);
  }

  return {
    thirdPartyLoginTypes,
    thirdPartyLoginHandle,
  };
}
