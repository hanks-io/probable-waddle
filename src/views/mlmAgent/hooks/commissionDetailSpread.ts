import dayjs from 'dayjs';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import { showLoading } from '@/utils/loading';
import { hideLoading } from '@/utils/loading';
import { useTenantStore } from '@/store/tenant';
import { useAgentStore } from '@/store/agent';
import { handleCurrentSkinGender } from '../data'
import { getCurrentLocalTime } from '@/utils/date';
import { agencyCommDetailApi } from '@/api/agent/index'
import { moneyConvertToClient } from "@/utils/custom";
import { computed, ref } from 'vue';

export function useCommissionDetailSpread() {
  const appStore = useAppStore();       // 系统信息
  const userStore = useUserStore();     // 用户信息
  const tenantStore = useTenantStore(); // 商户store
  const agentStore = useAgentStore();   // 代理store

  const date = getCurrentLocalTime() as dayjs.Dayjs                       // 当前日期对象
  const timeStart = ref(date.format('YYYY/MM/DD'));                       //起始时间
  const dateValueTime = ref(date.format('YYYY-MM-DD'));                   // 日期时间
  const minDate = ref('');                                                // 最小可选日期
  const maxDate = ref(date.format());                                     // 最大可选日期
  const showPopover = ref(false);                                         // 是否显示日期选择器
  const searchValue = ref('');                                            // 搜索框输入值
  const myTotalCommission = ref(0);                                       // 佣金金额
  const commissionDetailList = ref([]);                                   // 佣金详情列表

  const tenantInfo = computed(() => tenantStore.tenantInfo);               // 商户信息
  const locale = computed(() => appStore.locale.replace('_', '-'));        // 语言
  const isToken = computed(() => appStore.token ? true : false);           // 是否未登录
  const showEmpty = computed(() => commissionDetailList.value.length);     // 是否显示暂无数据

  initVuePageInfo(); // created初始化页面数据 

  /**
  * @description 生命周期: 页面挂载前
  */
  async function initVuePageInfo() {
    minDate.value = dayjs().subtract(90, 'day').format(); // 设置最小可选日期(90天)
    await agentStore.getAgentConfig();                    // 获取代理配置
    if (!isToken.value) return;                           // 未登录不获取信息
    await userStore.getUser();                            // 获取用户信息
    getCommisssionDetail();
  }

  // 输入框 input时间
  function searchInput() {
    const regex = /^[1-9]\d*$/;      // 正则表达式: 只能输入数字且不能以0开头
    if (!regex.test(searchValue.value)) {
      searchValue.value = '';
    }
  }

  /**
   * @description 弹窗关闭 触发回调
   */
  const popoverDismiss = () => {
    showPopover.value = false;
  }

  /**
   * @description 日期选择器选择日期之后 确认，之后触发函数
   */
  const dateChange = (e: any) => {
    timeStart.value = dayjs(e.detail.value).format('YYYY/MM/DD');
    dateValueTime.value = dayjs(e.detail.value).format('YYYY-MM-DD');
    getCommisssionDetail();
  }

  /**
   * @description: 搜索框确认输入事件
   */
  function searchHandle() {
    getCommisssionDetail();
  }

  // 获取佣金详情信息
  async function getCommisssionDetail() {
    if (!isToken.value) return;                // 不登录不调接口
    showLoading();
    const params = { time: dateValueTime.value };
    searchValue.value ? params.subId = Number(searchValue.value) : delete params.subId;
    try {
      const res = await agencyCommDetailApi(params);
      if (res && res.info) {
        myTotalCommission.value = moneyConvertToClient(res.info?.myTotalCommission || 0);
        const subList = res.info.subList;
        if (subList.length) {
          const baseAvatar = agentStore.agentConfig?.ossUrl;
          subList.forEach((item:any) => {
            item.commission = moneyConvertToClient(item.commission);
            item.rechargeAmount = moneyConvertToClient(item.rechargeAmount);
            const currentGender = handleCurrentSkinGender(item.avatar)
            item.avatar = `${baseAvatar}/avatar/${currentGender}`;
          })
        }
        commissionDetailList.value = subList;
      }
    } catch (error) {
    }  finally {
      hideLoading();
    }
  }

  return {
    minDate,
    maxDate,
    timeStart,
    showPopover,
    searchValue,
    dateValueTime,
    commissionDetailList,
    myTotalCommission,
    locale,
    tenantInfo,
    showEmpty,
    popoverDismiss,
    dateChange,
    searchHandle,
    searchInput
  }

}
