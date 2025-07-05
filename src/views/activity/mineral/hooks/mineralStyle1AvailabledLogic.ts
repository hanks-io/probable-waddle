import { computed, ref } from 'vue';
import { useTenantStore } from '@/store/tenant'

interface Params {
  emit: any;
}

export function useMineralStyle1AvailabledLogic({ emit }: Params) {
  const tenantStore = useTenantStore();

  const  visible = ref<boolean>(true);

  const merchantCy = computed(() => tenantStore.tenantInfo?.merchantCy) // 当前商户货币

  // 确定按钮
  function confirmarClick() {
    emit('closeAvailableModal')
  }

  return {
    visible,
    merchantCy,
    confirmarClick
  }
}
