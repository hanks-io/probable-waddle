import { t } from '@/i18n';
import { computed, ref } from 'vue';
import { useAgentStore } from '@/store/agent';
import { showLoading } from '@/utils/loading';
import { hideLoading } from '@/utils/loading';
import { handleCurrentSkinGender } from '../data'
import { moneyConvertToClient } from "@/utils/custom";
import { agencyMlmRankListDataApi } from '@/api/agent/index'

export function useLeaderBordInfoLogic() {
  const agentStore = useAgentStore();   // 代理store

  const rewardType = ref('day')
  const threeTopBoardList = ref([]);     // 排行榜前三信息
  const otherBoardList = ref([]);        // 非前三排行榜信息
  const showLoadPage = ref(false);        // 显示骨架信息
  const showBoardEmpty = ref(true);      // 暂无排行榜数据

  const boardTabList = computed(() => {  // 日榜，周榜，月榜
    return [
      { name: t('mlmAgent.dayBord'), value: 'day' },
      { name: t('mlmAgent.weekBord'), value: 'week' },
      { name: t('mlmAgent.monthBord'), value: 'month' },
    ]
  })

  initVuePageInfo() // created初始化页面数据

  /**
   * @description 生命周期: 页面挂载前
   */
  async function initVuePageInfo() {
    await agentStore.getAgentConfig();          // 获取代理配置
    getLeaderBordInfo()
  }

  // 获取排行榜数据
  async function getLeaderBordInfo() {
    showLoading()
    const params = { rewardType: rewardType.value };
    try {
      const res = await agencyMlmRankListDataApi(params);
      const boardList = res.info;
      showBoardEmpty.value = boardList.length && boardList.length > 0;
      if (boardList.length) {
        const baseAvatar = agentStore.agentConfig?.ossUrl;
        boardList.forEach((item: any, index: number) => {
          const currentGender = handleCurrentSkinGender(item.avatar)
          item.avatar = `${baseAvatar}/avatar/${currentGender}`
          item.totalCommission = moneyConvertToClient(item.totalCommission);
          item.userId = handleUserId(item.userId.toString());
          if (index <= 2) {
            item['topImg'] = `/first/agent/topBoardImg${index}.png`
          }
        })
      }
      threeTopBoardList.value = boardList.slice(0, 3);
      otherBoardList.value = boardList.slice(3);
    } catch (error) {
    } finally {
      hideLoading();
    }
  }

  // 日榜/周榜/月榜 click事件
  function selectBoardClick(value: string) {
    threeTopBoardList.value = [];         // 重置排行榜前三数据
    otherBoardList.value = [];            // 重置非前三排行榜数据
    showBoardEmpty.value = true;          // 重置整个排行榜empty状态
    rewardType.value = value;
    getLeaderBordInfo();
  }

  // 排行榜排名处理
  function handleOtherBoardNum(index: number) {
    const idx = index + 4
    return idx >= 10 ? idx : '0' + idx;
  }

  // 处理userId
  function handleUserId(userId: string) {
    const leftCount = userId.slice(0,2);
    const rightCount = userId.slice(-2);
    let centerCount = '';
    const lengthIndex: any = userId.length - 4;
    for (let i = 0; i < lengthIndex; i++) {
      centerCount += '*';
    }
    return `${leftCount}${centerCount}${rightCount}`
  }

  return {
    rewardType,
    boardTabList,
    threeTopBoardList,
    otherBoardList,
    showLoadPage,
    showBoardEmpty,
    selectBoardClick,
    handleOtherBoardNum
  }
}
