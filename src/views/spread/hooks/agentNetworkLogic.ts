import { useAppStore } from '@/store/app';
import { useAgentStore } from '@/store/agent';
import { useTenantStore } from "@/store/tenant";
import { computed, onBeforeMount, ref, watch } from 'vue';

export function useAgentNetworkLogic() {
  const agentStore = useAgentStore();
  const appStore = useAppStore();        // 系统信息
  const tenantStore = useTenantStore();  // 商户信息

  const customTutorialHtml = ref('');
  const customTutorial = computed(() => agentStore.config?.customTutorial);
  const defaultLanguage = computed(() => {                         // 是否默认语言
    const tenantInfo =tenantStore.tenantInfo;
    const currentLanguage = appStore.locale.replace('_', '-');     // 当前语言
    return currentLanguage == tenantInfo?.appDefaultLanguage;
  });

  /**
   * 生命周期: 组件挂载前
   */
  onBeforeMount(() => {
    agentStore.getConfig();
  });

  watch(() => agentStore.config, (val) => {
    if (val && val.customTutorial) {
      const text = defaultLanguage.value ? val.tutorial_local : val.tutorial_en;
      // 需要后端关联默认语言，先在默认取local
      parseCustomTutorial(val.tutorial_local);
    }
  }, { immediate: true });

  /**
   * @description 解析自定义教程
   */
  function parseCustomTutorial(tutorialUrl: string) {
    fetch(tutorialUrl)
      .then(response => response.text())
      .then(data => {
        customTutorialHtml.value = data;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  return {
    customTutorialHtml,
    customTutorial
  }
}

