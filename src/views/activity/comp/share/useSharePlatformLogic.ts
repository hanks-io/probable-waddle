import { computed, ref } from "vue";
import { useAgentStore } from "@/store/agent";
import { useTenantStore } from "@/store/tenant";
import { useUserStore } from "@/store/user";
import { useAppStore } from "@/store/app";
import { ShareConfigType, showToast } from "@/utils";
import { shareAgentUrl } from "@/utils/agentShare";

export const useSharePlatformLogic = () => {
  const agentStore = useAgentStore();     // 代理store
  const segmentList = computed(() => agentStore.shareConfig?.filter((v: any) => v.isOpen) ?? []);    // 分享平台按钮列表
  const disableTab = ref(false);          // 定义导航标签禁用状态

  const shareValue = ref(0);              // 分享平台按钮列表动态值
  /**
   * @description 分享图标切换事件
   */
  const { shareUrl } = useShareUrl();
  const tenantStore = useTenantStore();	  // 租户信息
  const shareTitle = computed(() => tenantStore.tenantInfo?.name);  // 商户名称
  async function shareHandle(value: string) {
    shareAgentUrl(value as ShareConfigType, shareUrl.value, shareTitle.value);
  }


  // 分享其他平台
  const userStore = useUserStore();       // 用户store
  const appStore = useAppStore(); 		      // 用户信息
  const isToken = computed(() => !!appStore.token);    // 是否未登录
  const shareOtherPlatform = async () => {
    const userId = isToken.value ? userStore.user?.userId : "";
    try {
      if (navigator.share) {
        navigator.share({
          title: shareTitle.value,
          text: t("viewsSpread.shareText", { userId }),
          url: shareUrl.value
        })
          .then(() => {
            console.log("分享成功");
          })
          .catch(() => {
            console.log("分享失败！");
          });
      } else if (window?.jsBridge) {
        window?.jsBridge?.share(shareTitle.value, t("viewsSpread.shareText", { userId }), shareUrl.value);
      } else {
        return showToast("toast.sharePlatform");
      }
    } catch (error) {
      return showToast("toast.sharePlatform");
    }
  };

  /**
   * @description 鼠标按下事件
   * @param e 事件
   */
  let isDown: boolean;
  let startX: number;
  let scrollLeft: number;

  function handleMouseDown(e: any) {
    isDown = true;
    startX = e.pageX - e.currentTarget.offsetLeft;
    scrollLeft = e.currentTarget.scrollLeft;
  }

  function handleMouseUp(e: any) {
    isDown = false;
    disableTab.value = false;
  }

  function handleMouseLeave() {
    isDown = false;
    disableTab.value = false;
  }

  function handleMouseMove(e: any) {
    if (!isDown) return;
    e.preventDefault();
    disableTab.value = true;
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX);
    e.currentTarget.scrollLeft = scrollLeft - walk;
  }

  //
  onBeforeMount(() => {
    agentStore.getShareConfig();   // 获取分享配置
  });

  return {
    shareValue,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    handleMouseMove,
    segmentList,
    disableTab,
    shareHandle,
    shareOtherPlatform
  };
};