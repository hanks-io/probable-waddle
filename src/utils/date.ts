import { useTenantStore } from '@/store/tenant'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isoWeek)
export type Time = string | dayjs.Dayjs | Date

export type Dayjs = dayjs.Dayjs

const tenantStore = () => useTenantStore()

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
const DATE_FORMAT = 'YYYY-MM-DD'
const TIMEZONE_SHANGHAI = 'Asia/Shanghai'

let localTimezone

/**
 * 根据世界零时时间获取本地时间<商户时区>
 * @param time 时间
 * @param format 格式化
 */
export const getLocalTime = (time: Time, format?: string) => {
	localTimezone = tenantStore().tenantInfo?.timezone || TIMEZONE_SHANGHAI
	if (format) {
		return dayjs.utc(time).tz(localTimezone).format(format)
	}
	return dayjs.utc(time).tz(localTimezone)
}

/**
 * 根据世界零时时间将格式化为时分秒格式<商户时区>(字符串)
 * @param time 时间
 * @param format 格式化后的时间
 */
export const formatToDateTime = (time: Time, format = DATE_TIME_FORMAT) => {
	localTimezone = tenantStore().tenantInfo?.timezone || TIMEZONE_SHANGHAI
	return dayjs.utc(time).tz(localTimezone).format(format)
}

/**
 * 根据世界零时时间将格式化为年月日格式<商户时区>(字符串)
 * @param time 时间
 * @param format 格式化后的日期
 */
export const formatToDate = (time: Time, format = DATE_FORMAT) => {
	localTimezone = tenantStore().tenantInfo?.timezone || TIMEZONE_SHANGHAI
	return dayjs.utc(time).tz(localTimezone).format(format)
}

/**
 * 根据本地时间<商户时区>获取UTC时间<世界零时间>
 * @param time 时间
 * @param format 格式化
 */
export const getUtcTime = (time: Time, format?: string) => {
	localTimezone = tenantStore().tenantInfo?.timezone || TIMEZONE_SHANGHAI
	if (format) {
		return dayjs(time).tz(localTimezone).utc().format(format)
	}
	return dayjs(time).tz(localTimezone).utc()
}

/**
 * 获取当前本地时间<商户时区>
 * @param format 格式化
 */
export const getCurrentLocalTime = (format?: string) => {
	localTimezone = tenantStore().tenantInfo?.timezone || TIMEZONE_SHANGHAI
	if (format) {
		return dayjs().tz(localTimezone).format(format)
	}
	return dayjs().tz(localTimezone)
}

/**
 * 获取本地时间<商户时区>的明天日期
 * @param format 格式化
 */
export const getTomorrowLocalDate = (format?: string) => {
	localTimezone = tenantStore().tenantInfo?.timezone || TIMEZONE_SHANGHAI
	if (format) {
		return dayjs().tz(localTimezone).add(1, 'day').format(format)
	}
	return dayjs().tz(localTimezone).add(1, 'day')
}

/**
 * 获取本地时间<商户时区>的今天日期<字符串>
 */
export const getTodayLocalDateStr = () => {
	localTimezone = tenantStore().tenantInfo?.timezone || TIMEZONE_SHANGHAI
	return dayjs().tz(localTimezone).format(DATE_FORMAT)
}

/**
 * 获取本地时间<商户时区>的今天之前的日期(默认昨天)<字符串>
 * @param days 天数
 */
export const getBeforeLocalDateStr = (days: number = 1) => {
	localTimezone = tenantStore().tenantInfo?.timezone || TIMEZONE_SHANGHAI
	return dayjs().tz(localTimezone).subtract(days, 'day').format(DATE_FORMAT)
}

/**
 * 根据本地时间<商户时区>字符串获取时间对象
 */
export const getLocalTimeByString = (time: string) => {
	localTimezone = tenantStore().tenantInfo?.timezone || TIMEZONE_SHANGHAI
	return dayjs.tz(time, localTimezone)
}

/**
 * 计算目标时间和当前时间的时差
 * @param targetTime  目标时间
 */
export const calcTimeDiff = (targetTime: Time) => {
	let tz = tenantStore().tenantInfo?.timezone || TIMEZONE_SHANGHAI

	let currentTime = dayjs().tz(tz)

	let targetTimeTz = dayjs.utc(targetTime).tz(tz)
	// console.log(tz,  dayjs(targetTime).format(DATE_TIME_FORMAT), currentTime.format(DATE_TIME_FORMAT), targetTimeTz.format(DATE_TIME_FORMAT), 'targetTimeTz');
	type Unit = 'd' | 'day' | 'hour' | 'h' | 'minute' | 'm' | 'second' | 's' // 增加秒单位
	const getTimeDiff = (unit: Unit) => {
		return targetTimeTz.diff(currentTime, unit)
	}
	const day = getTimeDiff('d')
	const hour = getTimeDiff('h')
	const minute = getTimeDiff('m')
	const second = getTimeDiff('s') // 计算秒数差
	return { day, hour, minute, second }
}

export const calcDifference = (startTime: Time, endTime: Time) => {
	return dayjs(endTime).diff(startTime, 'ms')
}

/**
 * 获取时间范围
 * @param type 类型 'week' | 'month' | 'day'
 * @param offset 偏移量
 * @param format 格式化
 */
const getTimeRange = (type: 'week' | 'month' | 'day', offset: number = 0, format?: string) => {
	let start = dayjs()

	let end = start

	if (offset !== 0) {
		start = start.subtract(Math.abs(offset), type)
		end = end.subtract(Math.abs(offset), type)
	}

	const startUnit = type === 'week' ? 'isoWeek' : type
	start = start.startOf(startUnit)
	end = end.endOf(startUnit)

	if (format) {
		return {
			start: start.format(format),
			end: end.format(format)
		}
	}

	return { start, end }
}

/**
 * 获取当前周的开始和结束时间
 * @param format 格式化
 */
export const getCurrentWeekRange = (format?: string) => {
	return getTimeRange('week', 0, format)
}

/**
 * 获取上周的开始和结束时间
 * @param format 格式化
 */
export const getLastWeekRange = (format?: string) => {
	return getTimeRange('week', 1, format)
}

/**
 * 获取当前月的开始和结束时间
 * @param format 格式化
 */
export const getCurrentMonthRange = (format?: string) => {
	return getTimeRange('month', 0, format)
}

/**
 * 获取上月的开始和结束时间
 * @param format 格式化
 */
export const getLastMonthRange = (format?: string) => {
	return getTimeRange('month', 1, format)
}

/**
 * 获取当前天的开始和结束时间
 * @param format 格式化
 */
export const getCurrentDayRange = (format?: string) => {
	return getTimeRange('day', 0, format)
}

/**
 * 获取昨天的开始和结束时间
 * @param format 格式化
 */
export const getYesterdayRange = (format?: string) => {
	return getTimeRange('day', 1, format)
}
