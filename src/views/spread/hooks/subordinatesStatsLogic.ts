import dayjs from 'dayjs';
import { useAppStore } from '@/store/app';
import { useUserStore } from '@/store/user';
import { getCurrentLocalTime } from '@/utils/date';
import { computed, onBeforeMount, ref } from 'vue';

export function useSubordinatesStatsLogic() {
  const appStore = useAppStore();   // 系统信息
  const userStore = useUserStore(); // 用户信息
  const date = getCurrentLocalTime() as dayjs.Dayjs; // 当前日期对象

  const minDate = ref('');                                            // 最小可选日期
  const maxDate = ref(date.format());                                 // 最大可选日期
  const showPopover = ref(false);                                     // 是否显示日期选择器
  const loading = ref(false);                                         // 搜索框加载动画
  const searchValue = ref('');                                        // 搜索框输入值
  const detailModalState = ref(false);                                // 详情弹窗状态
  
  const userId = computed(() => userStore.user?.userId);                        // 用户ID
  const locale = computed(() => { return appStore.locale.replace('_', '-') });  // 语言

  /**
   * 生命周期: 组件挂载前
   */
  onBeforeMount(async () => {
    minDate.value = dayjs().subtract(3, 'month').format();  // 设置最小可选日期
    const user = await userStore.getUser();                 // 获取用户信息
  });

  /**
   * @description: 日期选择器关闭
   */
  function popoverDismiss() {
    showPopover.value = false;
  }
  
  /**
   * @description: 详情按钮点击事件
   */
  async function detailHandle(id: number) {
    detailModalState.value = true;
  }
  
  /**
   * @description: 详情弹窗关闭事件
   */
  function detailModalDismiss() {
    detailModalState.value = false;
  }
  
  return {
    minDate,
    maxDate,
    showPopover,
    loading,
    searchValue,
    detailModalState,
    userId,
    locale,
    popoverDismiss,
    detailHandle,
    detailModalDismiss
  }
}
