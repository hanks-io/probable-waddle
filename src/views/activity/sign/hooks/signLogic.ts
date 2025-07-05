import { SignItem } from './data'
import { showToast } from '@/utils'
import { useI18n } from 'vue-i18n';
import { useVipStore } from '@/store/vip';
import { useAppStore } from '@/store/app'
import { defineAsyncComponent } from 'vue'
import { showLoading } from '@/utils/loading';
import { showLogin } from '@/hooks/ShowLogin'
import { computed, ref, reactive } from 'vue';
import { useActivityStore } from '@/store/activity';
import { getTodayLocalDateStr, getBeforeLocalDateStr } from '@/utils/date';
import { moneyConvertToClient } from '@/utils/custom'
import { SignRewardModel } from '@/api/activity/model'
import { signDetailApi, activityApplyApi } from '@/api/activity';
import { getCustomerActivityId, type TemplateType } from '@/utils/custom'
import { PopupType } from '@/components/Popup/data';
import { generateDefultRules, Language, getCurrentActivityName } from '@/i18n/ruleHelper/activityRule'
import { ZTActivityTypes, ZActivityRuleType } from '@/enums/types/activity.type'
import { validationActivityClaimLimits } from '@/hooks/ValidActivityClaimLimit'
import { throttleActivity } from '@/utils';

