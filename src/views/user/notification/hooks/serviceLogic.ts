import { useRoute } from 'vue-router';
import { ref, computed, watch } from 'vue';
import { showLoading } from '@/utils/loading';
import { useTenantStore } from '@/store/tenant';
import type { CustomerServiceModel, CustomerServiceItem } from '@/api/normal/model';
import { detectPlatform, getRandomValue } from '@/utils/custom'
import { DeviceType } from '@/enums/common';
import { openUrl } from '@/utils/app';

export function useService() { 
  const tenantStore = useTenantStore(); // 租户状态管理
  const route = useRoute();             // 路由实例

  const segmentValue = ref(0);                                      // 标签栏选中序号
  const serviceConfig = ref<CustomerServiceModel | null>(null);     // 客服配置

  const segmentList = computed(() => {                              // 标签栏列表
    return serviceConfig.value?.types.filter(v =>{
      return serviceConfig.value?.services.some(item => item.typeId === v.id)
    }) ?? []
  });
  const onlineService = computed(() => serviceConfig.value?.onlineServices ?? []); // 在线客服
  const imServiceList = computed(() => {                              // IM客服
    return serviceConfig.value?.services?.sort((a, b)=> b.sort - a.sort) ?? [];
  });
  const showIMServiceList = computed(() => {                          // 是否显示IM客服列表
    return serviceConfig.value?.services?.length && segmentList.value.length;
  }); 

  // 联系在线客服
  function onlineServiceHandle() {
    if (onlineService.value.length) {
      const index = getRandomValue(0, onlineService.value.length - 1)
      const link = onlineService.value[index].link;
      openUrl(link,'')
    }
  }

  // 联系IM客服
  function imServiceHandle(config: CustomerServiceItem) {
    const device = detectPlatform()
    let link = '';
    switch (device) {
      case DeviceType.IOS:
        link = config.iosUrl;
        break;
      case DeviceType.Android:
        link = config.androidUrl;
        break;
      case DeviceType.PC:
        link = config.pcUrl;
        break;
    }
    openUrl(link,'')
  }

  // 根据类型获取客服图标
  function getIcon(item: CustomerServiceItem) {
    if (!item.logo) {
      item.logo = segmentList.value.find(v => v.id === item.typeId)?.logo ?? '';
    }
    return item.logo
  }

  // 更新页面数据
  watch(() => route.fullPath, async () => {
    if (route.path === '/main/notification' || route.path === '/notification') {
      showLoading();
      serviceConfig.value = await tenantStore.getCustomerService();
      segmentValue.value = segmentList.value[0]?.id ?? 0;
    }
  }, { immediate: true })

  return {
    segmentValue,
    serviceConfig,
    segmentList,
    onlineService,
    imServiceList,
    showIMServiceList,
    onlineServiceHandle,
    imServiceHandle,
    getIcon
  }
}
