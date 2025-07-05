import dayjs from 'dayjs';
import { useAppStore } from '@/store/app';
import { GameTypes } from '@/enums/types';
import { useUserStore } from '@/store/user';
import { useAgentStore } from '@/store/agent';
import { getCurrentLocalTime } from '@/utils/date';
import { computed, onBeforeMount, reactive, ref } from 'vue';
import { agencyCommissionApi, agencyCommissionDetailApi } from '@/api/agent';
import { AgencyCommissionDetailModel, AgencyCommissionDetailParams, AgencyCommissionModel, AgencyCommissionParams } from '@/api/agent/model';

export function useCommissionLogic() {
  const appStore = useAppStore()      // 系统信息
  const userStore = useUserStore()    // 用户信息
  const agentStore = useAgentStore()  // 代理信息
  
  const date = getCurrentLocalTime() as dayjs.Dayjs // 当前日期对象

  const dateIndex = ref(0);                                                                   // 日期选择器索引(1.开始日期 2.结束日期)
  const currentDate = ref(date.format());                                                     // 当前日期字符串
  const minDate = ref('');                                                                    // 最小可选日期
  const maxDate = ref(date.format());                                                         // 最大可选日期
  const showPopover = ref(false);                                                             // 是否显示日期选择器
  const isDateChange = ref(false);                                                            // 是否变更日期事件
  const detailModalState = ref(false);                                                        // 佣金明细弹窗状态
  const list = ref<NonNullable<AgencyCommissionModel['info']>['returnData']>([]);             // 代理佣金列表
  const loading = ref(false);                                                                 // 列表加载状态
  const detailLoading = ref(false);                                                           // 佣金明细加载状态
  const detailList = ref<NonNullable<AgencyCommissionDetailModel['info']>['returnData']>([])  // 佣金明细列表
  const detailGameType = ref('')                                                              // 佣金明细游戏类型
  
  const commissionParams = reactive<AgencyCommissionParams|any>({             // 获取玩家代理佣金请求接口参数
  	userId: 0,
  	startTime: date.format('YYYY-MM-DD'),
  	endTime: date.format('YYYY-MM-DD'),
    gameType: 'ALL'
  })
  const commissionDetaiParams = reactive<AgencyCommissionDetailParams|any>({  // 获取玩家代理佣金明细请求接口参数
  	userId: 0,
  	type: 'direct',
  	time: '',
    gameType: ''
  })

  const agancyInfo = computed(() => agentStore.agencyInfo);           // 代理信息
  const homeGameList = computed(() => ['ALL', ...GameTypes]);         // 首页游戏列表
  const locale = computed(() => appStore.locale.replace('_', '-'));   // 语言
  const isToken = computed(() => appStore.token ? true : false);       // 是否未登录

  /**
   * 生命周期: 组件挂载前
   */
  onBeforeMount(async () => {
  	minDate.value = dayjs().subtract(1, 'year').format(); // 设置最小可选日期
    if (!isToken.value) return                                   // 未登录不获取信息
  	const user = await userStore.getUser()                // 获取用户信息
  	commissionParams.userId = user?.userId || 0           // 设置玩家代理佣金请求接口参数: 玩家ID
    commissionParams.gameType = 'ALL',                    // 设置游戏类型默认选择全部
  	getCommission()                                       // 获取玩家代理佣金
    
  })

  /**
   * @description: 日期选择器关闭
   */
  function popoverDismiss() {
	showPopover.value = false
	if (dateIndex.value == 1 && isDateChange.value) { // 判断是变更日期还是关闭日期选择器
		dateIndex.value = 2
		setTimeout(() => {
			showPopover.value = true
		}, 100)
	}
	else {
		dateIndex.value = 0
	}
	isDateChange.value = false
  }

  /**
   * @description: 日期选择器打开
   */
  function popoverPresent() {
  	if (dateIndex.value == 0)
  	  dateIndex.value = 1
  }

  /**
   * @description: 日期选择器选择日期
   */
  function dateChange(e: any) {
  	const chosenDate = dayjs(e.detail.value)
  	isDateChange.value = true
  	if (dateIndex.value == 1) {
  		commissionParams.startTime = commissionParams.endTime = chosenDate.format('YYYY-MM-DD')
  		minDate.value = chosenDate.format()
  	}
  	else if (dateIndex.value == 2) {
  		commissionParams.endTime = chosenDate.format('YYYY-MM-DD')
  		minDate.value = dayjs().subtract(1, 'year').format()
  		getCommission()
  	}
  }

  /**
   * @description: 游戏类型选择事件
   */
  function typeChangeHandle(e: any) {
  	commissionParams.gameType = e.detail.value
  	getCommission()
  }

  /**
   * @description: 佣金明细
   */
  function detailHandle(item: any) {
    detailGameType.value = item.gameType
    commissionDetaiParams.time = dayjs(item.time).add(1, 'day').format('YYYY-MM-DD')
    commissionDetaiParams.userId = item.userId
    commissionDetaiParams.gameType = item.gameType
  	detailTypeChange();
  	detailModalState.value = true
  }
  
  /**
   * @description: 佣金明细弹窗关闭
   */
  function detailModalClose() {
  	detailModalState.value = false
  }

  /**
   * @description: 佣金明细弹窗类型切换
   */
  function detailTypeChange(e?: any) {
    detailList.value = [];                                      // 重置佣金明细列表
      commissionDetaiParams.type = e?.detail?.value || 'direct';  // 设置玩家代理佣金明细请求接口参数: 类型
    getCommissionDetail();                                      // 获取玩家代理佣金明细  
  }

  return {
    dateIndex,
    currentDate,
    minDate,
    maxDate,
    showPopover,
    isDateChange,
    detailModalState,
    list,
    loading,
    detailLoading,
    detailList,
    detailGameType,
    commissionParams,
    commissionDetaiParams,
    agancyInfo,
    homeGameList,
    locale,
    isToken,
    popoverDismiss,
    popoverPresent,
    dateChange,
    typeChangeHandle,
    detailHandle,
    detailModalClose,
    detailTypeChange
  }
  
  /**
   * 接口调用: 获取玩家佣金  默认全部时，请求不能带有gameType属性
   */
  async function getCommission() {
    if (!isToken.value) return                                  // 未登录不获取信息
    const params = { ...commissionParams }
    if (commissionParams.gameType == 'ALL') {
      delete params.gameType
    }
    loading.value = true;
    list.value = [];
    const res = await agencyCommissionApi(params);
    loading.value = false;
    if (res && 'info' in res) {
      list.value = res.info?.returnData!;
    }
  }
  
  /**
   * 接口调用: 获取玩家佣金明细
   */
  async function getCommissionDetail() {
    detailLoading.value = true;
    const res = await agencyCommissionDetailApi(commissionDetaiParams);
    detailLoading.value = false;
    if (res && res.info && res.info.returnData) {
      detailList.value = res.info.returnData
    }
  }
}
