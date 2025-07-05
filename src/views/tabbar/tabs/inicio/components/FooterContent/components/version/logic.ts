
import { useSystemStore } from "@/store/system";
import { useAppStore } from "@/store/app";
import { getBuildVersion } from '@/utils/app';


export default () => {
  const systemStore = useSystemStore(); // 系统信息
  const appStore = useAppStore(); // app信息
  const tenantStore = useTenantStore(); // 租户信息
  const origin = location.origin;
  const { webPushRegId } = toRefs(appStore);
  const { os, app, browser } = toRefs(systemStore); // 操作系统信息
  const merchantName = computed(() => tenantStore.tenantInfo?.name)

  const { showMark } = inject('footerData') as { showMark: Ref<boolean> };

  return {
    os,
    browser,
    origin,
    showMark,
    merchantName,
    webPushRegId,
    getBuildVersion,
    appType: app?.value?.build,
  }
}