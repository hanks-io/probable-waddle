import { getCustomerActivityId} from '@/utils';
import { directRechargeListApi } from '@/api/activity';
import { delay } from '@/utils/delay';
import {  convertMoneyToShow} from '@/utils';
export const useCommissionDetailLogic = () => {
  const tenantStore = useTenantStore();
  const userStore = useUserStore()

  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy); // 当前商户货币
  const tenantId = computed(() => tenantStore.tenantId) // 商户ID
  const userId = computed(() => userStore.user?.userId)
  const { id } = getCustomerActivityId();
  const loadMore = ref('more');                                   // 加载更多状态
  const loading = ref(false);                                     // 加载状态
  const pageInfo = {
    page: 1,
    pageSize: 20
  }
  const infiniteRef = ref();                                      // 上拉加载更多组件DOM
  const directRechargeList = ref([])
  const getDirectRechargeList = async () => {
    if (loading.value) return;
    loading.value = true;
    if (!userId.value) {
      await userStore.getUser()
    }
    try {
     const res = await directRechargeListApi({ issue: 1, activityId: Number(id), tenantId: Number(tenantId.value), userId: Number(userId.value), ...pageInfo })
      loading.value = false;
      if (res.list.length < pageInfo.pageSize) {
        loadMore.value = 'noMore';
      } else {
        loadMore.value = 'more';
      }
    const detailsList = res.list?.map((it: any) => {
      return {
        ...it,
        totalRecharge: convertMoneyToShow(it.totalRecharge)
      }
    }) as any[]
      directRechargeList.value.push(...detailsList)
      infiniteRef.value.$el.complete();
    } catch (error) {
      loading.value = false;
      infiniteRef.value.$el.complete();
    }

  }
  getDirectRechargeList()
  const handleRefresh = async (event: CustomEvent) => {
    pageInfo.page = 1;
    directRechargeList.value = []
    await getDirectRechargeList();
    event.detail.complete();
  }
  const ionInfinite = async () => {
    if (loadMore.value == 'noMore') return;
    await delay(1000);
    pageInfo.page++;
    getDirectRechargeList();
  }

  return {
    merchantCy,
    directRechargeList,
    loadMore,
    loading,
    infiniteRef,
    ionInfinite,
    handleRefresh
  }
}

