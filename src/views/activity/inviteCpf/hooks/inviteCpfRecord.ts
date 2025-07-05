import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/store/app'
import { useActivityStore } from "@/store/activity";
import { computed, ref, reactive, watch } from 'vue';
import { handleStatementSelectTime } from '@/utils/reportTime'
import { InviteCpfRecordParams } from '@/api/activity/model';
import { inviteCpfRecordApi } from '@/api/activity';
import { getCustomerActivityId, moneyConvertToClient } from '@/utils/custom'
import { formatToDateTime } from '@/utils/date';
import { showLoading, hideLoading } from '@/utils/loading';
import { ZTActivityTypes } from '@/enums/types/activity.type'

export function useInviteCpfRecord (){
  const { t } = useI18n();
  const { id } = getCustomerActivityId();
  const appStore = useAppStore();
  const activityStore = useActivityStore(); // 活动store

  const infiniteRef = ref<any>(null);	                      // 下拉加载更多组件DOM(用于重置状态)
  const recordList = ref<any>([]);                          // CPF邀请记录数据
  const changeTime = ref<string>('today');                  // 时间类型
  const timePopoverVisible = ref<boolean>(false);           // 时间筛选弹出层显示状态
  const loadMore = ref<string>('more');                     // 加载更多状态

  // 页码请求参数
  const inviteCpfRecordParams = reactive<InviteCpfRecordParams>({
    page: 1,
    pageSize: 20,
    activityId: Number(id),
    startTime: ''
  })

  const isToken = computed(() => appStore.token ? true : false);
  const currentTimeList = computed(() => {
    return [
      { name: t('main.all'), value: 'all' },
      { name: t('date.today'), value: 'today' },
      { name: t('date.lastSevenDays'), value: 'lastSevenDays' },
      { name: t('date.lastThirtyDays'), value: 'lastThirtyDays' },
    ]
  });
  const tableTitleList = computed(() => {
    const { defStyle } = getCustomerActivityId();
    return defStyle == 'style_0' ? [
      { name: t('activity.agent31'), size: 3 },
      { name: t('main.register') + t('activity.time'), size: 3 },
      { name: t('activity.Recharge'), size: 3 },
      { name: t('label.bettings'), size: 3 },
    ] : [
      { name: t('activity.agent31'), size: 3 },
      { name: t('activity.Recharge'), size: 3 },
      { name: t('label.bettings'), size: 3 },
      { name: t('main.register') + t('activity.time'), size: 3 },
    ]
  })
  const unShowEmpty = computed(() => recordList?.value.length > 0);
  const isStyle2 = computed(() => {
    const { defStyle } = getCustomerActivityId();
    return defStyle && defStyle  == 'style_2';
  })
  
  // create init初始化
  initVue()
  function initVue() {
  }


  // 监听时间类型变化
  watch(() => changeTime.value, async (val) => {
    if (val == 'all') {
      const activityList = (await activityStore.getActivityList()) as any[];
      const cpfActivity = activityList.find(item => [ZTActivityTypes.enum.CPFActivity, ZTActivityTypes.enum.WalletUserActivity].includes(item.type));
      if (cpfActivity.startTime) {
        inviteCpfRecordParams.startTime = cpfActivity.startTime.toISOString();
      }
    } else {
      const dateObj = handleStatementSelectTime(val);
      inviteCpfRecordParams.startTime = dateObj?.startTime;
    }
    inviteCpfRecordParams.page = 1;
    loadMore.value = 'more';
    recordList.value = [];
    getInviteCpfRecordDetail();
  }, { immediate: true })

  /**
  * @description 时间类型选择器点击事件
  */
  function timeSelectHandle() {
    timePopoverVisible.value = true
  }

  /**
   * @description 选择时间类型
   */
  function selectedTime(value: string) {
    changeTime.value = value
    setTimeout(() => {
      timePopoverVisible.value = false;
    }, 300);
  }

  /**
  * @description 触底加载更多事件
  */
  async function ionInfinite() {
    if (loadMore.value == 'noMore') return;
    inviteCpfRecordParams.page! ++;
    await getInviteCpfRecordDetail();
  }

  // 获取CPF邀请记录
  async function getInviteCpfRecordDetail() {
    if (!isToken.value) return;
    showLoading();
    try {
      const res = await inviteCpfRecordApi(inviteCpfRecordParams);
      const pageSizeNum: number = inviteCpfRecordParams.pageSize ?? 20;
      const totalNum: number =  res?.total?.count;
      const listLength: number = res?.list?.length ?? 0;
      // 处理金额/时间显示
      if (listLength > 0) {
        res?.list.forEach((item: any) => {
          item.recharge = moneyConvertToClient(item.recharge);
          item.validBet = moneyConvertToClient(item.validBet);
          item.registerTime = formatToDateTime(item.registerTime);
        })
      }
      // 处理触底加载数据整合
      if (inviteCpfRecordParams.page == 1) {
        recordList.value = res?.list;
      } else {
        recordList.value = recordList.value.concat(res?.list);
      }
      // 处理触底加载更多状态
      const isEquivalent = listLength == pageSizeNum && totalNum == pageSizeNum;
      if (listLength < pageSizeNum || isEquivalent) {
        loadMore.value = 'noMore';
      } else {
        loadMore.value = 'more';
      }
    } catch (error) {
      loadMore.value = 'noMore';
    } finally {
      hideLoading();
      if (infiniteRef.value) {
        infiniteRef.value.$el.complete();
      }
    }
  }

  /**
  * @description 弹出层关闭事件
  */
  function dismissHandle() {
    timePopoverVisible.value = false;
  }

  return {
    recordList,
    changeTime,
    timePopoverVisible,
    currentTimeList,
    tableTitleList,
    unShowEmpty,
    isStyle2,
    loadMore,
    infiniteRef,
    timeSelectHandle,
    selectedTime,
    dismissHandle,
    ionInfinite
  }
}


export const useComponents = () => {
  const { defStyle } = getCustomerActivityId();
  const templateList = {
    'style_0': () => import(`@/views/activity/inviteCpf/components/record/default/index.vue`),
    'style_1': () => import(`@/views/activity/inviteCpf/components/record/fixedSkin/index.vue`),
    'style_2': () => import(`@/views/activity/inviteCpf/components/record/fixedSkin/index.vue`)
  }
  return markRaw(defineAsyncComponent(templateList[defStyle])) as unknown as ComponentPublicInstance;
}
