import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user';
import { showLoading } from '@/utils/loading';
import { useAgentStore } from '@/store/agent';
import { useTenantStore } from '@/store/tenant';
import { computed, provide, ref } from 'vue';
import { PageParam, setPageParam, getPageParam } from '@/store/pageParam';

export function useSpreadLogic () {
  const appStore = useAppStore() 	    // 用户信息
  const userStore = useUserStore();     // 用户store
  const agentStore = useAgentStore();   // 代理store
  const tenantStore = useTenantStore(); // 商户store

  const segmentList = ref<string[]>([]);                // 侧边导航标签列表
  const sideValue = ref('');  // 侧边导航标签动态值
  const timer = ref<any>(null) // 定时器
  const loaded = ref(false) // 加载

  const agencyInfo = computed(() => agentStore.agencyInfo);        // 代理信息
  const isHasCommission = computed(() => Number(userStore.assets?.commission) > 0);  // 是否有可领佣金
  const isToken = computed(() => appStore.token ? true : false)    // 是否未登录

  provide('setSideValue', setSideValue);

  initVuePageInfo() // created初始化页面数据

  const handleClick = (item: string) =>{
    let e = {detail: {value: item}}
    sideChange(e)
  }

  function setSideValue(value: string) {
    sideValue.value = value;
    setPageParam(PageParam.AGENT_ROUTER_TYPE, value)
  }

  /**
   * @description 侧边栏标签切换事件
   * @param event 事件对象
   */
  function sideChange(event: any) {
    sideValue.value = event.detail.value
    setPageParam(PageParam.AGENT_ROUTER_TYPE, event.detail.value)
  }

  /**
   * @description 生命周期: 页面挂载前
   */
  async function initVuePageInfo() {
    // 账号未登录 可访问推广页面 处理
    loaded.value = true
    showLoading()
    await onGetConfig();                  // 获取代理配置
    if (!isToken.value) return            // 未登录不获取用户信息，代理信息
    await userStore.getUser();            // 获取用户信息
    await agentStore.getAgencyInfo();     // 获取代理信息
    await tenantStore.resetTenantInfo();  // 重置商户信息
  }

  /**
   * @description 调用接口: 获取代理配置
   */
  async function onGetConfig() {
    const config = await agentStore.setConfig();
    let list: any[] = [];
    config?.tabSort?.forEach(itemStr => {
      const item = JSON.parse(itemStr);
      if (item.isOpen) list.push(item);
    });
    list.sort((a: any, b: any) => {
      return b.sort - a.sort;
    });
    if (!isToken.value) {                                          // 未登录不显示直属开户
      list = list.filter(item => !['DirectAccount', 'DirectData'].includes(item.title))
    }
    segmentList.value = list.map(item => item.title);
    // 顶部tab栏获取值后 赋值sideValue
    clearTimeout(timer.value)
    timer.value = setTimeout(() => {
      setSegmentType()
    }, 100)
  }

  // 先取存储值 后判断默认值在数组中是否存在 存在取默认值 不存在取数组第0个
  function setSegmentType() {
    const oldType = getPageParam(PageParam.AGENT_ROUTER_TYPE);      // 取存储数据
    const isTrue = oldType && segmentList.value.includes(oldType)   // 判断存储数据是否在显示列表中
    const siDefaultTrue = segmentList.value.includes('MyAgency')    // 判断默认数据是否在显示列表中
    sideValue.value = isTrue ? oldType.toString() : siDefaultTrue ? 'MyAgency' : segmentList.value[0]
    setPageParam(PageParam.AGENT_ROUTER_TYPE, sideValue.value)
    loaded.value = false
  }

  return {
    segmentList,
    sideValue,
    loaded,
    agencyInfo,
    isHasCommission,
    isToken,
    handleClick,
    setSideValue,
    sideChange
  }
}
