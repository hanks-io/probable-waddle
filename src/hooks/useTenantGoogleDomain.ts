
const isIosSystem = (isIOS: boolean, isIOSApp: boolean) => {
  return isIOS || isIOSApp
}
export const useTenantGoogleDomain = () => {

  const systemStore = useSystemStore();   // 系统信息

  const { platform, isPwa, isApk, isIOS, isApkShelfPackage, isApkFinal, isIOSApp } = toRefs(systemStore)
  const isIosSystem = computed(() => isIOS.value || isIOSApp.value)
  const isPwaSystem = computed(() => isPwa.value)
  

}
