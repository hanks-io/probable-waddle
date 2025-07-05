// 返水活动 逻辑层
import { useRoute } from 'vue-router';
import { useUserStore } from '@/store/user';
import { useTenantStore } from '@/store/tenant'
import { showLoading } from '@/utils/loading';
import { activityApplyApi } from '@/api/activity';
import { useActivityStore } from '@/store/activity';
import { moneyConvertToClient } from '@/utils/custom';
import { ActivityApplyParams } from '@/api/activity/model';
import { PageParam, setPageParam } from '@/store/pageParam';
import { computed, onBeforeMount, reactive, ref, watch } from 'vue';
import { showPopup } from '@/hooks/ShowPopup'
import { PopupType } from '@/components/Popup/data';
import router from '@/router';
import i18n from '@/i18n';
import { throttleActivity } from '@/utils';

export default function useLogic({props, emit}: {props: any, emit: any}) {
  const { t } = i18n.global;                // 国际化
  const route = useRoute();                 // 当前路由
  const userStore = useUserStore();         // 用户store
  const tenantStore = useTenantStore()      // 商户信息
  const activityStore = useActivityStore(); // 活动store
  const gameStore = useGameStore()          // 首页游戏信息
  const available = ref(0);       // 可领取返水
  const availableTomorrow = computed(() => activityStore.availableTomorrow);;// 明天可领取返水
  const showAvailableTomorrow = computed(() => activityStore.showAvailableTomorrow);// 是否显示明天可领取返水
  const sideValue = ref();        // 侧边导航标签值
  const segmentList = ref();      // 侧边导航标签项列表
  const ruleVisible = ref(false); // 规则弹窗显示
  const rebateTop = ref()         // 顶部信息标签
  const topHeight = ref(false)    // 顶部高度
  const rebateId = ref(props.rebateId)// 返水活动id

  // 初始化返水活动ID-处理从详情页面返回时，返水活动id为空的情况
  async function initRebateId() {
    const rebateInfo = await activityStore.getActivityList().then((value)=>{
      return value.find((item: any) => item.type == 'Rebate');
    })
    if (rebateInfo) {
      rebateId.value = rebateInfo.id
    }
  }

  const activityApplyParams = reactive<ActivityApplyParams>({ // 领取奖励参数
    id: rebateId.value,
    applyInfo: {
      type: 'Rebate',
      info: {
        userId: userStore.user?.userId || 0,
      }
    }
  })
  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy) // 当前商户货币
  const gameTypes = computed(() => activityStore.gameTypes);        // 游戏类型列表
  const homeGameList = computed(() => gameStore.homeGames) // 首页游戏列表
  const rebateList = computed(() => {
    return activityStore.rebateList.reduce((arr, ele) => {
      const matchingGames = homeGameList.value.filter(element => element.gameType === ele.gameType);
      matchingGames.forEach(element => {
        const filteredArray = ele.platformRebateList.filter(aItem => 
          element.platformList.some(bItem =>  bItem.id === aItem.platformId && (element.gameType !== "SPORTS" || (bItem.target === 'hall' && bItem.hot)))
        );
        arr.push({ ...ele, platformRebateList: filteredArray });
      });
      return arr;
    }, []);
  });   // 返水活动详情列表-与首页的显示的游戏类型与平台同步
  const validBetList = computed(() => activityStore.validBetList);  // 有效投注列表

  // 监听返水活动详情列表变化
  watch(() => validBetList.value,async () => {
    if (!gameStore.homeGames.length) {
     await gameStore.requestHomeGames()
    }
    segmentList.value = [];
    available.value = 0;
    rebateList.value.forEach((list, index) => {
      segmentList.value.push(list.gameType);
      if (list.gameType == gameTypes.value[0])  // 判断可领取返水游戏类型第一项所在所有游戏类型的索引位置
        sideValue.value = segmentList.value[index];
      list.platformRebateList.forEach((item: any) => {
        const itemMoney = calcAvailable(list.gameType, item)
        available.value += moneyConvertToClient(itemMoney); // 计算可领取返水总和
      })
    })
  }, { immediate: true })
  // 监听当前路由变动
  watch(() => route.fullPath, (newVal) => {
    if (route.path == '/main/promo') {
      getRebateInfo();
      changeMainMargin()
    }
  }, { deep: true })
  /**
   * @description 显示规则弹窗
   */
  function ruleHandle() {
    ruleVisible.value = true;
  }

  /**
   * @description 规则弹窗显示状态变更
   * @param visible 显示状态
   */
  function visibleChange(visible: boolean) {
    ruleVisible.value = visible;
  }

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
   * @description 计算当前返水比例
   */
  function calcRebateRate(gameType: string, item: any) {
    const validBet = calcValidBet(gameType, item.platformId) * 100;
    let rebateRate = 0;
    item.rebateRatioList.sort((a: any, b: any) => a.conditionAmount - b.conditionAmount).forEach((item: any) => {
      if (item.conditionAmount <= validBet) {
        rebateRate = item.rewardAmount / 100;
      }
    })
    return rebateRate;
  }

  /**
   * @description 计算可领取返水
   */
  function calcAvailable(gameType: string, item: any) {
    const rebateRate = calcRebateRate(gameType, item);
    const validBet = calcValidBet(gameType, item.platformId);
    return rebateRate * validBet;
  }

  /*
  * @description 计算下一级返水
  */

  /**
   * @description 返水记录
   */
  function rebateRecordHandle(item: any, gameType: string) {
    setPageParam(PageParam.REBATE_RECORD, { rebateId: rebateId.value, platformName: item.platformName, gameType })
    router.push({ path: '/activity/rebate/record' });
  }

  /**
   * @description 侧边导航标签切换事件
   * @param event 事件对象
   */
  function sideChange(event: any) {
    const index = event.detail.value;
    if (typeof index === 'number') {
      // 组件有bug，滑到屏幕外的时候index会变成number，在这里重新给它定位一下
      sideValue.value = segmentList.value[index]
    }
  }

  /**
   * 生命周期函数: 组件挂载前
   */
  onBeforeMount(() => {
    getRebateInfo();
    changeMainMargin()
  });
  /**
   * 接口调用: 获取返水活动信息
   */
  async function getRebateInfo() {
    await initRebateId();
    if (!rebateList.value.length) await showLoading();
    activityStore.setRebateDetail(rebateId.value);
  }

  /**
   * 接口调用: 领取返水
   */
  const receiveHandle = throttleActivity(async () => {
    if (!(showAvailableTomorrow.value ? availableTomorrow.value : available.value)) return;
    await showLoading();
    const data = await activityApplyApi(activityApplyParams);
    if (data) {
      showPopup({
        type: PopupType.BONUS,
        msg: t('popup.tips04', { amount: merchantCy.value + convertMoneyToShow(data)}),
      })
    }
    available.value = 0;
    getRebateInfo();
    activityStore.updateRedPointData()
  });

  // 计算实时返水顶部高度变化
  function changeMainMargin() {
    setTimeout(() => {
      const rebateTopHeight = rebateTop.value?.offsetHeight
      if (rebateTopHeight && Number(rebateTopHeight) > 35) {
        topHeight.value = true
      } else {
        topHeight.value = false
      }
    }, 100)
  }

  return {
    rebateTop,
    topHeight,
    ruleVisible,
    rebateList,
    segmentList,
    sideValue,
    available,
    gameTypes,
    ruleHandle,
    visibleChange,
    rebateRecordHandle,
    sideChange,
    receiveHandle,
    availableTomorrow,
    showAvailableTomorrow
  }
}
