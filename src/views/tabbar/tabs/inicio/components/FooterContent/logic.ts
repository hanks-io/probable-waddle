
import { footerTextApi } from "@/api/normal";
import { useSystemStore } from "@/store/system";
import { useTenantStore } from "@/store/tenant";
import { getBuildVersion } from '@/utils/app';
import { copy } from '@/hooks/Copy';

const showMark = ref(false); // 是否显示标记
const dateList = ref<any[]>([]); // 文案内容
const pressTimer = ref<NodeJS.Timeout>(); // 按压定时器

export default function useFooterContentLogic() {
  const systemStore = useSystemStore(); // 系统信息
  const tenantStore = useTenantStore();	// 租户信息
  const appStore = useAppStore(); // app信息
  const origin = location.origin;
  const webPushRegId = ref(''); // 极光webpush 注册ID
  const os = computed(() => systemStore.os); // 操作系统信息
  const sd = computed(() => systemStore.app?.build); // app类型
  const browser = computed(() => systemStore.browser); // 浏览器信息
  const merchanName = computed(() => tenantStore.tenantInfo?.name); // 商户名
  const appLogo = computed(() => tenantStore.tenantInfo?.logo);

  // 生命周期: 页面加载前
  onBeforeMount(() => {
    initVuePage()
  })

  /**
   * 初始化页面数据
   */
  function initVuePage() {
    getFooterContent()
  }

  /**
   * @description 开始按压
   */
  function startPress() {
    webPushRegId.value = appStore.getWebPushRegId();
    pressTimer.value = setTimeout(() => {
      showMark.value = true;
      if (!useSystemStore()?.isIOS) {
        copy(webPushRegId.value);
      }
    }, 2000);

    if (useSystemStore()?.isIOS) {
      copy(webPushRegId.value);
    }
  }
  /**
   * @description 结束按压
   */
  function endPress() {
    if (pressTimer.value) {
      clearTimeout(pressTimer.value);
      pressTimer.value = undefined;
    }
    showMark.value = false;
  }

  /**
   * @description 获取后台配置文案信息
   */
  async function getFooterContent() {
    try {
      const res = await footerTextApi()
      if (res.footerText) {
        dateList.value = res.footerText.split('\n')
      }
    } catch (error) {
      console.log(error);
    }
  }

  return {
    os,
    sd,
    appLogo,
    showMark,
    dateList,
    browser,
    merchanName,
    origin,
    startPress,
    endPress,
    getBuildVersion,
    webPushRegId,
  }
}
