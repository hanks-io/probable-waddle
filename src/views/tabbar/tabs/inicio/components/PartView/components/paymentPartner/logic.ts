import { useTenantStore } from '@/store/tenant';



export default () => {
  const tenantStore = useTenantStore(); // 租户状态管理

  // 支付合作伙伴图片
  const paymentPartnerPic = computed(() => tenantStore.tenantInfo?.paymentPartnerPic);

  return {
    paymentPartnerPic
  }
}