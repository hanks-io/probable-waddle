// 签到奖励
import { getCustomerActivityId } from '@/utils/custom'
import { moneyConvertToClient, convertMoneyToShow } from '@/utils/custom'
import { activityApplyApi, levelSignDetailApi } from '@/api/activity'
import { hideLoading, showLoading } from '@/utils/loading'
import { useI18n } from 'vue-i18n'
import { onBeforeMount, ref, reactive } from 'vue'
import { ZTActivityTypes, ZActivityRuleType } from '@/enums/types/activity.type'
import { showPopup } from '@/hooks/ShowPopup'
import { PopupType } from '@/components/Popup/data';
import { getTheme } from '@/theme/hooks'
import { Language, getCurrentActivityName, generateDefultRules } from '@/i18n/ruleHelper/activityRule'
import { useUserStore } from '@/store/user'
import { useAppStore } from '@/store/app'
import { validationActivityClaimLimits } from '@/hooks/ValidActivityClaimLimit'
import type { UserLevelInfo, LevelConfig, RewardStatus, RewardConfig } from '@/views/activity/levelSignIn/data'
import { throttleActivity } from '@/utils';

export default function useLogic() {
  const { t } = useI18n()
  const userStore = useUserStore()
  const appStore = useAppStore()
  const tenantStore = useTenantStore()

  const { id: activityId } = getCustomerActivityId()
  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy) // 当前商户货币
  const activityName = ref<string>('')
  const ruleType = ref(ZActivityRuleType.enum.DEFAULT)
  const defaultRule = ref<string[]>([])
  const customRule = ref<string>('')
  const userLevelInfo = reactive<UserLevelInfo>({
    level: "V0",
    levelName: '',
  })
  const betLevelConfig = ref<LevelConfig[]>([])
  const rewardConfig = ref<RewardConfig[]>([])
  const statisticalDays = ref<number>(0)
  const betAmount = ref<number>(0)
  const achievement = ref<boolean>(false)
  const curTheme = ref('green-default');
  const levelImages = import.meta.glob('@/assets/img/activity/levelSignIn/*.png', { eager: true });

  const daysText = computed(() => {
    return statisticalDays.value ? t('activity.levelSignIn02', { day: statisticalDays.value }) : t('activity.levelSignIn03')
  })

  const getLevelImg = (level: string) => {
    const key = Object.keys(levelImages).find(k => k.includes(level));
    return key ? (levelImages[key] as { default: string }).default : '';
  };

  // 计算当天的签到状态
  function getDayStatus(data: any, day: number): RewardStatus {
    const { signInVolumeDays, isSignInGrade, isSignInToday } = data
    if ((((day === signInVolumeDays) && isSignInToday && isSignInGrade)) ||
    ((isSignInToday && isSignInGrade) ? (day < signInVolumeDays) : (day < signInVolumeDays + 1))) {
      return 'done'
    } else if (achievement.value && ((isSignInToday && !isSignInGrade && (day === signInVolumeDays + 1)) ||
    (!isSignInToday && !isSignInGrade && (day === signInVolumeDays + 1)))) {
      return 'canDo'
    } else {
      return 'unexpired'
    }
  }

  // 获取当前等级背景样式
  function getLevelBgStyle(level: string): string {
    return userLevelInfo.level === level ? "checked" : "unchecked";
  }

  // 设置当下下注等级进度
  function setBetLevelProgress(level: string): void {
    const div = document.querySelector('.progress-bar');
    const progressMap: {[key:string]: number} = {
      "V0": 20,
      "V1": 80,
      "V2": 140,
      "V3": 200,
      "V4": 260,
      "V5": 340,
    }
    if (div) {
      const percentage = (progressMap[level] / 340) * 100;
      (div as HTMLElement).style.setProperty('--color-stop', `${percentage}%`);
    }
  }

  // 获取当前等级投注金额文字样式
  function getBetAmountStyle(isDone: boolean): string {
    return isDone ? "done" : "undone";
  }

  // 获取签到按钮文案
  function getBtnText(status: RewardStatus): string {
    return status === 'canDo' ? t('activity.levelSignIn06') : t('activity.levelSignIn07')
  }

  // 是否显示签到按钮
  function showBtn(status: RewardStatus): boolean {
    return status === 'canDo' || status === 'done'
  }

  // 申请奖励
  const applyHandle = throttleActivity(async (rewardConfig: RewardConfig) => {
    if (rewardConfig.status !== 'canDo') return
    showLoading()
    const data = await activityApplyApi({
      id: activityId,
      applyInfo: {
        type: ZTActivityTypes.enum.SignInVolume,
        info: {
          userId: userStore.user?.userId!,
          applySignInDay: rewardConfig.day,
        },
      },
    })
    // 未满足申领限制条件
    if (data?.result && !data?.allMark) {
      return validationActivityClaimLimits(data, PopupType.BONUS, activityName.value);
    }
    if (data) {
      showPopup({
        type: PopupType.BONUS,
        msg: t('popup.tips04', { amount: merchantCy.value + convertMoneyToShow(data?.rewardAmount) }),
      })
      getActivityDetail()
    }
    hideLoading()
  })

  // 获取活动详情
  async function getActivityDetail() {
    showLoading()
    const data = await levelSignDetailApi(Number(activityId))
    const { userVolumeConfig, onlyVolumeConfig, volumeDay, userVolume, multilingual } = data
    achievement.value = userVolumeConfig.grade != "V0" && (userVolume - userVolumeConfig.volume) >= 0;
    userLevelInfo.level = userVolumeConfig.grade;
    userLevelInfo.levelName = userVolumeConfig.gradeName || userVolumeConfig.grade;
    betLevelConfig.value = onlyVolumeConfig.map((item: any) => {
      return {
        level: item.grade,
        levelName: item.gradeName || item.grade,
        betAmount: moneyConvertToClient(item.volume),
        isDone: userVolume >= item.volume,
      }
    })
    rewardConfig.value = userVolumeConfig.dayConfig.map((item: any) => {
      return {
        day: item.day,
        reward: moneyConvertToClient(item.awardAmount),
        status: getDayStatus(data, item.day),
      }
    })
    statisticalDays.value = volumeDay
    betAmount.value = moneyConvertToClient(userVolume)

    const language = (await appStore.getLocale()) as Language
    activityName.value = await getCurrentActivityName(multilingual, language, ZTActivityTypes.enum.SignInVolume)
    // 活动规则解析
    ruleType.value = multilingual.ruleType
    if (ZActivityRuleType.enum.DEFAULT === multilingual.ruleType) {
      const ruleParam = JSON.parse(multilingual.rule)
      const ruleStr = generateDefultRules(language, ZTActivityTypes.enum.SignInVolume, ruleParam.variablesValue)
      defaultRule.value = ruleStr.split("\n").map(item => item.replace(/^\d\./, "")).filter(item => item !== '')
      defaultRule.value.shift()
    }
    else {
      customRule.value = multilingual.rule;
    }
    setBetLevelProgress(userLevelInfo.level)
  }

  // 页面挂载前
  onBeforeMount(async () => {
    getActivityDetail()
  })

  // 页面挂载后
  onMounted(async () => {
    const { theme } = getTheme();
    curTheme.value = theme;
  })

  return {
    activityName,
    ruleType,
    defaultRule,
    customRule,
    userLevelInfo,
    betLevelConfig,
    rewardConfig,
    merchantCy,
    betAmount,
    daysText,
    ZActivityRuleType,
    getLevelImg,
    getLevelBgStyle,
    getBetAmountStyle,
    getBtnText,
    showBtn,
    applyHandle,
  }
}

export const useComponents = () => {
  const { defStyle } = getCustomerActivityId();
  const templList = {
    'style_0': () => import(`@/views/activity/levelSignIn/style_0/index.vue`),
  }
  return markRaw(defineAsyncComponent(templList[defStyle])) as unknown as ComponentPublicInstance;
}
