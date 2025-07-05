import dayjs from 'dayjs';
import { showToast } from '@/utils'
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import { showLoading } from '@/utils/loading';
import { getCurrentLocalTime } from '@/utils/date';
import { computed, onBeforeMount, reactive, ref } from 'vue';
import { InfiniteScrollCustomEvent } from '@ionic/vue';
import { agencyAchievementApi, agencyAchievementDetailApi } from '@/api/agent';
import { AgencyAchievementModel, AgencyAchievementParams, AgencyAchievementDetailModel } from '@/api/agent/model';
import { concat } from '@/utils';  // @/utils

export function usePerformanceLogic() {
  const appStore = useAppStore();   // 系统信息
  const userStore = useUserStore(); // 用户信息

  const date = getCurrentLocalTime() as dayjs.Dayjs  // 当前日期对象

  const minDate = ref('');                                                // 最小可选日期
  const maxDate = ref(date.format());                                     // 最大可选日期
  const showPopover = ref(false);                                         // 是否显示日期选择器
  const loading = ref(false);                                             // 搜索框加载动画
  const searchValue = ref('');                                            // 搜索框输入值
  const detailModalState = ref(false);                                    // 详情弹窗状态
  const achievementDetail = ref<AgencyAchievementDetailModel['info']>();  // 业绩详情
  const list = ref<AgencyAchievementModel['info']['directList']>([]);     // 业绩列表
  const loadMore = ref(false);                                            // 加载更多状态

  const achievementParams = reactive<AgencyAchievementParams>({ // 获取玩家代理业绩请求接口参数
    page: 1,
    pageSize: 20,
    userId: 0,
    time: date.format('YYYY-MM-DD')
  });

  const userId = computed(() => userStore.user?.userId);            // 用户ID
  const locale = computed(() => appStore.locale.replace('_', '-')); // 语言
  const isToken = computed(() => appStore.token ? true : false)     // 是否未登录

  /**
   * 生命周期: 组件挂载前
   */
  onBeforeMount(async () => {
    minDate.value = dayjs().subtract(90, 'day').format(); // 设置最小可选日期(90天)
    if (!isToken.value) return                            // 未登录不获取信息
    await userStore.getUser();                            // 获取用户信息
    searchHandle();
  });

  /**
   * @description: 日期选择器关闭
   */
  function popoverDismiss() {
    showPopover.value = false;
  }

  /**
   * @description: 日期选择器选择日期
   */
  function dateChange(e: any) {
    achievementParams.time = dayjs(e.detail.value).format('YYYY-MM-DD');
    achievementParams.page = 1;
    list.value = [];
    getAchievement();
  }

  /**
   * @description: 搜索框确认输入事件
   */
  function searchHandle() {
    achievementParams.page = 1;
    list.value = [];
    getAchievement();
  }

  /**
   * @description: 详情按钮点击事件
   */
  async function detailHandle(id: number) {
    await getAchievementDetail(id);
    detailModalState.value = true;
  }

  /**
   * @description: 详情弹窗关闭事件
   */
  function detailModalDismiss() {
    detailModalState.value = false;
  }

  async function ionInfinite(ev: InfiniteScrollCustomEvent) {
    if (!loadMore.value) return
    achievementParams.page!++
    await getAchievement()
    ev.target.complete()
  }

  // id输入 限制不能输入负数和特殊字符
  function searchInput(event: CustomEvent) {
    const digitsOnly = event.detail.value.replace(/[^0-9]/g, '');
    const cleaned = digitsOnly.replace(/^0+/, '');
    searchValue.value = cleaned
    event.target.value = cleaned;
  }

  return {
    minDate,
    maxDate,
    showPopover,
    loading,
    searchValue,
    detailModalState,
    achievementDetail,
    list,
    achievementParams,
    userId,
    locale,
    isToken,
    popoverDismiss,
    dateChange,
    searchHandle,
    detailHandle,
    detailModalDismiss,
    loadMore,
    ionInfinite,
    searchInput
  }

  /**
   * @description 接口调用: 业绩列表
   */
  async function getAchievement() {
    if (!isToken.value) return                            // 未登录不获取信息
    if (searchValue.value) {
      achievementParams.userId = Number(searchValue.value)
    } else {
      achievementParams.userId = userId.value || 0;
    }
    loading.value = true;
    try {
      const res: any = await agencyAchievementApi(achievementParams);
      if (res && 'info' in res) {
        const { directList, total } = res.info;
        list.value = concat(list.value, directList);
        loadMore.value = total > list.value.length;
      } else if (res && 'message' in res) {
        showToast(res.message);
      }
    } catch (error) {
      list.value = []
    }
    loading.value = false;
  }

  /**
   * @description 接口调用: 获取代理业绩详情
   */
  async function getAchievementDetail(id: number) {
    showLoading();
    const res = await agencyAchievementDetailApi({ userId: id });
    if (res && 'info' in res)
      achievementDetail.value = res.info;
  }
}
