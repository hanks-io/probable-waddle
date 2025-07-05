
import { redirectUrl } from '@/utils/app';
import { urlCheck } from '@/hooks/UrlCheck';
import { mainMediaListApi } from '@/api/normal';
import { useTenantStore } from '@/store/tenant';
import { ref, onBeforeMount, computed } from 'vue';
import { MainMediaModel } from "@/api/normal/model";
import { capitalize } from '@/utils';


const mediaList = ref<MainMediaModel>([]); // 主媒体列表

export default function usePartViewLogic() {
  const tenantStore = useTenantStore(); // 租户状态管理

  // 支付合作伙伴图片
  const paymentPartnerPic = computed(() => tenantStore.tenantInfo?.paymentPartnerPic);
  // 游戏合作伙伴平台配置
  const gamePartnerPic = computed(() => {
    const img = tenantStore.tenantInfo?.gamePartnerPic;
    return img ? img : '/images/skin-game-platform.png'
  });

  // 生命周期: 组件渲染前
  onBeforeMount(() => {
    getMainMedia(); // 获取主媒体配置
  })

  /**
   * @description 点击链接
   */
  function linkHandle(url: string, social?: string) {
    redirectUrl(urlCheck(url), capitalize(social))
  }

  return {
    mediaList,
    linkHandle,
    gamePartnerPic,
    paymentPartnerPic,
  }
}

/**
 * 接口请求: 获取主媒体配置
 */
async function getMainMedia() {
  mediaList.value = await mainMediaListApi();
}
