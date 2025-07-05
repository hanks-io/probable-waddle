// 返水记录 逻辑层
import { useActivityStore } from '@/store/activity';
import { computed, nextTick, onBeforeMount, ref } from 'vue';
import { PageParam, getPageParam } from '@/store/pageParam';

export default function useRecordLogic() {
  const activityStore = useActivityStore(); // 活动store

  const loading = ref(false);                                                         // 加载中
  const rebateInfo = ref<any>({});                                                    // 返水活动信息
  const rebateList = ref<any[]>([]);                                                  // 游戏记录列表
  const gameTypes = ref<string[]>([]);                                                // 游戏类型列表
  const platformNames = ref<string[]>([]);                                            // 游戏平台列表
  const platformList = ref<any>([])
  const scrollSelectionRef = ref<HTMLElement | null>(null);                           // 选择器滚动容器
  const params = ref<any>({});                                                        // 请求参数
  const gameVisible = ref(false);                                                     // 账变类型选择弹出层显示状态
  const gameType = ref('')                                                            // 游戏类型
  const platformName = ref('')                                                        // 游戏平台名称
  const platformVisible = ref(false)                                                  //游戏平台显示层状态
  const backRebate = ref(true)                                                        // 返回到实时返水tab
  const validBetList = ref<Record<string, any>>({
    // 'ELECTRONIC||25': 100,
    // 'ELECTRONIC||27': 1800,
  });

  const rebateId = computed(() => Number(params.value?.rebateId ?? 0));         // 返水活动id
  // const gameType = computed(() => {
  //   console.log(params.value?.gameType?.toString() || '');
  //   return params.value?.gameType?.toString() || ''
  // });    // 游戏类型
  // const platformName = computed(() => params.value?.platformName?.toString());  // 游戏平台名称

  /**
   * @description 计算有效投注
   */
  function calcValidBet(gameType: string, platformId: number) {
    for (let key in validBetList.value) {
      if (key == gameType + '||' + platformId) {
        return validBetList.value[key] / 100;
      }
    }
    return 0;
  }

  /**
   * @description 计算返水比例
   */
  function calcRebateRate(gameType: string, item: any) {
    const validBet = calcValidBet(gameType, item.platformId) * 100;
    let rebateRate = 0;
    if (validBet) {
      item.rebateRatioList.sort((a: any, b: any) => a.conditionAmount - b.conditionAmount).forEach((item: any) => {
        if (item.conditionAmount <= validBet) {
          rebateRate = item.rewardAmount;
        }
      })
    }
    return rebateRate / 100;
  }

  /**
   * @description 计算可领取返水
   */
  function calcAvailable(gameType: string, item: any) {
    const rebateRate = calcRebateRate(gameType, item) * 100;
    const validBet = calcValidBet(gameType, item.platformId) * 100;
    return rebateRate * validBet / 10000;
  }

  /**
   * @description 弹出层关闭事件
   */
  function dismissHandle() {
    gameVisible.value = false
    platformVisible.value = false;
  }

  /**
   * @description  游戏类型选择器点击事件
   */
  function gameTypeSelectHandle(event: any) {
    gameVisible.value = true
    scrollSelectedToCenter(event);
  }

  function platformSelectHandle(event: any) {
    platformVisible.value = true
    scrollSelectedToCenter(event);
  }

  // 游戏类型选择
  function selectedType(item: any) {
    gameType.value = item;
    gameVisible.value = false;
    calcRebateList()
  }

  function selectedPlatformType(item: any) {
    platformName.value = item;
    platformVisible.value = false;
    calcRebateList();
  }

  /**
   * @description: 重新计算返水列表
   */
  function calcRebateList() {
    rebateList.value = [];
    rebateInfo.value.filter((item: any) => item.gameType == gameType.value).forEach((list: any) => {
      list.platformRebateList.forEach((item: any) => {
        if (platformName.value == item.platformName)
          rebateList.value = item.rebateRatioList;
      })
    })
  }

  /**
   * 生命周期函数: 组件挂载前
   */
  onBeforeMount(() => {
    getRebateInfo(); // 获取返水活动信息
    nextTick(() => {
      gameType.value = params.value?.gameType?.toString() || '';
      platformName.value = params.value?.platformName?.toString() || '';
    })
    
  });

  /**
   * 接口调用: 获取返水活动信息
   */
  async function getRebateInfo() {
    params.value = await getPageParam(PageParam.REBATE_RECORD);
    rebateInfo.value = await activityStore.getRebateDetail(rebateId.value);
    rebateInfo.value.forEach((list: any) => {
      gameTypes.value.push(list.gameType);
      list.platformRebateList.filter((item: any) => item.platformId).forEach((item: any) => {
        if (!platformNames.value.includes(item.platformName)) 
          platformNames.value.push(item.platformName);
        
      })
    })
    // 处理内容过长文本溢出
    platformNames.value.forEach(item => {
      let obj = { name: item, isTrue: false }
      // 未包含空格 最多支持13位字符
      if (item && !item.includes(' ') && item.length > 10) {
        obj.isTrue = true
      }
      // 包含空格 最多支持25未字符
      if (item && item.includes(' ') && item.length > 20) {
        obj.isTrue = true
      }
      platformList.value.push(obj)
    })
    calcRebateList();
  }



  /**
   * @description 滚动选择器滚动到中间
   */
  function scrollSelectedToCenter(event: any) {
    if (scrollSelectionRef.value) {
      const container = scrollSelectionRef.value;
      const target = event.target!;
      
      const containerCenter = container.offsetWidth / 2; // 容器中心相对于视口的位置
      const targetCenter = target.offsetLeft + target.offsetWidth / 2; // 目标元素中心相对于视口的位置
      const scrollLeft = targetCenter - containerCenter + container.scrollLeft; // 计算目标元素中心需要移动到容器中心的距离
      const maxScrollLeft = container.scrollWidth - container.offsetWidth; // 考虑容器最大滚动范围，防止滚动超出
      const clampedScrollLeft = Math.min(Math.max(scrollLeft, 0), maxScrollLeft); // 确保滚动位置在有效范围内

      container.scroll({
        left: clampedScrollLeft,
        behavior: 'smooth'
      });
    }
  }

  return {
    loading,
    rebateList,
    gameTypes,
    platformList,
    scrollSelectionRef,
    gameVisible,
    gameType,
    platformName,
    platformVisible,
    backRebate,
    dismissHandle,
    gameTypeSelectHandle,
    platformSelectHandle,
    selectedType,
    selectedPlatformType,
  }
}
