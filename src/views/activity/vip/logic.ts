// vip活动 逻辑层
import { useI18n } from 'vue-i18n';
import { useGameStore } from '@/store/game'
import { useVipStore } from '@/store/vip';
import { useRoute, useRouter } from 'vue-router';
import { PopupType } from '@/components/Popup/data';
import type { GameListParams } from '@/api/normal/model'
import { hideLoading, showLoading } from '@/utils/loading';
import { computed, onBeforeMount, ref, reactive } from 'vue';
import { activityVipInfoApi, activityVipLevelListApi, activityVipReceiveApi ,redPointApi } from '@/api/activity';
import { moneyConvertToClient} from '@/utils/custom';
import type { ActivityReceiveType, ActivityVIPLevelListModel, ActivityVIPUserReceiveItem } from '@/api/activity/model';
import { useActivityStore } from '@/store/activity';
import { useTenantStore } from '@/store/tenant'
import { formatVipLevelInfo } from './data';
import { ZVipReceiveType } from '@/enums/types';
import { showPopup } from '@/hooks/ShowPopup'
import { throttleActivity } from '@/utils';

export default function useLogic() {
  const router = useRouter();                                         // 路由实例
  const route = useRoute();                                           // 当前路由实例
  const gameStore = useGameStore()                                    // 游戏store
  const activityStore = useActivityStore();                           // 活动store
  const vipStore = useVipStore();
  const tenantStore = useTenantStore()                                // 商户信息
  const elementStore = useElementStore();
  const { t } = useI18n();                                            // 国际化翻译
  const { locale } = useI18n();                                            // 国际化翻译

  enum PageType {
    PROMOTION = 'PROMOTION',                                          // 晋级奖励
    DAILY = 'DAILY',                                                  // 每日奖励
    WEEKLY = 'WEEKLY',                                                // 每周奖励
    MONTHLY = 'MONTHLY',                                              // 每月奖励
    LEVEL = 'LEVEL',                                                  // 保级说明
  } 

  const tabBarHeight = computed(() => elementStore.tabBarHeight)                        // 底部导航栏高度

  const curShowPage = ref<PageType>(PageType.PROMOTION);              // 当前显示的页面
  const vipLevelDatas = ref<ActivityVIPLevelListModel | null>(null);  // VIP等级数据
  const vipReceiveList = ref<any>([]);                                // 玩家可领取奖励列表
  const claimBtnIsEnable = ref(false);                                // 领取按钮是否可用
  const auditMultiple = ref(0);                                       // 审核倍数
  const ifShowDeposit = ref(false);                                   //是否显示升级所需充值额度
  const ifShowBet = ref(false);                                       //是否显示升级所需投注额度                                     
  const vipLevelInfo = reactive({
    curVipLevel: 0, // 当前VIP等级
    nextVipLevel: 0, // 下一级VIP等级
    rechargeNeed: 0, // 晋级再充值
    betNeed: 0, // 晋级再投注
    rechargeRequirements: 0, // 下一级投注要求
    betRequirements: 0, // 下一级投注要求
    curRechargeAmount: 0, // 当前充值额
    curBetAmount: 0, // 当前投注额
    rechargeProgress: 0, // 充值进度
    betProgress: 0, // 投注进度
    firstLevelProgress: 0, // 投注/充值合并进度条
  })

  const pageStatus = reactive({
    [PageType.PROMOTION]: false,
    [PageType.DAILY]: false,
    [PageType.WEEKLY]: false,
    [PageType.MONTHLY]: false,
    [PageType.LEVEL]: false,
  })

  const pageNameList = ref([                                          // 页面标题
    {value: PageType.PROMOTION, title: 'activity.vip8'},
    {value: PageType.DAILY, title: 'activity.vip9'},
    {value: PageType.WEEKLY, title: 'activity.vip10'},
    {value: PageType.MONTHLY, title: 'activity.vip11'},
    {value: PageType.LEVEL, title: 'activity.vip18'},
  ])

  const pageTitleList = ref<{[key: string]: string[]}>({              // 页面数据标题
    [PageType.PROMOTION]: ['activity.vip5', 'activity.vip6', 'activity.vip7', 'activity.vip8'],
    [PageType.DAILY]: ['activity.vip5', 'activity.vip12', 'activity.vip13', 'activity.vip9'],
    [PageType.WEEKLY]: ['activity.vip5', 'activity.vip14', 'activity.vip15', 'activity.vip10'],
    [PageType.MONTHLY]: ['activity.vip5', 'activity.vip16', 'activity.vip17', 'activity.vip11'],
  })

  const gameParams = reactive<GameListParams>({       // 游戏列表请求参数
  	gameType: undefined,
  	platformId: 0,
  	page: 1,
  	pageSize: 9999,
    all: true
  })

  const curPageTitles = computed(()=>{
    return pageTitleList.value[curShowPage.value]
  })

  const showReceiveBtn = computed(()=>{
    return curShowPage.value !== PageType.LEVEL
  })

  const receiveRuleContent = computed(() => {
    let msg = ''
    if (vipLevelDatas.value?.receiveRule) {
      msg = vipLevelDatas.value.receiveRule == 'RESERVE' ? 'activity.vip46' : 'activity.vip47'
    }
    return  msg
  })

  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy) // 当前商户货币
  const currentLanguage = computed(() => locale.value != 'zh-CN' ) // 当前语言

  const receiveBtnIsEnable = computed(()=>{
    return (curShowPage.value === PageType.PROMOTION && vipReceiveList.value.includes(ZVipReceiveType.enum.PROMOTION)) ||
      (curShowPage.value === PageType.DAILY && vipReceiveList.value.includes(ZVipReceiveType.enum.DAILY)) ||
      (curShowPage.value === PageType.WEEKLY && vipReceiveList.value.includes(ZVipReceiveType.enum.WEEKLY)) ||
      (curShowPage.value === PageType.MONTHLY && vipReceiveList.value.includes(ZVipReceiveType.enum.MONTHLY))
  })

  const receiveBatContent = computed(() =>  {
    const auditJsonDate = vipLevelDatas?.value?.auditLimitGame
    if (auditJsonDate) {
      const auditLimitGame = JSON.parse(auditJsonDate);
      if (auditLimitGame.status == 'OFF') return t('activity.vip48')     // 关闭显示  投注不限游戏平台
      let auditRules = ''
      auditLimitGame.limitData.forEach((item: any) => {                  // gameType 游戏类型  platformData 游戏类型勾选的平台数据
        let isHaveGame = false;                                          // 是否显示游戏类型
        const isSports = item.gameType == 'SPORTS'
        if (isSports) {                                                  // 体育类型的没有子游戏可以勾选 勾选平台就直接显示平台
          isHaveGame = true
        } else {                                                         // 非体育类型 平台至少要勾选一个游戏 否则不显示平台信息 
          isHaveGame = item.platformData.some((platformDateItem:any) => platformDateItem.gameData.length)
        }
        if (!isHaveGame) return
        const gameTypeName = t(`sort.${item.gameType}`) + '：';
        const gameTypeDate = gameStore.homeGames.find((gameTypeItem: any) => gameTypeItem.gameType == item.gameType)
        if (gameTypeDate && gameTypeDate.gameTypeStatus == 'ON') {
          let platName = '';
          item.platformData.forEach((paltItem: any) => {
            if (!isSports && !paltItem.gameData.length) return
            const platDate = gameTypeDate.platformList.find((platformItem: any) => platformItem.id == paltItem.platformId);
            if (platDate) {
              platName += platDate.name + ','
            }
          })
          platName = platName.substring(0, platName.length - 1);
          auditRules += gameTypeName + platName + '，'
        }
      })
      return t('activity.vip49') + auditRules.substring(0, auditRules.length - 1)
    }
  })

  type PageDataItem = {
    level: number,
    rechargeRequirement: number | string,
    betRequirement: number,
    reward: number,
    recharge: number,
    bet: number,
    rechargeProgress: number,
    betProgress: number,
    realRechargeRequirement: number,
    realBetRequirement: number,
    showRechargeProgress: boolean,
    showBetProgress: boolean,
    [key: string]: any;
  }

  const pageList = computed(()=>{
    return pageNameList.value.map(item => {
      return {
        value: item.value,
        title: item.title,
        isEnable: pageStatus[item.value]
      }
    })
  })

  const curPageData = computed(()=>{
    if (!vipLevelDatas.value) return [];
    const { totalRechargeAmount, totalValidBetAmount, totalValidBetAmountByDaily, totalValidBetAmountByMonthly, totalValidBetAmountByWeekLy, auditMultiple: multiple } = vipLevelDatas?.value!;
    auditMultiple.value = multiple;
    ifShowDeposit.value = false;
    ifShowBet.value = false;
    return vipLevelDatas?.value?.vipLevelDatas.map((item, index, arr) => {
      const preItem = !!index ? arr[index - 1] : undefined;
      const tempItem: PageDataItem = {
        level: item.level,
        rechargeRequirement: 0,
        betRequirement: 0,
        reward: 0,
        recharge: 0,
        bet: 0,
        rechargeProgress: 0,
        betProgress: 0,
        realRechargeRequirement: 0,
        realBetRequirement: 0,
        showRechargeProgress: false,
        showBetProgress: false,
        ifShowDeposit:false,
        ifShowBet:false
      }
      if(curShowPage.value == PageType.PROMOTION) {
        tempItem.showRechargeProgress = vipLevelInfo.nextVipLevel === item.level;
        tempItem.showBetProgress = vipLevelInfo.nextVipLevel === item.level;
        tempItem.realRechargeRequirement = moneyConvertToClient(item.promotionRecharge! - (preItem?.promotionRecharge ?? 0));
        if (tempItem.realRechargeRequirement != 0) {
          ifShowDeposit.value = true;
        }
        tempItem.rechargeRequirement = moneyConvertToClient(item.promotionRecharge!);
        if (tempItem.rechargeRequirement != 0) {
          ifShowDeposit.value = true;
        }
        tempItem.realBetRequirement = moneyConvertToClient(item.promotionBet! - (preItem?.promotionBet ?? 0));
        if (tempItem.realBetRequirement != 0) {
          ifShowBet.value = true;
        }
        tempItem.betRequirement = moneyConvertToClient(item.promotionBet!);
        if (tempItem.betRequirement != 0) {
          ifShowBet.value = true;
        }
        tempItem.reward = moneyConvertToClient(item.promotionReward!);
        tempItem.recharge = moneyConvertToClient(totalRechargeAmount - (preItem?.promotionRecharge ?? 0));
        tempItem.bet = moneyConvertToClient(totalValidBetAmount - (preItem?.promotionBet ?? 0));
        tempItem.rechargeProgress = tempItem.recharge / tempItem.realRechargeRequirement;
        tempItem.betProgress = tempItem.bet / tempItem.realBetRequirement;
      }
      else if (curShowPage.value == PageType.DAILY) {
        tempItem.showBetProgress = vipLevelInfo.curVipLevel === item.level;
        tempItem.rechargeRequirement = '-';
        tempItem.ifShowDeposit = false;
        tempItem.betRequirement = moneyConvertToClient(item.dailyBet!);
        if (tempItem.betRequirement != 0) {
          ifShowBet.value = true;
        }
        tempItem.realBetRequirement = tempItem.betRequirement;
        if (tempItem.realBetRequirement != 0) {
          ifShowBet.value = true;
        }
        tempItem.reward = moneyConvertToClient(item.dailyReward!);
        tempItem.bet = moneyConvertToClient(totalValidBetAmountByDaily!);
        tempItem.betProgress = tempItem.bet / tempItem.realBetRequirement;
        
      }
      else if (curShowPage.value == PageType.WEEKLY) {
        tempItem.showBetProgress = vipLevelInfo.curVipLevel === item.level;
        tempItem.rechargeRequirement = '-';
        tempItem.ifShowDeposit = false;
        tempItem.betRequirement = moneyConvertToClient(item.weeklyBet!);
        if (tempItem.betRequirement != 0) {
          ifShowBet.value = true;
        }
        tempItem.realBetRequirement = tempItem.betRequirement;
        if (tempItem.realBetRequirement != 0) {
          ifShowBet.value = true;
        }
        tempItem.reward = moneyConvertToClient(item.weeklyReward!);
        tempItem.bet = moneyConvertToClient(totalValidBetAmountByWeekLy!);
        tempItem.betProgress = tempItem.bet / tempItem.realBetRequirement;
      }
      else if (curShowPage.value == PageType.MONTHLY) {
        tempItem.showBetProgress = vipLevelInfo.curVipLevel === item.level;
        tempItem.rechargeRequirement = '-';
        tempItem.ifShowDeposit = false;
        tempItem.betRequirement = moneyConvertToClient(item.monthlyBet!);
        if (tempItem.betRequirement != 0) {
          ifShowBet.value = true;
        }
        tempItem.realBetRequirement = tempItem.betRequirement;
        if (tempItem.realBetRequirement != 0) {
          ifShowBet.value = true;
        }
        tempItem.reward = moneyConvertToClient(item.monthlyReward!);
        tempItem.bet = moneyConvertToClient(totalValidBetAmountByMonthly!);
        tempItem.betProgress = tempItem.bet / tempItem.realBetRequirement;
      }
      return tempItem;
    }).map(item => {
      item.ifShowDeposit = JSON.parse(JSON.stringify(ifShowDeposit.value));
      item.ifShowBet = JSON.parse(JSON.stringify(ifShowBet.value));
      Object.keys(item).forEach((key) => {
        if (typeof item[key] === 'number' && item[key] < 0) {
          item[key] = 0;
        }
      });
      return item;
    }) ?? []
  })

  const retentionLevel = computed(()=>{
    return vipLevelDatas?.value?.vipLevelDatas.map(item => {
      return {
        level: item.level,
        retentionRecharge: moneyConvertToClient(item.retentionRecharge!),
        retentionBet: moneyConvertToClient(item.retentionBet!),
      }
    }) ?? []
  })

  /**
   * @description 获取vip等级文字背景图片
   */
  function getVipLevelBg(level: number) {
    return vipStore.getFirstVipBg(level,'myVipTextBg')
  }

  /**
   * @description 一键领取奖励
   */
  const bathReceiveHandle = throttleActivity(async () => {
    if (!claimBtnIsEnable.value) return;
    showLoading();
    const data = await activityVipReceiveApi();
    hideLoading();
    if (data) {
      showPopup({
        type: PopupType.BONUS,
        msg: t('popup.tips04', { amount: merchantCy.value + convertMoneyToShow(data.amount)}),
      })
    }
    claimBtnIsEnable.value = false
    onGetVipLevelConfig();
  })
  
  /**
   * @description 领取奖励
   */
  const receiveHandle = throttleActivity(async () => {
    if (!receiveBtnIsEnable.value) return;
    showLoading();
    const data = await activityVipReceiveApi({
      receiveType: curShowPage.value as ActivityReceiveType
    });
    hideLoading();
    if (data) {
      showPopup({
        type: PopupType.BONUS,
        msg: t('popup.tips04', { amount: merchantCy.value + convertMoneyToShow(data.amount)}),
      })
    }
    onGetVipLevelConfig();
  });

  /**
   * @description 领取记录
   */
  function claimRecordHandle() {
    activityStore.pageType = 5;
    if (route.path === '/main/promo') {
      activityStore.curPageType = 5;
    } else{
      router.push({path: '/main/promo'})
    }
  }

  /**
   * @description 获取VIP等级配置
   */
  async function onGetVipLevelConfig() {
    showLoading();
    const vipLevelData = await activityVipInfoApi();
    formatVipLevelInfo(vipLevelData.data, vipLevelInfo);    
    const data = await activityVipLevelListApi();
    vipLevelDatas.value = data
    vipReceiveList.value = data.vipUserReceiveList ?? [];
    claimBtnIsEnable.value = !!vipReceiveList.value.length
    vipStore.claimBtnIsEnable = !!vipReceiveList.value.length
    const activityShowData = await redPointApi( { activityIds: [] } ) as any;
    vipStore.claimBtnIsEnable = giveIfShowRedPoint(activityShowData)
    pageStatus[PageType.PROMOTION] = !!data.promotionStatus
    pageStatus[PageType.DAILY] = !!data.dailyStatus
    pageStatus[PageType.WEEKLY] = !!data.weeklyStatus
    pageStatus[PageType.MONTHLY] = !!data.monthlyStatus
    pageStatus[PageType.LEVEL] = !!data.retentionStatus
    hideLoading();
  }

  /**
   * @description 获取活动中的VIP类型的红点是否显示
   */
  function giveIfShowRedPoint(activityShowData: Array<any>) {
    for (const element of activityShowData) {
      if (element.type === 'VIP') {
        return element.redPoint;
      }
    }
    return false; // 如果没有找到匹配的元素，返回 false 或其他默认值
  }
  /**
   * @description 生命周期: 页面挂载前
   */
  onBeforeMount(async () => {
    await gameStore.getHomeGames() // 获取首页游戏列表
    await onGetVipLevelConfig()
  });

  /**
   * @description 刷新页面
   */
  async function handleRefresh(event: CustomEvent) {
    await onGetVipLevelConfig();
    event.detail.complete();
  }
  /**
 * @description 停止按钮 按下弹出右键菜单
 */
   const forbidContextmenu = (e: any) => {
    e.preventDefault();
  }
  return {
    curShowPage,
    claimBtnIsEnable,
    auditMultiple,
    vipLevelInfo,
    pageStatus,
    PageType,
    curPageTitles,
    showReceiveBtn,
    receiveRuleContent,
    currentLanguage,
    receiveBtnIsEnable,
    receiveBatContent,
    pageList,
    curPageData,
    retentionLevel,
    bathReceiveHandle,
    receiveHandle,
    claimRecordHandle,
    handleRefresh,
    getVipLevelBg,
    route,
    forbidContextmenu,
    tabBarHeight,
    ifShowDeposit,
    ifShowBet,
    vipReceiveList
  }
}

