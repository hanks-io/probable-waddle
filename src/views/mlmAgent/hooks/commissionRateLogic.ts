import { t } from '@/i18n';
import { computed,ref } from 'vue';
import { useAgentStore } from '@/store/agent';

export function useCommissionRateLogic() {

  const agentStore = useAgentStore();            // 代理store

  const currentAgentLevel = ref(1)               // 代理级别
  const currentGameType = ref('ELECTRONIC');     // 游戏类型
  const agentLevelList = ref([]);                // 代理级别列表
  const agentLevelRateInfo = ref([]);            // 返回规则表

  const isShowGameType = computed(() => {        // 是否区分游戏类型
    const agentConfig = agentStore.agentConfig;
    if (agentConfig?.achievementType == 'recharge')
      return false
    else if (agentConfig?.achievementType == 'validBet')
      return agentConfig.type == 'gameType'
  })
  const gameTypeList = computed(() => {
    return [
      { name: t('sort.ELECTRONIC'), value: 'ELECTRONIC' },
      { name: t('sort.CHESS'), value: 'CHESS' },
      { name: t('sort.FISHING'), value: 'FISHING' },
      { name: t('sort.VIDEO'), value: 'VIDEO' },
      { name: t('sort.SPORTS'), value: 'SPORTS' },
      { name: t('sort.LOTTERY'), value: 'LOTTERY' }
    ]
  })

  initVuePageInfo() // created初始化页面数据
  
  /**
   * @description 生命周期: 页面挂载前
   */
  async function initVuePageInfo() {
    await agentStore.getAgentConfig();          // 获取代理配置
    handleCommissionRate()
  }

  // 处理佣金返回数据
  function handleCommissionRate() {
    const agentConfig = agentStore.agentConfig;
    if (agentConfig.config) {
      agentLevelList.value = JSON.parse(agentConfig.config);
    }
    handleCommissionRateList()
  }

  // 游戏类型选择
  function selectAgmeType(value: string) {
    currentAgentLevel.value = 1
    currentGameType.value = value
    handleCommissionRateList()
  }

  // 代理级别选择
  function selectAgentLevel(value: number) {
    currentAgentLevel.value = value
    handleCommissionRateList()
  }

  // 处理返水数据
  function handleCommissionRateList () {
    const gameType = isShowGameType.value ? currentGameType.value : 'ELECTRONIC';
    const agentDeta = agentLevelList.value.find((item:any) => item.level == currentAgentLevel.value);
    const gameDeta = agentDeta.rats.filter((item:any) => item.gameType == gameType);
    const rateArr = JSON.parse(JSON.stringify(gameDeta))
    if (rateArr.length) {
      rateArr.forEach((item:any) => {
        if (item.rat || item.rat == 0)
          item.rat = convertRatioToShow(item.rat, 4)
        else 
          item.rat = formatRatioToShow(0)
      })
    }
    agentLevelRateInfo.value = rateArr.sort(((a:any, b:any) => a.level - b.level));
  }

  return {
    gameTypeList,
    currentGameType,
    currentAgentLevel,
    agentLevelList,
    agentLevelRateInfo,
    isShowGameType,
    selectAgentLevel,
    selectAgmeType
  }
}
