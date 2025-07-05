import { useTenantStore } from '@/store/tenant'


export default () => {
  const tenantStore = useTenantStore()

  const appLogo = computed(() => tenantStore.tenantInfo?.logo)

  return {
    appLogo
  }
}