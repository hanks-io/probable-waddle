import dayjs from 'dayjs';
import { getCurrentLocalTime, getTodayLocalDateStr, getBeforeLocalDateStr, getUtcTime } from '@/utils/date';

/**
 * @description 根据后台商户配置时间返回查询列表数据
 * @param reportTimeRange APP端记录保留时间
 */
export function tenantReportTimeList(reportTimeRange: number | string) {
  switch (Number(reportTimeRange)) {
    case 3:
      return [
        { name: 'today', value: 1 },
        { name: 'lastThreeDays', value: 3 }]
    case 5:
      return [
        { name: 'today', value: 1 },
        { name: 'lastThreeDays', value: 3 },
        { name: 'lastFiveDays', value: 5 }]
    case 7:
      return [
        { name: 'today', value: 1 },
        { name: 'lastThreeDays', value: 3 },
        { name: 'lastFiveDays', value: 5 },
        { name: 'lastSevenDays', value: 7 }
      ]
    case 15:
      return [
        { name: 'today', value: 1 },
        { name: 'lastThreeDays', value: 3 },
        { name: 'lastFiveDays', value: 5 },
        { name: 'lastSevenDays', value: 7 },
        { name: 'lastFifteenDays', value: 15 }]
    case 30:
      return [
        { name: 'today', value: 1 },
        { name: 'lastThreeDays', value: 3 },
        { name: 'lastFiveDays', value: 5 },
        { name: 'lastSevenDays', value: 7 },
        { name: 'lastFifteenDays', value: 15 },
        { name: 'lastThirtyDays', value: 30 }]

    default:
      return []
  }
}

/**
 * @description 根据时间类型返回查询时间对象--账户明细/投注记录
 * @param name 时间类型
 */
export function handleStatementSelectTime(name: string) {
  const date = getCurrentLocalTime() as dayjs.Dayjs;       // 当前时间
  const today = (getUtcTime(date.endOf('day')) as dayjs.Dayjs).format();
  const daysMap: { [key: string]: number } = {
    'today': 0,
    'lastThreeDays': 2,
    'lastFiveDays': 4,
    'lastSevenDays': 6,
    'lastFifteenDays': 14,
    'lastThirtyDays': 29
  };

  if (daysMap[name] !== undefined) {
    return {
      startTime: (getUtcTime(date.subtract(daysMap[name], 'day').startOf('day')) as dayjs.Dayjs).format(),
      endTime: today
    };
  }
}

/**
 * @description 根据时间类型返回查询时间对象--个人报表
 * @param name 时间类型
 */
export function handlePersonSelectTime(name: string) {
  const daysMap: { [key: string]: number } = {
    'today': 0,
    'lastThreeDays': 2,
    'lastFiveDays': 4,
    'lastSevenDays': 6,
    'lastFifteenDays': 14,
    'lastThirtyDays': 29
  };

  if (daysMap[name]) {
    return {
      startTime: getBeforeLocalDateStr(daysMap[name]),
      endTime: getTodayLocalDateStr()
    };
  } else {
    return {
      startTime: getTodayLocalDateStr(),
      endTime: getTodayLocalDateStr()
    }
  }
}

