import { useTenantStore } from '@/store/tenant';


export default () => {
  const tenantStore = useTenantStore(); // 租户状态管理
  // 游戏合作伙伴平台配置
  const gamePartnerPic = computed(() => {
    const img = tenantStore.tenantInfo?.gamePartnerPic;
    return img ? img : '/images/skin-game-platform.png'
  });

  return {
    gamePartnerPic
  }
}