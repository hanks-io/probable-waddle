// 会员答谢活动逻辑层
import { reactive, onBeforeMount } from 'vue'
import { hideLoading, showLoading } from '@/utils/loading'
import { moneyConvertToClient, formatMoneyToShow, getCustomerActivityId, isActivityForever } from '@/utils/custom'
import { appreciationMultiDayDetailApi, activityApplyApi } from '@/api/activity';
import { formatToDateTime, getCurrentLocalTime, type Dayjs, getLocalTime } from '@/utils/date'
import { generateDefultRules, Language, getCurrentActivityName } from '@/i18n/ruleHelper/activityRule'
import type { TActivityResetType } from '@/enums/types/activity.type'
import { ZTActivityTypes, ZActivityResetType, ZActivityRuleType } from '@/enums/types/activity.type'
import { useI18n } from '@/hooks/useI18n'
import { showPopup } from '@/hooks/ShowPopup'
import { PopupType } from '@/components/Popup/data';
import { validationActivityClaimLimits } from '@/hooks/ValidActivityClaimLimit'
import dayjs from 'dayjs'
import { throttleActivity } from '@/utils';

export default function useLogic() {
  const { t } = useI18n()
  const appStore = useAppStore()
  const tenantStore = useTenantStore()
  const userStore = useUserStore()

  const { id: activityId, defStyle } = getCustomerActivityId()

  const activityInfo = reactive({
    name: '',
    endTime: '',
    cycle: '',
    maxReward: '0.00',
    description: '',
    canReceive: false,
    currentTime: '',
    ruleType: '',
  })
  // 倒计时时间展示
  const endTimeShow = reactive({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  })
  let timeBegin = ref<null | string>('YYYY-MM-DD HH:mm:ss')
  let todayIsMemberDay = ref<boolean>(false)
  const timer = ref<NodeJS.Timeout | null>(null);
  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy) // 当前商户货币
  // 倒计时结束,请求新的时间
  watch( endTimeShow, (newVal) => {
    if (newVal.days == '00' && newVal.hours == '00' && newVal.minutes == '00' && newVal.seconds == '00') {
      if (timer.value) {
        clearInterval(timer.value)
      }
      getActivityDetail()
    }
  })
  // 格式化日子
  function formatDay(locale: string, day: number): string {
    if (locale === 'en-US' || locale.startsWith('en')) {
      if (day > 3 && day < 21) return `${day}th`;
      switch (day % 10) {
        case 1: return `${day}st`;
        case 2: return `${day}nd`;
        case 3: return `${day}rd`;
        default: return `${day}th`;
      }
    }
    return day.toString();
  }

  // 获取活动周期
  function getActivityCycle(resetType: TActivityResetType, index: number | number[], locale: string): string {
    if (resetType === ZActivityResetType.enum.WEEKLY_DAY) {
      const weekDes: string[] = [];
      if (Array.isArray(index)) {
        index.forEach(item => {
          weekDes.push(t(`activity.appreciation0${2 + item}`))
        })
        return weekDes.join('/')
      }
    }
    else if (resetType === ZActivityResetType.enum.MONTHLY_DAY) {
      return t(`activity.appreciation11`, { number: formatDay(locale, index) })
    }
    else if (resetType === ZActivityResetType.enum.DAILY) {
      return index.toString().length === 1 ? `0${index}:00:00` : `${index}:00:00`;
    }
    return 'unknown';
  }

  // 当天是否为会员日
  function isMemberDay(resetType: TActivityResetType, index: number | number[]): boolean {
    const today = getCurrentLocalTime() as Dayjs;
    if (resetType === ZActivityResetType.enum.WEEKLY_DAY) {
      let day = today.day();
      day = (day === 0 ? 6 : day - 1) as 0 | 1 | 2 | 3 | 4 | 5 | 6;
      if (Array.isArray(index)) {
        const equalNum = index.filter(n => ((n - 1) % 7) === day);
        if (equalNum.length > 0) {
          return true;
        }
      }
    }
    else if (resetType === ZActivityResetType.enum.MONTHLY_DAY) {
      const date = today.date();
      if (Array.isArray(index)) {
        const equalNum = index.filter(n => n === date);
        if (equalNum.length > 0) {
          return true;
        }
      }
      return false;
    }
    else if (resetType === ZActivityResetType.enum.DAILY) {
      const hour = today.hour();
      return hour == index ? true : false
    }
    return false
  }

  // 获取活动详情
  async function getActivityDetail() {
    showLoading()
    const {
      canReceive,
      endTime,
      maxAmount,
      memberDay,
      multilingual,
      resetType,
      rewardCount,
      rule,
      ruleType,
      currentTime,
    } = await appreciationMultiDayDetailApi(Number(activityId))

    const language = (await appStore.getLocale()) as Language

    activityInfo.endTime = isActivityForever(endTime) ? t('activity.appreciation14') : formatToDateTime(endTime)
    activityInfo.maxReward = formatMoneyToShow(moneyConvertToClient(maxAmount))
    activityInfo.cycle = getActivityCycle(resetType, memberDay, language)
    activityInfo.canReceive = canReceive && isMemberDay(resetType, memberDay)
    todayIsMemberDay.value = isMemberDay(resetType, memberDay)
    activityInfo.name = await getCurrentActivityName(multilingual, language, ZTActivityTypes.enum.MemberReward)
    activityInfo.currentTime = formatToDateTime(currentTime)
    activityInfo.ruleType = ruleType;
    if (ZActivityRuleType.enum.DEFAULT === ruleType) {
      const ruleParam = JSON.parse(rule)

      activityInfo.description = generateDefultRules(language, ZTActivityTypes.enum.MemberReward + "MultiDay", ruleParam.variablesValue)

    }
    else {
      activityInfo.description = rule;
    }
    const today = getCurrentLocalTime() as Dayjs;
    
    // 统一的倒计时处理函数
    const startCountdown = (targetTime: string) => {
      if (targetTime === '没有下一个会员日了') {
        timeBegin.value = targetTime;
        timer.value = null;
        return;
      }

      timeBegin.value = targetTime;
      timer.value = setInterval(() => {
        // const target = dayjs(targetTime);
        // const now = getCurrentLocalTime() as Dayjs;
        // const timeGap = Math.ceil(target.diff(now, 'second'));
        // flipAllCards(timeGap);
        const target = new Date(targetTime).getTime();
        const timeNow = getCurrentLocalTime('YYYY-MM-DD HH:mm:ss');
        const now = new Date(timeNow.toString()).getTime();
        const timeGap = Math.ceil((target - now) / 1000);
        flipAllCards(timeGap);
      }, 1000);
    };

    // 处理不同类型的会员日
    if (resetType === ZActivityResetType.enum.MONTHLY_DAY) {
      const date = today.date();
      const time = findCloseDayMonth(memberDay, date);
      startCountdown(time);
    }
    else if (resetType === ZActivityResetType.enum.WEEKLY_DAY) {
      let day = today.day();
      day = (day === 0 ? 6 : day - 1) as 0 | 1 | 2 | 3 | 4 | 5 | 6;
      const time = findCloseDayWeek(memberDay, day);
      startCountdown(time);
    }
    else if (resetType === ZActivityResetType.enum.DAILY) {
      const hour = today.hour();
      const time = findCloseDayHour(memberDay, hour);
      startCountdown(time);
    }

  }
  // 找到离得最近的一个会员日
  function findCloseDayMonth(arr: number[], num: number): string {
    // 过滤出大于 num 的数字
    const greaterNumbers = arr.filter(n => n >= num);

    if (greaterNumbers.length === 0) {
      const minDay = Math.min(...arr)

      const timeFirst = (getCurrentLocalTime() as Dayjs).add(1, 'month').date(minDay).format('YYYY-MM-DD HH:mm:ss');
      const time = timeFirst.split(' ')[0] + ' 00:00:00'

      if (isActivityForever(activityInfo.endTime)) {    //活动是永久的
        return time
      } else {
        const localEndtime = getLocalTime(activityInfo.endTime) as Dayjs
        const timeObj = dayjs(time)
        return timeObj.isAfter(localEndtime) ? '没有下一个会员日了' : time
      }
    }
    const equalNum = arr.filter(n => n === num);   // 当天已经是会员日了
    if (equalNum.length > 0) {
      const timeFirst = (getCurrentLocalTime() as Dayjs).add(1, 'day').format('YYYY-MM-DD HH:mm:ss');
      const time = timeFirst.split(' ')[0] + ' 00:00:00'
      return time
    } else {
      const timeFirst = (getCurrentLocalTime() as Dayjs).add((Math.min(...greaterNumbers) - num), 'day').format('YYYY-MM-DD HH:mm:ss');
      const time = timeFirst.split(' ')[0] + ' 00:00:00'
      return time
    }

  }
  // 找到离得最近的一个会员日
  function findCloseDayWeek(arr: number[], num: number): string {
    // 过滤出大于 num 的数字
    const greaterNumbers = arr.filter(n => n >= (num + 1));
    if (greaterNumbers.length === 0) {
      let anotherGapDay = 7 - (num + 1) + Math.min(...arr)
      const timeFirst = (getCurrentLocalTime() as Dayjs).add(anotherGapDay, 'day').format('YYYY-MM-DD HH:mm:ss');
      const time = timeFirst.split(' ')[0] + ' 00:00:00'
      if (isActivityForever(activityInfo.endTime)) {    //活动是永久的
        return time
      } else {
        const localEndtime = getLocalTime(activityInfo.endTime) as Dayjs
        const timeObj = dayjs(time)
        return timeObj.isAfter(localEndtime) ? '没有下一个会员日了' : time
      }
    }
    const equalNum = arr.filter(n => n === (num + 1));   // 当天已经是会员日了
    if (equalNum.length > 0) {
      const timeFirst = (getCurrentLocalTime() as Dayjs).add(1, 'day').format('YYYY-MM-DD HH:mm:ss');
      const time = timeFirst.split(' ')[0] + ' 00:00:00'
      return time
    } else {
      const timeFirst = (getCurrentLocalTime() as Dayjs).add((Math.min(...greaterNumbers) - (num + 1)), 'day').format('YYYY-MM-DD HH:mm:ss');
      const time = timeFirst.split(' ')[0] + ' 00:00:00'
      return time
    }
  }
  // 找到离得最近的一个会员日
  function findCloseDayHour(arr: number[], num: number): string {
    const greaterNumbers = arr.filter(n => n >= num);
    if (greaterNumbers.length === 0) {
      const timeFirst = (getCurrentLocalTime() as Dayjs).add((23 - num) + Math.min(...arr), 'hour').format('YYYY-MM-DD HH:mm:00');
      const time = timeFirst.split(':')[0] + ':59:59';
      if (isActivityForever(activityInfo.endTime)) {    //活动是永久的
        return time
      } else {
        const localEndtime = getLocalTime(activityInfo.endTime) as Dayjs
        const timeObj = dayjs(time)
        return timeObj.isAfter(localEndtime) ? '没有下一个会员日了' : time
      }
    }
    const equalNum = arr.filter(n => n === num);   // 当天已经是会员日了
    if (equalNum.length > 0) {
      const timeFirst = (getCurrentLocalTime() as Dayjs).format('YYYY-MM-DD HH:mm:00');
      const time = timeFirst.split(':')[0] + ':59:59';
      return time
    } else {
      const timeFirst = (getCurrentLocalTime() as Dayjs).add((Math.min(...greaterNumbers) - num), 'hour').format('YYYY-MM-DD HH:mm:00');
      const time = timeFirst.split(':')[0] + ':00:00';
      return time
    }

  }
  // 倒计时插值
  function flipAllCards(time) {
    const seconds = String(time % 60).padStart(2, "0");
    const minutes = String(Math.floor(time / 60) % 60).padStart(2, "0");
    const hours = String(Math.floor(time / 3600) % 24).padStart(2, "0");
    const days = String(Math.floor(time / 86400)).padStart(2, "0");
    endTimeShow.days = days;
    endTimeShow.hours = hours;
    endTimeShow.minutes = minutes;
    endTimeShow.seconds = seconds;
  }
  // 活动奖励申请
  const onActivityApply = throttleActivity(async () => {
    if (!activityInfo.canReceive) return
    showLoading()
    const data = await activityApplyApi({
      id: activityId as number,
      applyInfo: {
        type: ZTActivityTypes.enum.MemberRewardMultiDay,
        info: {
          userId: userStore.user?.userId!,
        },
      },
    })
    if (data?.result && !data?.allMark) {
      return validationActivityClaimLimits(data, PopupType.BONUS, activityInfo.name)
    }
    if (data) {
      showPopup({
        type: PopupType.BONUS,
        msg: t('popup.tips04', { amount: merchantCy.value + convertMoneyToShow(data.amount) }),
      })
    }
    await getActivityDetail()
    hideLoading()
  })

  onBeforeMount(() => {
    getActivityDetail()
  })
  onUnmounted(() => {
    if (timer.value) {
      clearInterval(timer.value)
    }
  })
  /**
 * @description 停止按钮 按下弹出右键菜单
 */
  const forbidContextmenu = (e: any) => {
    e.preventDefault();
  }

  const useComponents = () => {
    const templList: Record<string, () => Promise<typeof import('*.vue')>> = {
      'style_0': () => import('@/views/activity/appreciation/style_0/index.vue'),
      'style_1': () => import('@/views/activity/appreciation/style_1/index.vue'),
    };
    const computedTemplate = templList[defStyle];
    return markRaw(defineAsyncComponent(computedTemplate)) as unknown as ComponentPublicInstance;
  }
  return {
    activityInfo,
    merchantCy,
    onActivityApply,
    forbidContextmenu,
    useComponents,
    endTimeShow,
    timer,
    timeBegin,
    todayIsMemberDay
  }
}