export function useSignLogic() {
  const { t } = useI18n();
  const appStore = useAppStore();
  const vipStore = useVipStore();
  const activityStore = useActivityStore(); // 活动store

  const { id } = getCustomerActivityId();

  const activityName = ref<string>('');
  const activityRule = ref<string>('');

  const signInfo = reactive<SignRewardModel>({
    appShowRewardAmount: 'ON',
    appShowExtraRewardAmount: 'ON',
    rechargeSuccessPopup: 'ON',
    cycleType: 'ONCE',
    rewardConfig: [],
    rewardList: [],
    signInDays: 0,
    signInType: 'CONTINUOUS',
    isSignIn: false,
    multilingual: {
      rule: '',
      ruleType: 'DEFAULT',
      name: '',
      nameType: 'DEFAULT',
      nameParams: '',
      previewText: '',
      activityDetailSelect: null,
    },
  });
  const unmetInfo = reactive<SignItem>({});
  const openUnmetReceive = ref<boolean>(false);    // 未满足领取条件弹窗
  const openReceive = ref<boolean>(false);         // 满足领取条件弹窗
  const cumulativeRewardsMoney = ref<number>(0);   // 累计奖励金额
  const openStyle01Receive = ref<boolean>(false);  // style1 满足条件弹窗
  const lastDaySigned = ref<boolean>(false);       // 当前周期最后一天签到

  const isToken = computed(() => appStore.token ? true : false);
  const currentVipLevel = computed(() => {
    if (isToken.value && vipStore?.activityVipInfo) 
      return vipStore?.activityVipInfo.currentVipLevel.level;
    else 
      return 0;
  });
  const signReceivedInfo = computed(() => {
    return [
      { type: 'reward', value: cumulativeRewardsMoney.value, icon: 'sign-money-icon' },
      { type: 'date', value: signInfo.signInDays, icon: 'sign-date-icon' },
      { type: 'vip', value: currentVipLevel.value, icon: 'sign-vip-icon' }
    ]
  })
  const currentDate = computed(() => {
    const date = getTodayLocalDateStr();
    return date?.split('-');
  })
  const spacedCheckIn = computed(() => {
    const checkInText = t('activity.checkIn');
    return checkInText?.split('')?.join(' ');
  })
  const disabledReceiveBtn = computed(() => {
    const isAvailable = signInfo.rewardConfig.some(item => item.isAvailable);
    return !signInfo.isSignIn && isAvailable;
  })
  const showRewardAmount = computed(() => signInfo?.appShowRewardAmount == 'ON');
  const showExtraRewardAmount = computed(() =>  signInfo?.appShowExtraRewardAmount == 'ON');
  const activityFinished = computed(() => {
    const signActivity = activityStore.activityList.find(item => item.id == id);
    return signActivity?.status == 'FINISHED'
  })
  const showSignPrompt = computed(() => signInfo?.rewardType == 'VIP_LEVEL_REWARDS');

  // create init初始化
  initSignVue();

  function initSignVue() {
    if (isToken.value) {
      vipStore.getActivityVipInfoApi();
    }
    getSignActivityDetail();
  }

  // 获取签到活动详情
  async function getSignActivityDetail() {
    showLoading()
    const res = await signDetailApi(Number(id));
    let signInDays: number | string = res?.signInDays;
    if (res?.cycleType === 'ONCE') {
      lastDaySigned.value = res?.signInDays == res?.rewardConfig.length && res?.isSignIn;
    } else {
      lastDaySigned.value = res?.signInDays == 0 && res?.isSignIn;
    }
    // 处理签到金额/日期/领取状态显示
    if (res?.rewardConfig.length) {
      res.rewardConfig.forEach((item: SignItem) => {
        item.extraReward = moneyConvertToClient(item.extraReward);
        item.amountMax = moneyConvertToClient(item.amountMax);
        item.amountMin = moneyConvertToClient(item.amountMin);
        const { isClaimed, isAvailable, isUnMet } = handleItemCurrentDateType(item, res);
        item.isClaimed = isClaimed;
        item.isAvailable = isAvailable;
        item.isUnMet = isUnMet;
        item.validBet = moneyConvertToClient(item.validBet);
        item.rechargeAmount = moneyConvertToClient(item.rechargeAmount);
      })
    }
    // 处理签到活动名字
    if (res?.multilingual) {
      const language = (await appStore.getLocale()) as Language
      const multilingual = res.multilingual as Record<string, string>;
      activityName.value = await getCurrentActivityName(multilingual, language, ZTActivityTypes.enum.SignIn);
      // 处理活动规则
      if (ZActivityRuleType.enum.DEFAULT === multilingual.ruleType) {
        const ruleParam = JSON.parse(multilingual.rule)
        activityRule.value = generateDefultRules(language, ZTActivityTypes.enum.SignIn, ruleParam.variablesValue)
      } else {
        activityRule.value = multilingual.rule;
      }
    }
    cumulativeRewardsMoney.value = handleCumulativeRewardsMoney(res)
    // 最后一天签到处理
    if (lastDaySigned.value) {
      signInDays = res?.rewardConfig.length;
    }
    Object.assign(signInfo, { ...res, signInDays });
  }

  // 处理当前日期的领取状态
  function handleItemCurrentDateType(item: SignItem, res: SignRewardModel) {
    if (lastDaySigned.value) {
      return { isUnMet: false, isAvailable:false, isClaimed: true };
    }
    let isUnMet = false;            // 未满足领取条件
    let isAvailable = false;        // 可领取
    let isClaimed = item.day <= res?.signInDays;   // 已领取
    const signDay = (res?.signInDays || 0) + 1;
    if (item.day > res?.signInDays) {
      if (res?.isSignIn) {
        isUnMet = true;
      } else {
        if (signDay == item.day) {
          const meetRechargeAmount = res.validRecharge >= item.rechargeAmount;
          const meetValidBet = res.validBet >= item.validBet;
          isAvailable = meetRechargeAmount && meetValidBet;
          isUnMet = !isAvailable;
        } else {
          isUnMet = true;
        }
      }
    }

    return {
      isClaimed,
      isAvailable,
      isUnMet
    };
  }

  // 处理累计奖励金额
  function handleCumulativeRewardsMoney(res: SignRewardModel) {
    const signInDays = lastDaySigned.value ? res?.rewardConfig.length : res?.signInDays;
    const rewardList = res?.rewardList;
    const isSignIn = res?.isSignIn;
    if (!signInDays) return 0;
    let moneyAmount = 0;
    // 无论是连续签到/累计签到-前端根据时间自己算累计奖励
    moneyAmount = handleContinuousRewardList(isSignIn, signInDays, rewardList);
    return moneyConvertToClient(moneyAmount);
  }

  // 处理连续签到-当前已签到/未签到
  function handleContinuousRewardList(isSignIn: boolean, signInDays: number, rewardList: any) {
    const currentDate = getTodayLocalDateStr();
    const beforeDate = getBeforeLocalDateStr();
    const dateList = [isSignIn ? currentDate : beforeDate];
    let amounts = 0;
    if (signInDays > 1) {
      for (let i = 0; i < signInDays - 1; i++) {
        const dateValue = isSignIn ? (i + 1) : (i + 2)
        const data = getBeforeLocalDateStr(dateValue);
        dateList.push(data)
      }
      amounts = handleRewardCount(rewardList, dateList);
    } else {
      amounts = handleRewardCount(rewardList, dateList);
    }
    return amounts;
  }

  // 处理连续签到累计金额
  function handleRewardCount(rewardList: any, dateList: any) {
    let amount = 0
    rewardList.forEach((item: any) => {
      if (dateList.includes(item.signInTime)) {
        amount += item.rewardCount
      }
    })
    return amount;
  }

  // 跟随皮肤/固定皮肤1 签到 Click事件
  const checkInClick = throttleActivity(async (item: SignItem, type: string) => {
    if (activityFinished.value || lastDaySigned.value) return showToast(t('activity.activity') + t('activity.over'));
    if (!isToken.value) return await showLogin();
    if (item.isClaimed) return;
    const signDay = signInfo?.signInDays + 1;
    if (item.isAvailable) {
      const rewardAmount = await handleRequestSign(item.day);
      if (rewardAmount ==  '404404404404404404') return;
      const receiveImg = item.iconType == 'DEFAULT' ? `/images/sign/sing-date-bg-style02-${handleStyle01DefaultPng(item?.day)}.png` : item?.icon;
      Object.assign(unmetInfo, { ...item, successReward: moneyConvertToClient(rewardAmount), receiveImg });
      type == 'style0' ? openReceive.value = true : openStyle01Receive.value = true;
      getSignActivityDetail();
    } else {
      if (signInfo.isSignIn) {
        Object.assign(unmetInfo, { ...item, tipsConten: 'unSignDate01' });
        openUnmetReceive.value = true;
      } else {
        if (signDay == item.day) {
          Object.assign(unmetInfo, { ...item, tipsConten: null })
          openUnmetReceive.value = true;
        } else {
          Object.assign(unmetInfo, { ...item, tipsConten: 'unSignDate02', signDay })
          openUnmetReceive.value = true;
        }
      }
    }
  })

  // 固定皮肤2 签到 click事件
  const receiveClickBtn = throttleActivity(async (type: string) => {
    if (activityFinished.value || lastDaySigned.value) return showToast(t('activity.activity') + t('activity.over'));
    if (!isToken.value) return await showLogin();
    if (!signInfo?.rewardConfig.length) return;
    const day = signInfo.signInDays + 1;
    const item = signInfo.rewardConfig.find((item: SignItem) => item.day == day);
    if (item.day) {
      return checkInClick(item, type)
    }
  })

  // 请求签到接口
  async function handleRequestSign(day: number | string) {
    showLoading();
    const res = await activityApplyApi({
      id: Number(id),
      applyInfo: {
        type: ZTActivityTypes.enum.SignIn,
        info: {
          signInDay: day
        }
      }
    });
    if (res?.result && !res?.allMark) {
      await validationActivityClaimLimits(res, PopupType.BONUS, activityName.value);
      return '404404404404404404'
    } else {
      return res?.rewardAmount;
    }
  };

  // 关闭未满足/满足领取条件弹窗
  function closeReceiveModel(type: string) {
    if (type == 'unmet')
      openUnmetReceive.value = false;
    else
      openReceive.value = false;
  }

  // 关闭style01 领取弹窗
  function closeStyle01Received() {
    openStyle01Receive.value = false;
  }

  // 处理显示天数
  function handleDateDay(day: number) {
    return day < 10 ? '0' + day : day;
  }
  
  // 处理皮肤 Style01 默认图片
  function handleStyle01DefaultPng(index: number) {
    return index > 31 ? index % 31 == 0 ? 31 : index % 31 : index;
  }

  return {
    activityName,
    activityRule,
    signInfo,
    cumulativeRewardsMoney,
    currentVipLevel,
    openUnmetReceive,
    openReceive,
    unmetInfo,
    signReceivedInfo,
    currentDate,
    spacedCheckIn,
    openStyle01Receive,
    disabledReceiveBtn,
    showRewardAmount,
    showExtraRewardAmount,
    showSignPrompt,
    useComponents,
    handleDateDay,
    checkInClick,
    closeReceiveModel,
    receiveClickBtn,
    closeStyle01Received,
    handleStyle01DefaultPng
  }
}


export const useComponents = () => {
  const { defStyle } = getCustomerActivityId();
  const templateList = {
    'style_0': () => import(`@/views/activity/sign/components/default/index.vue`),
    'style_1': () => import(`@/views/activity/sign/components/first/index.vue`),
    'style_2': () => import(`@/views/activity/sign/components/second/index.vue`),
  }
  return markRaw(defineAsyncComponent(templateList[defStyle])) as unknown as ComponentPublicInstance;
}
