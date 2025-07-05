import { t } from '@/i18n';
import { computed, ref } from 'vue';
import { useAgentStore } from '@/store/agent';
import { handleAgentLevelItem } from '../data'

export function useAgentLevelInfoLogic() {

  const agentStore = useAgentStore();   // 代理store

  const agentLevelInfo = ref<any>([]);       // 代理级别信息

  // 代理级别说明
  const agentLevelRules = computed(() => {
    return [
      t('mlmAgent.agentLevelTips1'),
      t('mlmAgent.agentLevelTips2')
    ]
  })

  initVuePageInfo() // created初始化页面数据

  /**
  * @description 生命周期: 页面挂载前
  */
  async function initVuePageInfo() {
    await agentStore.getAgentConfig();               // 获取代理配置信息
    const agentConfig = agentStore.agentConfig;
    if (agentConfig.config) {
      const config = JSON.parse(agentConfig.config);
      if (config.length) {
        config.forEach((item: any) => {
          let newArr = []
          for (const key in item) {
            const flag = ['rats','level','name'].includes(key);
            if (!flag && item[key] >= 0) {
              const newObj = handleAgentLevelItem(key,item[key])
              newArr.push(newObj)
            }
          }
          item.conditionList = newArr;
        })
      }
      agentLevelInfo.value = config;
    }
  }


  return {
    agentLevelInfo,
    agentLevelRules
  }
}
