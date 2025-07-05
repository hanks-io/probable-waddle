import i18n from '@/i18n';
import { useAppStore } from '@/store/app'
import { assetsChangeApi } from '@/api/personal';
import { useTenantStore } from "@/store/tenant";
import { moneyConvertToClient } from '@/utils/custom'
import { AssetChangeMainTypes, AssetChangeSubTypes } from '@/enums/types';
import { AssetsChangeParams, AssetsChangeModel } from '@/api/personal/model';
import { ref, watch, onBeforeMount, reactive, computed } from 'vue';
import { tenantReportTimeList, handleStatementSelectTime } from '@/utils/reportTime'
import { getRegionChangeSubTypes } from '@/utils';

export function useStatementLogic() {
  const { t } = i18n.global
  const appStore = useAppStore() 				                   // 用户信息
  const tenantStore = useTenantStore();                    // 租户信息

  const infiniteRef = ref<any>(null);	                                      // 上拉加载更多组件DOM(用于重置状态)
  const loadMore = ref('more');                                             // 加载更多状态
  const changeType = ref('all');                                            // 账变类型
  const changeTwoType = ref('allDetails');                                  // 账变类型子类
  const changeTime = ref('today');                                          // 时间类型
  const timePopoverVisible = ref(false);                                    // 时间筛选弹出层显示状态
  const subPopoverVisible = ref(false);                                     // 账变类型子类选择弹出层显示状态
  const typePopoverVisible = ref(false);                                    // 账变类型选择弹出层显示状态
  const assetsChangeInfo = reactive<any>({                                  // 账变统计信息
    totalRechargeAmountChange: 0,   // 累计充值
    totalWithdrawAmountChange: 0,   // 累计提现
    totalRewardAmountChange: 0      // 累计领取优惠
  });
  const scrollSelectionRef = ref<HTMLElement | null>(null);                 // 选择器滚动容器
  const assetsChangeList = ref<AssetsChangeModel['assetsChangeList']>([]);  // 账变记录列表

  const assetsChangeParams = reactive<AssetsChangeParams>({ // 提现记录参数
    page: 1,
    pageSize: 15,
    startTime: '',
    endTime: ''
  });

  const changeMainTypes = computed(() => {
    const mainTyps = AssetChangeMainTypes.filter(item => !['game', 'other'].includes(item))
    const dateList: any = [];
    mainTyps.forEach(item => {
      let obj = { type: item, isTrue: false }
      if (t(`option.${item}`).length > 25) {
        obj.isTrue = true
      }
      dateList.push(obj)
    })
    return dateList;
  })

  const changeSubTypes = computed(() => {
    const sunTypeList = getRegionChangeSubTypes(changeType.value, tenantStore.tenantInfo?.code);
    const dateList: any = []
    sunTypeList.forEach(item => {
      let obj = { type: item, isTrue: false }
      if (t(`option.${item}`).length > 25) {
        obj.isTrue = true
      }
      dateList.push(obj)
    })
    return dateList
  })
  // 当前商户报表查询时间列表
  const currentTimeList = computed(() => tenantReportTimeList(tenantStore.tenantInfo?.reportTimeRange));
  const isToken = computed(() => appStore.token ? true : false)    // 是否未登录
  const showEmpty = computed(() => !isToken.value || (loadMore.value == 'noMore' && !assetsChangeList.value.length))

  /**
   * 生命周期: 组件挂载前
   */
  onBeforeMount(() => {
  })

  // 监听时间类型变化
  watch(() => changeTime.value, (val) => {
    const dateObj = handleStatementSelectTime(val);
    assetsChangeParams.startTime = dateObj?.startTime;
    assetsChangeParams.endTime = dateObj?.endTime;
    assetsChangeParams.page = 1;
    loadMore.value = 'more';
    assetsChangeList.value = [];
    getAssetsChange();
  }, { immediate: true })
  // 监听账变类型变化
  watch(() => changeType.value, () => {
    changeTwoType.value = 'allDetails';
    assetsChangeParams.page = 1;
    loadMore.value = 'more'
    assetsChangeList.value = [];
    getAssetsChange();
  })
  // 监听账变类型子类变化
  watch(() => changeTwoType.value, (val) => {
    if (val) {
      assetsChangeParams.page = 1;
      loadMore.value = 'more'
      assetsChangeList.value = [];
      getAssetsChange();
    }
  })

  /**
   * @description 时间类型选择器点击事件
   */
  function timeSelectHandle(event: any) {
    scrollSelectedToCenter(event);
    timePopoverVisible.value = true
  }

  /**
   * @description 账变类型选择器点击事件
   */
  function typeSelectHandle(event: any) {
    scrollSelectedToCenter(event);
    typePopoverVisible.value = true;
  }

  /**
   * @description 计算账变类型名称
   */
  function getTypeName(type: string) {
    const changeType = changeMainTypes.value.find((item: any) => item.type === type);
    return changeType && changeType.type ? t(`option.${changeType.type}`) : t(`option.all`);
  }

  /**
   * @description 选择时间类型
   */
  function selectedTime(name: string) {
    changeTime.value = name
    setTimeout(() => {
      timePopoverVisible.value = false;
    }, 300);
  }

  /**
   * @description 选择账变类型
   */
  function selectedType(item: string) {
    changeType.value = item;
    setTimeout(() => {
      typePopoverVisible.value = false;
    }, 300);
  }

  /**
   * @description 账变子类型选择器点击事件
   */
  function subSelectHandle(event: any) {
    scrollSelectedToCenter(event);
    subPopoverVisible.value = true;
  }

  /**
   * @description 计算账变子类型名称
   */
  function getSubName(sub: string) {
    const changeSub = changeSubTypes.value.find((item: any) => item.type === sub);
    return changeSub && changeSub.type ? t(`option.${changeSub.type}`) : t(`option.allDetails`);
  }

  /**
   * @description 选择账变子类型
   */
  function selectedSub(item: string) {
    changeTwoType.value = item;
    setTimeout(() => {
      subPopoverVisible.value = false;
    }, 300);
  }

  /**
   * @description 弹出层关闭事件
   */
  function dismissHandle() {
    typePopoverVisible.value = false;
    subPopoverVisible.value = false;
    timePopoverVisible.value = false;
  }

  /**
   * @description 触底加载更多事件
   */
  async function ionInfinite() {
    if (loadMore.value == 'noMore') return;
    assetsChangeParams.page! ++;
    await getAssetsChange();
  }

  return {
    infiniteRef,
    loadMore,
    changeType,
    changeTwoType,
    subPopoverVisible,
    typePopoverVisible,
    assetsChangeInfo,
    scrollSelectionRef,
    assetsChangeList,
    assetsChangeParams,
    changeMainTypes,
    changeSubTypes,
    isToken,
    showEmpty,
    changeTime,
    currentTimeList,
    timePopoverVisible,
    timeSelectHandle,
    selectedTime,
    typeSelectHandle,
    getTypeName,
    selectedType,
    subSelectHandle,
    getSubName,
    selectedSub,
    dismissHandle,
    ionInfinite,
  }

  /**
   * 接口调用: 获取用户报表(账变记录)
   */
  async function getAssetsChange() {
    if (!isToken.value) return
    assetsChangeParams.changeType = changeType.value == 'all' ? undefined : changeType.value as AssetsChangeParams['changeType'];
    assetsChangeParams.changeTwoType = changeTwoType.value == 'allDetails' ? undefined : changeTwoType.value as AssetsChangeParams['changeTwoType'];
    try {
      const res: any = await assetsChangeApi(assetsChangeParams);
      const { totalRechargeAmountChange, totalWithdrawAmountChange, totalRewardAmountChange } = res
      Object.assign(assetsChangeInfo, {
        ...res,
        totalRechargeAmountChange: moneyConvertToClient(totalRechargeAmountChange || 0),
        totalWithdrawAmountChange: moneyConvertToClient(totalWithdrawAmountChange ? Math.abs(totalWithdrawAmountChange) : 0),
        totalRewardAmountChange: moneyConvertToClient(totalRewardAmountChange || 0)
      })
      if (assetsChangeParams.page === 1) {
        assetsChangeList.value = res.assetsChangeList;
      } else {
        assetsChangeList.value = assetsChangeList.value.concat(res.assetsChangeList);
      }
      if (res.assetsChangeList.length < assetsChangeParams.pageSize!) {
        loadMore.value = 'noMore';
      } else {
        loadMore.value = 'more';
      }
    } catch (error) {
      loadMore.value = 'noMore';
    } finally {
      if (infiniteRef.value) {
        infiniteRef.value.$el.complete();
      }
    }
  }

  /**
   * @description 滚动选择器滚动到中间
   */
  function scrollSelectedToCenter(event: any) {
    if (scrollSelectionRef.value) {
      const container = scrollSelectionRef.value;
      const target = event.target!;

      const containerCenter = container.offsetWidth / 2; // 容器中心相对于视口的位置
      const targetCenter = target.offsetLeft + target.offsetWidth / 2; // 目标元素中心相对于视口的位置
      const scrollLeft = targetCenter - containerCenter + container.scrollLeft; // 计算目标元素中心需要移动到容器中心的距离
      const maxScrollLeft = container.scrollWidth - container.offsetWidth; // 考虑容器最大滚动范围，防止滚动超出
      const clampedScrollLeft = Math.min(Math.max(scrollLeft, 0), maxScrollLeft); // 确保滚动位置在有效范围内

      container.scroll({
        left: clampedScrollLeft,
        behavior: 'smooth'
      });
    }
  }
}
