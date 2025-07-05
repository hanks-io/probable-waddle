import { ref, computed, onBeforeMount, watch } from 'vue';
import { useRoute,useRouter} from 'vue-router';
import { useAppStore } from '@/store/app';
import { useTenantStore } from '@/store/tenant';
import { PageParam, setPageParam, getPageParam } from '@/store/pageParam';

const segmentList = ['statement', 'betting', 'personal', 'other'];
const segmentValue = ref('');    // 标签栏选中序号

export function useReportLogic() {
  const appStore = useAppStore()        // 系统信息
  const route = useRoute() 	          // 当前路由
  const router = useRouter() 	          // 当前路由信息
  const tenantStore = useTenantStore(); // 租户store
  const isToken = computed(() => appStore.token ? true : false)       // 是否未登录
    
  /**
   * @description: 切换segment
   */
  function segmentChange(event: any) {
    segmentValue.value = event.detail.value
    setPageParam(PageParam.REPORT_TYPE,event.detail.value)
  }

  // 初始化赋值报表tab值
  function updateSementVal () {
    const oldType = getPageParam(PageParam.REPORT_TYPE);
    segmentValue.value = oldType && segmentList.includes(oldType) ? oldType : 'statement'
  }

  // 监听路由
  watch(() => route.path,(newVal) => {
    if (newVal == '/user/report') {
      updateSementVal()
    }
  });
    
  /**
   * 生命周期函数: 页面加载前
   */
  onBeforeMount(async() => {
    if (isToken.value) {
      await tenantStore.getTenantInfo(); // 获取租户信息
    }
    if (router.options.history.state.back == '/main/inicio') {
      segmentValue.value = 'betting';
      setPageParam(PageParam.REPORT_TYPE, segmentValue.value)
    } else {
      updateSementVal()
    }
  });

  return {
    segmentList,
    segmentValue,
    isToken,
    segmentChange,
    updateSementVal
  }
}
