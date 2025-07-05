
import {
  InfiniteScrollCustomEvent
} from '@ionic/vue'
import {
  getCustomerActivityId,
  formatMoneyToShow,
  convertMoneyToShow,
} from '@/utils'
import { getUserReceivedListApi } from '@/api/activity';
import type { TWinType, } from '@/views/activity/luckyBet/type'
import { winTypeList, statusList } from '@/views/activity/luckyBet/type'
export default () => {
  const tenantStore = useTenantStore();
  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy); // 当前商户货币
  const infiniteRef = ref();
  const recordList = ref<any[]>([]);
  const loadMore = ref('more');
  const loading = ref(false);
  const { t } = useI18n();
  const pageInfo = {
    page: 1,
    pageSize: 8
  }
  const { id } = getCustomerActivityId();
  const headerList = [t('luckyBetSlip.000011'), t('luckyBetSlip.000012'), t('luckyBetSlip.000013')]
  const statusMap = {
    [statusList[0]]: t('luckyBetSlip.000014'),
    [statusList[1]]: t('luckyBetSlip.000015'),
    [statusList[2]]: t('luckyBetSlip.000016')
  }

  const splitStringByLastEight = (str: string) => {
    const head = str.slice(0, -8)
    const tail = str.slice(-8)

    return { head, tail };
  }
  const convertTailNumber = (str: string, condition: string) => str.replace(new RegExp(condition + '$'), `<span class='winning-numbers'>${condition}</span>`)

  const convertConsecutiveNumber = (str: string, condition: string) => str.replace(new RegExp(condition), `<span class='winning-numbers'">${condition}</span>`)
  const convertContains = (str: string, condition: string, count: number): string => {
    let conditionCount = 0;
    // 使用 replace 方法替换前 count 个 condition
    return str.replace(new RegExp(condition, 'g'), (match) => {
      if (conditionCount < count) {
        conditionCount++;
        return `<span class='winning-numbers'>${match}</span>`;
      }
      return match;
    });
  };

  // 测试


  const getrecordList = async () => {
    if (loading.value) return;
    loading.value = true;
    try {
      const res = await getUserReceivedListApi({
        activityId: id,
        page: pageInfo.page,
        pageSize: pageInfo.pageSize
      })
      console.log(res, res.userRewardList.length < pageInfo.pageSize, 'res')
      loading.value = false;
      if (res.userRewardList.length < pageInfo.pageSize) {
        loadMore.value = 'noMore';
      } else {
        loadMore.value = 'more';
      }
      const winTypeTextMap = {
        [winTypeList[0]]: convertTailNumber,
        [winTypeList[1]]: convertConsecutiveNumber,
        [winTypeList[2]]: convertContains
      }
      const rewardList = res.userRewardList.map(it => {
        const { id, status, awardCount, remake } = it
        const data = JSON.parse(remake)
        const orderNo = data.orderNo
        const winType = data.winType
        const condition = data.rewardConfig.condition
        const count = data.rewardConfig.count
        const { head, tail } = splitStringByLastEight(orderNo)

        return {
          id,
          orderNoHead: head,
          orderNoTail: winTypeTextMap[winType](tail, condition, count),
          status,
          statusValue: statusMap[status as StatusType],
          awardCount: convertMoneyToShow(awardCount)
        }
      })
      console.log(rewardList, 'rewardList')
      recordList.value.push(...rewardList)
      // infiniteRef.value.$el.complete();
    } catch (error) {
      loading.value = false;
      // infiniteRef.value.$el.complete();
    }

  }

  getrecordList()

  const handleRefresh = async (event: CustomEvent) => {
    pageInfo.page = 1;
    recordList.value = []
    await getrecordList();

    // event.target.complete()
    event.detail.complete();
  }
  const ionInfinite = async (event: InfiniteScrollCustomEvent) => {

    console.log(event.target.complete, loadMore.value, 'event')


    pageInfo.page++;
    await getrecordList();
    event.target.complete();
  }
  return {
    merchantCy,
    recordList,
    loadMore,
    loading,
    infiniteRef,
    headerList,
    t,
    ionInfinite,
    handleRefresh
  }
}
