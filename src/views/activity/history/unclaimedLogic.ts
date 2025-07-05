// 未领取记录 逻辑层
import { useI18n } from 'vue-i18n'
import { ref, reactive, onBeforeMount, computed } from 'vue'
import { getActivityName } from './data'
import { moneyConvertToClient } from '@/utils/custom'
import { hideLoading, showLoading } from '@/utils/loading'
import { batchAwardApi, rewardRecordApi,redPointApi } from '@/api/activity'
import { getLocalTime } from '@/utils/date'
import { ActivityRecordModel, ActivityRecordParams } from '@/api/activity/model'
import { InfiniteScrollCustomEvent } from '@ionic/vue'
import { ZActivityAwardStatus } from '@/enums/types/activity.type'
import { concat } from '@/utils'
import { useAppStore } from '@/store/app'
import { useTenantStore } from '@/store/tenant'
import { showPopup } from '@/hooks/ShowPopup'
import { PopupType } from '@/components/Popup/data';
import { useActivityStore } from '@/store/activity';
import { throttleActivity } from '@/utils';

export default function useUnclaimedLogic() {
  const { t } = useI18n() // 多语言
  const route = useRoute();
  const activityStore = useActivityStore(); // 活动store
  const tenantStore = useTenantStore() // 商户信息
  const systemStore = useSystemStore() // 系统信息
  const vipStore = useVipStore(); // vip store
  const elementStore = useElementStore();
  const loading = ref(false) // 加载状态
  const rewardTotal = ref('0') // 奖金总额
  const loadMore = ref('more') // 加载更多状态
  const recordList = ref<ActivityRecordModel['recordList']>([]) // 游戏记录列表
  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy) // 当前商户货币
  const showEmpty = computed(() => !loading.value && !recordList.value.length)  // 显示暂无数据
  const tabBarHeight = computed(() => elementStore.tabBarHeight)                        // 底部导航栏高度

  const activityRecordParams = reactive<ActivityRecordParams>({
    status: ZActivityAwardStatus.enum.DISTRIBUTED,
    page: 1,
    pageSize: 20,
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
      rewardTotal.value = '0'
      getActivityRecord()
    }
  })

  /**
   * 触底加载更多事件
   */
  async function ionInfinite(ev: InfiniteScrollCustomEvent) {
    if (loadMore.value == 'noMore') return
    activityRecordParams.page!++
    await getActivityRecord()
    ev.target.complete()
  }

  /**
   * 生命周期: 组件挂载前
   */
  onBeforeMount(() => {
    getActivityRecord()
  })

  /**
   * 接口调用: 获取待领取记录
   */
  async function getActivityRecord() {
    if (!(await useAppStore().checkUserHasLogin())) return
    loading.value = true
    const lang = await useAppStore().getLocale()
    if (activityRecordParams.page === 1) showLoading()
    const res = await rewardRecordApi(activityRecordParams)
    const { all, randomAmount, total } = res
    if (total) {
      // 有未领取的数据 两个地方都显示所有的红点
      activityStore.isHasUnclaimed = true
      activityStore.isShowTabRedPoint = true
    } else {
      //优惠tab 显示红点要查数据
      activityStore.setRedPointList()
      activityStore.isHasUnclaimed = false
    }

    loading.value = false
    const tempArr = res.recordList.map((item) => {
      try {
        item.remake = JSON.parse(item.remake as string)
      } catch (error) {
        console.error('JSON.parse error:', error)
      }
      return {
        ...item,
        time: getLocalTime(item.time!, 'MM/DD HH:mm'),
        activityName: screeningNewsTasks(item, lang),
      }
    })
    recordList.value = concat(recordList.value, tempArr)
    rewardTotal.value = all.allAmount
      ? moneyConvertToClient(all.allAmount).toString()
      : `${moneyConvertToClient(randomAmount.allMinAmount)}~ ${moneyConvertToClient(randomAmount.allMaxAmount)}`
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

  /**
   * 接口调用: 一键领取
   */
  const receiveHandle = throttleActivity(async () => {
    const isTrue = recordList.value?.length > 0
    if (!isTrue) return
    showLoading()
    const data = await batchAwardApi({
      appType: systemStore.app?.build
    })
    let amount = data.awardInfo.reduce((accumulator, currentValue) => accumulator + currentValue.awardCount, 0)
    if (data.vipInfo) {
      amount += data.vipInfo.amount
    }
    const taskInfoAmount = data.taskInfo?.amount || 0;
    amount += taskInfoAmount;
    showPopup({
      type: PopupType.BONUS,
      msg: amount == 0 ? t('popup.activityLimitMsg07') : t('popup.tips04', { amount: merchantCy.value + convertMoneyToShow(amount) }),
    })
    hideLoading()
    activityRecordParams.page = 1
    recordList.value = []
    getActivityRecord()
    const activityShowData = await redPointApi( { activityIds: [] } ) as any;
    vipStore.claimBtnIsEnable = giveIfShowRedPoint(activityShowData)
  })

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
  
  return {
    recordList,
    rewardTotal,
    loading,
    loadMore,
    showEmpty,
    ionInfinite,
    receiveHandle,
    tabBarHeight,
  }
}
