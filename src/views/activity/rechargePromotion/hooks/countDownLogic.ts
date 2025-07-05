import dayjs from 'dayjs'
import { computed, ref, onMounted } from 'vue'
import { getCurrentLocalTime } from '@/utils/date'
import { rechargeBonusModel } from '@/api/activity/model'
import { handleRechargeBtnType, handleAddDays, calculateWeekDays, handleDateToSecond, handleShowEndTimeSecond } from '../data'

export function useCountDownLogic(props: rechargeBonusModel) {
	const currentDate = getCurrentLocalTime() as dayjs.Dayjs
	const currentToday = ref<number>(1)
	const isStartTime = ref<boolean>(true)
	const timer = ref<NodeJS.Timeout | null>(null)
	const countDownTimeStr = ref<string>('00:00:00:00')

  const overCountDownList = computed(() => {
		const dateList = countDownTimeStr.value.split(':')
		return [
			{ name: 'viewsActivity.rechargePromotion17', value: dateList[0] },
			{ name: 'viewsActivity.rechargePromotion18', value: dateList[1] },
			{ name: 'viewsActivity.rechargePromotion19', value: dateList[2] },
			{ name: 'viewsActivity.rechargePromotion20', value: dateList[3] },
		]
	})

	onMounted(async () => {
		currentToday.value = calculateWeekDays(currentDate.day())
		const { result1, result2, result3 } = await handleRechargeBtnType(props?.activityDetail, currentToday.value);
		isStartTime.value = result2;
		handleCountdownTime(props?.activityDetail)
	})

  // 处理倒计时时间
	function handleCountdownTime(res: rechargeBonusModel) {
		timer.value && clearInterval(timer.value)
		timer.value = setInterval(() => {
			let countDownSeconds = 0
			const currentDateTime = getCurrentLocalTime() as dayjs.Dayjs
			if (isStartTime.value) {
				if (res?.status == 'PENDING') {
				  countDownSeconds = handleDateToSecond(res);
				} else {
					const startDays = handleAddDays(res?.activityDay, currentToday.value) -1;
					const currentEndDateTime = dayjs(currentDateTime).add(startDays,'day').endOf('day')
					countDownSeconds = currentEndDateTime.diff(currentDateTime, 'second')
				}
			} else {
				if (res?.status == 'FINISHED') {
					countDownSeconds =	handleShowEndTimeSecond(res);
				} else {
					const currentEndDateTime = currentDateTime.endOf('day')
					countDownSeconds = currentEndDateTime.diff(currentDateTime, 'second')
				}
			}
			if (countDownSeconds <= 0) {
				clearInterval(timer.value)
				countDownTimeStr.value = '00:00:00:00'
			} else {
				let remainingTime = countDownSeconds
				const days = Math.floor(remainingTime / (24 * 3600))
				remainingTime -= days * 24 * 3600
				const hours = Math.floor(remainingTime / 3600)
				remainingTime -= hours * 3600
				const minutes = Math.floor(remainingTime / 60)
				remainingTime -= minutes * 60
				const seconds = remainingTime
				countDownTimeStr.value = `${days}:${hours}:${minutes}:${seconds}`
			}
		}, 1000)
	}

  // 处理时间小于10时显示
	function handleTimeShow(time: number) {
		return Number(time) < 10 ? (Number(time) == 0 ? '00' : '0' + time) : time
	}

  return {
    isStartTime,
    overCountDownList,
    handleTimeShow
  }
}
