import dayjs from 'dayjs';
import { emitter } from '@/utils/event';
import { getCurrentLocalTime } from '@/utils/date'
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useActivityStore } from '@/store/activity'
import { handleDateToSecond, handleAddDays, handleShowEndTimeSecond, handleCountDownType } from '@/views/activity/rechargePromotion/data'

export function useRechargePromotionLogic() {
  const route = useRoute();
  const router = useRouter();
  const activityStore = useActivityStore();
  const elementStore = useElementStore()  // 元素store

  const currentDate = getCurrentLocalTime() as dayjs.Dayjs;

  const timer = ref<NodeJS.Timeout | null>(null);
  const isEndTimes = ref<boolean>(false);
  const countDownTimeStr = ref<string>('');
  const rechargeBonusImg = ref<string>('');
  const rechargeBonusImgIdx = ref<number>(1);
  const showRechargeHomePng = ref<boolean>(false);
  const activityStatus = ref<string>('');
  const activityclaimed = ref<boolean>(false);
  const tabBarHeight = computed(() => elementStore.tabBarHeight)  // 底部导航栏高度

  const showRechargeBonusGet = computed(() => isEndTimes.value && activityStatus.value == 'PROCESSING' && !activityclaimed.value);

  // 监听是否其他页面切换到主页
  watch(() => route.path, (patch) => {
    if (patch === '/main/inicio') {
      emitter.emit('/activity/list');
    }
  })

  initPage();
  function initPage() {
    emitter.on('recharge/bonus/detail', async (res) => {
      showRechargeHomePng.value = res?.homeEntry;
      if (!showRechargeHomePng.value) return;            // 是否显示入口图标，不显示就没必要往下走
      activityclaimed.value = res?.receivedLevelIds.length;
      const currentToday = currentDate.day();
      activityStatus.value = res?.status;
      if (res?.appIconUrl) {
        rechargeBonusImg.value = res?.appIconUrl;
        if (res?.appIconUrl.includes('activityStar/rechargePromotion/rechargePromotion_')) {
          rechargeBonusImgIdx.value = Number(res?.appIconUrl.split('activityStar/rechargePromotion/rechargePromotion_')[1].split('.')[0]);
        } 
      } else {
        const defaultPng = await rechargeBonusPng.homeRechargeBonusPng();
        rechargeBonusImg.value = defaultPng.default;
      }
      isEndTimes.value = handleCountDownType(res, currentToday);
      handleCountdownTime(currentToday,res);
    })
  }

  // 处理倒计时 时间显示
  function handleCountdownTime(currentToday: number, res: rechargeBonusModel) {
    timer.value && clearInterval(timer.value);
    timer.value = setInterval(() => {
      let countDownSeconds = 0;
      const currentDateTime = getCurrentLocalTime() as dayjs.Dayjs;
      if (isEndTimes.value) {
        if (res?.status == 'FINISHED') {
          countDownSeconds = handleShowEndTimeSecond(res);
        } else {
          const currentEndDateTime = currentDateTime.endOf('day');
          countDownSeconds = currentEndDateTime.diff(currentDateTime, 'second');
        }
      } else {
        if (res?.status == 'PENDING') {
          countDownSeconds = handleDateToSecond(res);
        } else {
          const startDays = handleAddDays(res?.activityDay,currentToday) -1;
          const currentEndDateTime = dayjs(currentDateTime).add(startDays,'day').endOf('day');
          countDownSeconds = currentEndDateTime.diff(currentDateTime, 'second');
        }
      }
      if (countDownSeconds <= 0) {
        clearInterval(timer.value);
        countDownTimeStr.value = '00:00:00:00';
      } else {
        let remainingTime = countDownSeconds;
        const days = Math.floor(remainingTime / (24 * 3600));
        remainingTime -= days * 24 * 3600;
        const hours = Math.floor(remainingTime / 3600);
        remainingTime -= hours * 3600;
        const minutes = Math.floor(remainingTime / 60);
        remainingTime -= minutes * 60;
        const seconds = remainingTime;
        countDownTimeStr.value = `${handleTimeShow(days)}:${handleTimeShow(hours)}:${handleTimeShow(minutes)}:${handleTimeShow(seconds)}`;
      }
    },1000);
  }

  // 开始倒计时天数时间戳
  function handleStartUnix(days: number) {
    return days * 24 * 60 * 60;
  }

  // 处理时间小于10时显示
  function handleTimeShow(time: number) {
    return Number(time) < 10 ? Number(time) == 0 ? '00' : '0' + time : time;
  }

  // 充值大酬宾图标 click 事件
  function rechargeBonusImgClick() {
    if (activityStore?.activityList.length) {
      const activityObj = activityStore.activityList.find(item => item.type == 'RechargePromotion');
      if (!activityObj?.id) return;
      router.push(`/activity/RechargePromotion/${activityObj.id}`);
    }
  }

  // 首页充值酬宾入口默认图片
  const rechargeBonusPng = {
    homeRechargeBonusPng: () => import('@/assets/img/activity/rechargePromotion/rechargePromotion_1.png'),
  }

  return {
    countDownTimeStr,
    rechargeBonusImg,
    rechargeBonusImgIdx,
    showRechargeHomePng,
    showRechargeBonusGet,
    tabBarHeight,
    rechargeBonusImgClick
  }
}
