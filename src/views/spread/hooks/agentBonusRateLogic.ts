import { useAppStore } from '@/store/app'
import { useAgentStore } from '@/store/agent';
import { agencyRatListApi } from '@/api/agent';
import { computed, onBeforeMount, ref } from 'vue';
import { moneyConvertToClient } from '@/utils/custom'
import { isJSONStr } from '@/utils/verify'

export function useAgentBonusRateLogic() {
  const agentStore = useAgentStore();             // 代理store
  const appStore = useAppStore();                 // 用户信息

  const tabValue = ref('');                       // 导航标签动态值
  const sortList = ref<string[]>([]);             // 分类列表
  const rateList = ref<Record<string, any>>({});  // 返佣比例列表
  
  const agencyConfig = computed(() => agentStore.config); // 代理配置信息
  const isToken = computed(() => appStore.token ? true : false)    // 是否未登录

  /**
   * 生命周期: 组件挂载前
   */
  onBeforeMount(() => {
    getRateList();
  })

  /**
   * @description 导航标签切换事件
   * @param event 事件对象
   */
  function tabChange(event: any) {
    tabValue.value = event.detail.value;
  }
  const tabTouch = (navName: string) => {
    tabValue.value = navName
  }

  return {
    tabValue,
    sortList,
    rateList,
    agencyConfig,
    isToken,
    tabChange,
    tabTouch
  }

  /**
   * @description 获取返佣比例列表
   */
  async function getRateList() {
    const res = await agencyRatListApi();
    if (res && 'info' in res) {
      let tempArr: any[] = [];
      if (isJSONStr(res.info)) {
        tempArr = JSON.parse(res.info);
      }
      else {
        tempArr = JSON.parse(res.info)
      }
      tempArr.forEach((item: any) => {
        item.needFlow = moneyConvertToClient(item.needFlow)
        if (sortList.value.includes(item.gameType)) {
          rateList.value[item.gameType].push(item);
        } else {
          sortList.value.push(item.gameType);
          rateList.value[item.gameType] = [item];
        }
      })
      const order = [
        "ELECTRONIC",
        "CHESS",
        "FISHING",
        "VIDEO",
        "SPORTS",
        "LOTTERY"
      ]
      sortList.value.sort((a, b) => order.indexOf(a) - order.indexOf(b));
      tabValue.value = sortList.value[0];
    }
  }
}
