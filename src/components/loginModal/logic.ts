// 登录/注册 逻辑层
import { useAppStore } from '@/store/app';
import { modalController } from '@ionic/vue';
import { useTenantStore } from '@/store/tenant';
import { computed } from 'vue';

export default function useLogic() {
  const appStore = useAppStore();       // 用户store
  const tenantStore = useTenantStore(); // 商户store

  const operation = computed(() => appStore.operation); // 当前弹窗操作
  const logoUrl = computed(() => tenantStore.tenantInfo?.logo ?? ''); // 商户logo

  /**
   * @description 关闭模态框
   */
  function closeModal() {
    appStore.modalVisible = false;
    modalController.dismiss();
  }

  /**
   * @description 立即登录点击事件
   */
  function toggleHandle(param: string) {
    appStore.operation = param;
  }

  return {
    operation,
    logoUrl,
    closeModal,
    toggleHandle,
  }
}
