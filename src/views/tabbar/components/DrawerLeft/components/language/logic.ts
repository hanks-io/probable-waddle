import { getLanguageName } from '@/utils/custom'
import { useAppStore } from '@/store/app';
import { useTenantStore } from '@/store/tenant';



export default () => {
  const appStore = useAppStore();           // 应用store
  const tenantStore = useTenantStore();     // 租户store

  const locale = computed(() => appStore.locale);               // 当前语言
  const showLangChange = computed(() => !!tenantStore.getTenantLanguageList().length) // 是否显示语言切换

  const currentLanguage = computed(() => getLanguageName(locale.value, locale.value).split(' ')[0]);
  /**
   * @description 语言切换
   */
  function languageHandle() {
    appStore.setLanguageModalVisible(true);
  }

  return {
    locale,
    showLangChange,
    currentLanguage,
    languageHandle,
  }
}