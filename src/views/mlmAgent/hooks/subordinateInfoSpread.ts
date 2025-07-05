import { t } from '@/i18n';
import dayjs from 'dayjs';

import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import { showLoading } from '@/utils/loading';
import { hideLoading } from '@/utils/loading';
import { useAgentStore } from '@/store/agent';
import { getCurrentLocalTime } from '@/utils/date';
import { handleCurrentSkinGender } from '../data'
import { agencyMlmSubDataApi } from '@/api/agent/index'
import { moneyConvertToClient } from "@/utils/custom";
import { computed, onBeforeMount, reactive, ref } from 'vue';

export function useCommissionDetailSpread() {
  const appStore = useAppStore();   // 系统信息
  const userStore = useUserStore(); // 用户信息
  const agentStore = useAgentStore();   // 代理store

  const date = getCurrentLocalTime() as dayjs.Dayjs                       // 当前日期对象
  const timeStart = ref(date.format('YYYY/MM/DD'))                        //起始时间
  const level = ref(0)                                                    // 等级选择
  const dateValueTime = ref(date.format('YYYY-MM-DD'))                    // 日期筛选
  const minDate = ref('');                                                // 最小可选日期
  const maxDate = ref(date.format());                                     // 最大可选日期
  const searchValue = ref('');                                            // 搜索框输入值
  const levelPopoverVisible = ref(false);                                 // 日期选择弹出层显示状态
  const showPopover = ref(false);                                         // 是否显示日期选择器
  const infiniteRef = ref<any>(null);	                                    // 上拉加载更多组件DOM(用于重置状态)
  const loadMore = ref('more');                                           // 加载更多状态
  const subordinateInfo = ref([                                           // 下级总数据信息表
    { name: t('main.entrar') + t('toggle.numberofpeople'), value: 0 },
    { name: t('label.bettings') + t('toggle.numberofpeople'), value: 0 },
    { name: t('mlmAgent.firstCount'), value: 0 },
    { name: t('activity.agent32'), value: 0, icon: '/first/svg/agent/agent-currency.svg' },
    { name: t('activity.vip38'), value: 0 },
    { name: t('mlmAgent.firstRechargeA'), value: 0 }
  ])
  const subordinateList = ref([])                                      // 下级数据信息
  const showEmpty = ref(false);                                        // 显示暂无数据
  const subordinateDetaParams = reactive<any>({                        // 获取下级数据请求参数
    level: 1,
    page: 1,
    pageSize: 10
  })

  const locale = computed(() => appStore.locale.replace('_', '-'));          // 语言
  const isToken = computed(() => appStore.token ? true : false)              // 是否未登录

  /**
  * 生命周期: 组件挂载前
  */
  onBeforeMount(async () => {
    minDate.value = dayjs().subtract(90, 'day').format(); // 设置最小可选日期
    await agentStore.getAgentConfig();                    // 获取代理配置
    if (!isToken.value) return showEmpty.value = true     // 未登录不获取信息
    await userStore.getUser();                            // 获取用户信息
    getAgentSubInfo()                                     // 获取下级数据
  });

  // 选择下级代理等级
  function selectedLevel(index: number) {
    level.value = index;
    levelPopoverVisible.value = false;
    getAgentSubInfo();
  }

  /**
  * @description 日期选择器点击事件
  */
  function dateSelectHandle() {
    levelPopoverVisible.value = !levelPopoverVisible.value;
  }

  /**
  * @description 日期选择器选择日期之后 确认，之后触发函数
  */
  const dateChange = (e: any) => {
    timeStart.value = dayjs(e.detail.value).format('YYYY/MM/DD');
    dateValueTime.value = dayjs(e.detail.value).format('YYYY-MM-DD');
    getAgentSubInfo();
  }

  /**
   * @description: 日期选择器关闭
   */
  function popoverDismiss() {
    showPopover.value = false;
  }

  /**
  * @description: 搜索框确认输入事件
  */
  function searchHandle() {
    getAgentSubInfo();
  }

  // 输入框 input时间
  function searchInput() {
    const regex = /^[1-9]\d*$/;      // 正则表达式: 只能输入数字且不能以0开头
    if (!regex.test(searchValue.value)) {
      searchValue.value = '';
    }
  }

  /**
  * @description 获取下属等级数据
  */
  function getSubordinateLevel(index: number) {
    switch (index) {
      case 0:
        return t('sort.ALL');
      case 1:
        return t('mlmAgent.agentLevelName1');
      case 2:
        return t('mlmAgent.agentLevelName2');
      case 3:
        return t('mlmAgent.agentLevelName3');
      case 4:
        return t('mlmAgent.agentLevelName4');
      case 5:
        return t('mlmAgent.agentLevelName5');
      case 6:
        return t('mlmAgent.agentLevelName6');
    }
  }

  /**
   * @description 触底加载更多事件
   */
  async function ionInfinite() {
    if (loadMore.value == 'noMore') return;
    subordinateDetaParams.page! ++;
    await getAgentSubInfo();
  }

  // 获取下级数据
  async function getAgentSubInfo() {
    if (!isToken.value) return           // 未登录不调接口
    showLoading();
    const params = { ...subordinateDetaParams, time: dateValueTime.value };
    level.value == 0 ? delete params.level : params.level = level.value;
    searchValue.value ? params.subId = Number(searchValue.value) : delete params.subId;
    try {
      const res = await agencyMlmSubDataApi(params);
      if (res && res.info) {
        const sumInfo = res.info.sumInfo;
        const rankRewardList = res.info.rankRewardList;
        if (rankRewardList.length) {
          const baseAvatar = agentStore.agentConfig?.ossUrl;
          rankRewardList.forEach((item: any) => {
            item.rechargeAmount = moneyConvertToClient(item.rechargeAmount || 0)
            item.betAmount = moneyConvertToClient(item.betAmount)
            const currentGender = handleCurrentSkinGender(item.avatar)
            item.avatar = `${baseAvatar}/avatar/${currentGender}`
          })
        }
        if (subordinateDetaParams.page == 1) {
          subordinateList.value = rankRewardList;
        } else {
          subordinateList.value = subordinateList.value.concat(rankRewardList);
        }
        subordinateInfo.value = [
          { name: t('main.entrar') + t('toggle.numberofpeople'), value: sumInfo?.rechargeCount || 0 },
          { name: t('label.bettings') + t('toggle.numberofpeople'), value: sumInfo?.betCount || 0 },
          { name: t('mlmAgent.firstCount'), value: sumInfo?.firstRechargeCount || 0 },
          { name: t('activity.agent32'), value: moneyConvertToClient(sumInfo?.rechargeAmount || 0), icon: '/first/svg/agent/agent-currency.svg' },
          { name: t('activity.vip38'), value: moneyConvertToClient(sumInfo?.betAmount || 0) },
          { name: t('mlmAgent.firstRechargeA'), value: moneyConvertToClient(sumInfo?.firstRechargeAmount || 0) }
        ]
        if (subordinateList.value.length < res.info.count) {
          loadMore.value = 'more';
        } else {
          loadMore.value = 'noMore';
        }
      }
    } catch (error) {
      loadMore.value = 'noMore';
    } finally {
      if (infiniteRef.value) {
        infiniteRef.value.$el.complete();
      }
      showEmpty.value = Boolean(subordinateList.value.length <= 0);
      hideLoading();
    }
  }

  return {
    timeStart,
    level,
    dateValueTime,
    minDate,
    maxDate,
    searchValue,
    levelPopoverVisible,
    showPopover,
    infiniteRef,
    loadMore,
    subordinateInfo,
    subordinateList,
    showEmpty,
    locale,
    popoverDismiss,
    dateChange,
    searchHandle,
    dateSelectHandle,
    getSubordinateLevel,
    selectedLevel,
    ionInfinite,
    searchInput
  }
}
