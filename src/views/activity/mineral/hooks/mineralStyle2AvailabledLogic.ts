import { computed, ref } from 'vue';
import { useTenantStore } from '@/store/tenant'

interface Params {
  emit: any;
}

export function useMineralStyle2AvailabledLogic({ emit }: Params) {
  const tenantStore = useTenantStore();

  const visible = ref<boolean>(true);       // 弹窗开关状态

  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy) // 当前商户货币

  // 退出 click 事件
  function confirmarClick() {
    emit('closeAvailableModal')
  }

  return {
    visible,
    merchantCy,
    confirmarClick
  }
}
