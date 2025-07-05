import { t } from '@/i18n';
import { showLoading } from "@/utils/loading";
import { hideLoading } from '@/utils/loading'
import { computed, onBeforeMount } from 'vue';
import { useAgentStore } from '@/store/agent';
import { useTenantStore } from '@/store/tenant';

export function useInvitationRulesLogic() {

  const tenantStore = useTenantStore(); // 商户store
  const agentStore = useAgentStore();   // 代理store
  const customRuleList = ref('');       // 自定义规则内容
  const isDefaultRule = ref(true);      // 默认自定义规则

  const tenantName = computed(() => tenantStore.tenantInfo?.name)         // 商户信息
  const invitationRuleList = computed(() => {                             // 默认代理规则
    const inviteRuleType = agentStore.config?.inviteRuleType;
    if (inviteRuleType && inviteRuleType == 'Normal')
      return [
        t('mlmAgent.defaultRule1'),
        t('mlmAgent.defaultRule2'),
        t('mlmAgent.defaultRule3'),
        t('mlmAgent.defaultRule4'),
        t('mlmAgent.defaultRule5'),
        t('mlmAgent.defaultRule6'),
        t('mlmAgent.defaultRule7', { name: tenantName }),
      ]
    else
      return [] 
  })

  /**
  * 生命周期: 组件挂载前
  */
  onBeforeMount(async () => {
    await agentStore.setConfig();               // 获取代理配置信息
    handleAgentRule()
  });

  // 处理多级分销规则
  async function handleAgentRule() {
    const config = agentStore.config;
    if (config && config?.inviteRuleType == 'Custom') {
      showLoading();
      isDefaultRule.value = false
      const response = await fetch(config.inviteRule);
      customRuleList.value = await response.text();
      hideLoading();
    } else {
      isDefaultRule.value = true
    }
  }

  function handleRuleItemCount(index: number) {
    return index > 10 ? 10 : '0' + index
  }

  return {
    invitationRuleList,
    isDefaultRule,
    customRuleList,
    handleRuleItemCount
  }
}
