import dayjs from 'dayjs'
import { rechargeBonusModel } from '@/api/activity/model'
import { getCurrentLocalTime, getLocalTime } from '@/utils/date'

type PngResources = {
  topBgImg: () => Promise<typeof import('*.png')>;
};

type dynamicImgTsList = {
  [key: string]: PngResources;
};

export type rechargeItemObj = {
  auditMultiple: number,
  needBetAmount: number,
  rechargeAmount: number,
  rewardAmount: number,
  totalAmount: number,
  uuid: string,
  virtualRewardRatio: number,
  activityId: number,
  activityType: string
}

export type rechargeModalProps = {
  countryCode: string,
  rechargeItemInfo: rechargeItemObj
}

export const rechargePromotionDynamicImg: dynamicImgTsList = {
  'blue-default': {
    topBgImg: () => import('@/assets/img/activity/rechargePromotion/blue-default-topBg.png'),
  },
  'green-dark': {
    topBgImg: () => import('@/assets/img/activity/rechargePromotion/green-dark-topBg.png'),
  },
  'green-default': {
    topBgImg: () => import('@/assets/img/activity/rechargePromotion/green-default-topBg.png'),
  },
  'yellow-dark': {
    topBgImg: () => import('@/assets/img/activity/rechargePromotion/yellow-dark-topBg.png'),
  },
  'auroral-yellow': {
    topBgImg: () => import('@/assets/img/activity/rechargePromotion/auroral-yellow-topBg.png'),
  },
  'purple-light': {
    topBgImg: () => import('@/assets/img/activity/rechargePromotion/purple-light-topBg.png'),
  },
  'amber-purple': {
    topBgImg: () => import('@/assets/img/activity/rechargePromotion/amber-purple-topBg.png'),
  },
  'forest-green': {
    topBgImg: () => import('@/assets/img/activity/rechargePromotion/forest-green-topBg.png'),
  },
  'new-skin-symbol': {
    topBgImg: () => import('@/assets/img/activity/rechargePromotion/phantom-blue-topBg.png'),
  }
}

export const handleRechargeBtnType = (res: rechargeBonusModel, currentToday: number) => {
  let disabledBtn: boolean = false;
  let isStartTime: boolean  = true;
  let rechargedId: string | null = null;
  switch(res?.status) {
    case 'PENDING':              // 待生效
      disabledBtn = true;
      break;
    case 'PROCESSING':           // 进行中
		  isStartTime = currentToday == res?.activityDay ? false : true;
      if (res?.receivedLevelIds.length && res?.activityConfig.length) {
		  	rechargedId = res?.receivedLevelIds[0];
		  	disabledBtn = res?.activityConfig.some((item: any) => {
		  		return item.uuid == rechargedId;
		  	});
		  }
      break;
    case 'FINISHED':             // 已结束
      isStartTime = false;
      disabledBtn = true;
      break;
    default:
  }
  return { result1: disabledBtn, result2: isStartTime, result3: rechargedId };
}

export const handleCountDownType = (res: rechargeBonusModel, currentToday: number) => {
  switch(res?.status) {
    case 'PENDING':
      return false;
    case 'PROCESSING':
      return currentToday == res?.activityDay ? true : false;
    case 'FINISHED':
     return true;
  }
}

export const handleAddDays = (activityWeekDay: number, currentDay: number) => {
  const calculateDay = activityWeekDay - currentDay;
  const addDays = calculateDay < 0 ? calculateDay + 7 : calculateDay;
  return addDays;
}

export const calculateWeekDays = (days: number) => {
  return days == 0 ? 7 : days;
}

export function handleDateToSecond(res: rechargeBonusModel) {
  const currentDateTime = getCurrentLocalTime() as dayjs.Dayjs;
  const startTimes = getLocalTime(res?.startTime);
  let startWeekDay = calculateWeekDays(dayjs(startTimes).day());
  if (res?.activityDay == startWeekDay) {
    return dayjs(startTimes).diff(currentDateTime, 'second');
  } else {
    const addSeconds = handleAddDays(res?.activityDay, startWeekDay);
    const newStartTimes = dayjs(startTimes).add(addSeconds,'day');
    return newStartTimes.diff(currentDateTime, 'second');
  }
}

export function handleShowEndTimeSecond(res: rechargeBonusModel) {
  const currentDateTime = getCurrentLocalTime() as dayjs.Dayjs;
  const showEndTimes = getLocalTime(res?.showEndTime);
  // return dayjs(showEndTimes).diff(currentDateTime,'second');
  return 0;
}
