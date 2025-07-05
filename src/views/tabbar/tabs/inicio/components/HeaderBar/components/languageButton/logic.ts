import { useAppStore } from '@/store/app';
import { useTenantStore } from '@/store/tenant';



export default () => {
  const appStore = useAppStore();
  const tenantStore = useTenantStore();

  const locale = computed(() => appStore.locale);                                               // 当前语言
  const supportLanguages = computed<string[]>(() => tenantStore.tenantInfo?.appLanguage || []); // 支持的语言


    /**
   * @description 切换语言
   */
  const changeLanguage = (language: string) => {
      appStore.setLocale(language);
    }

  return {
    locale,
    changeLanguage,
    supportLanguages,
  }
}