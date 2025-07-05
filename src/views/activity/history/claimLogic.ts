// 活动领取记录 逻辑层
import { concat } from '@/utils'
import dayjs from 'dayjs'
import { ref, reactive, onBeforeMount, computed } from 'vue'
import { ActivityRecordItem, ActivityRecordParams } from '@/api/activity/model'
import { getCurrentLocalTime, getUtcTime, getLocalTime } from '@/utils/date'
import { rewardRecordApi } from '@/api/activity'
import { moneyConvertToClient } from '@/utils/custom'
import { ZActivityAwardStatus } from '@/enums/types/activity.type'
import { getActivityName } from './data'
import { useI18n } from 'vue-i18n'
import { showLoading } from '@/utils/loading'
import { InfiniteScrollCustomEvent } from '@ionic/vue'
import { useAppStore } from '@/store/app'

export default function useClaimLogic() {
  const { t } = useI18n()
  const route = useRoute();
  const dateIndex = ref(0) // 日期选择
  const loading = ref(false) // 加载状态
  const timer = ref(null)   // 定时器
  const rewardTotal = ref(0) // 奖金总额
  const loadMore = ref('more') // 加载更多状态
  const datePopoverVisible = ref(false);           // 日期选择弹出层显示状态
  const recordList = ref<ActivityRecordItem[]>([]) // 游戏记录列表
  const date = getCurrentLocalTime() as dayjs.Dayjs // 当前时间

  const showEmpty = computed(() => !loading.value && !recordList.value.length)  // 显示暂无数据

  const activityRecordParams = reactive<ActivityRecordParams>({
    status: ZActivityAwardStatus.enum.RECEIVED,
    page: 1,
    pageSize: 15,
    order: [
      {
        key: 'time',
        type: 'desc',
      },
    ],
  })

  // 监听当前路由变动
  watch(() => route.fullPath, () => {
    if (route.path == '/main/promo') {
      recordList.value = []
      rewardTotal.value = 0
      getActivityRecord()
    }
  })

  async function ionInfinite(ev: InfiniteScrollCustomEvent) {
    if (loadMore.value === 'noMore') return
    activityRecordParams.page!++
    await getActivityRecord()
    ev.target.complete()
  }
  /**
   * @description 日期选择器点击事件
   */
  function dateSelectHandle(event: any) {
    datePopoverVisible.value = !datePopoverVisible.value;
  }

  /**
   * 日期选择
   */
  function dateChangeHandle(event: CustomEvent) {
    switch (event.detail.value) {
      case 0: // 今天
        activityRecordParams.startTime = (getUtcTime(date.startOf('day')) as dayjs.Dayjs).format()
        activityRecordParams.endTime = (getUtcTime(date.endOf('day')) as dayjs.Dayjs).format()
        break
      case 1: // 昨天
        activityRecordParams.startTime = (
          getUtcTime(date.subtract(1, 'day').startOf('day')) as dayjs.Dayjs
        ).format()
        activityRecordParams.endTime = (getUtcTime(date.subtract(1, 'day').endOf('day')) as dayjs.Dayjs).format()
        break
      case 2: // 最近7天
        activityRecordParams.startTime = (
          getUtcTime(date.subtract(7, 'day').startOf('day')) as dayjs.Dayjs
        ).format()
        activityRecordParams.endTime = (getUtcTime(date.endOf('day')) as dayjs.Dayjs).format()
        break
      case 3: // 最近30天
        activityRecordParams.startTime = (
          getUtcTime(date.subtract(30, 'day').startOf('day')) as dayjs.Dayjs
        ).format()
        activityRecordParams.endTime = (getUtcTime(date.endOf('day')) as dayjs.Dayjs).format()
        break
    }
    recordList.value = []
    activityRecordParams.page = 1
    getActivityRecord()
  }

  /**
   * 生命周期: 组件挂载前
   */
  onBeforeMount(() => {
    dateChangeHandle({ detail: { value: 0 } } as CustomEvent)
  })

  /**
   * 接口调用: 获取领取记录
   */
  async function getActivityRecord() {
    if (!(await useAppStore().checkUserHasLogin())) return
    loading.value = true
    const lang = await useAppStore().getLocale()
    if (activityRecordParams.page === 1) showLoading()
    const res = await rewardRecordApi(activityRecordParams)
    loading.value = false
    const tempArr = res.recordList.map((item) => {
      try {
        item.remake = JSON.parse(item.remake as string)
      } catch (error) { }
      return {
        ...item,
        time: getLocalTime(item.time!, 'MM/DD HH:mm'),
        activityName: screeningNewsTasks(item, lang),
      }
    })
    recordList.value = concat(recordList.value, tempArr)
    rewardTotal.value = moneyConvertToClient(res.all.allAmount)
    if (res.recordList.length < activityRecordParams.pageSize!) {
      loadMore.value = 'noMore'
    } else {
      loadMore.value = 'more'
    }
  }

  function screeningNewsTasks(item: any, lang: string) {
    const { activityType, remake  } = item;
    if (activityType === 'NewbieTask') {
      const { taskTypeSub } = remake;
      return t(`task.${taskTypeSub}`)
    }
    return getActivityName(item, lang)
  }

  // 选择日期 
  function selectedDate(index: number) {
    dateIndex.value = index
    dateChangeHandle({ detail: { value: index } } as CustomEvent)
    clearTimeout(timer.value)
    timer.value = setTimeout(() => {
      datePopoverVisible.value = !datePopoverVisible.value
    }, 300)
  }

  /**
   * @description 计算日期字符串
   */
  function getDayStr(index: number) {
    switch (index) {
      case 0:
        return t('date.today');
      case 1:
        return t('date.yesterday');
      case 2:
        return t('date.lastSevenDays');
      case 3:
        return t('date.lastThirtyDays');
    }
  }

  return {
    dateIndex,
    rewardTotal,
    loadMore,
    recordList,
    datePopoverVisible,
    showEmpty,
    ionInfinite,
    dateSelectHandle,
    selectedDate,
    getDayStr,
  }
}
