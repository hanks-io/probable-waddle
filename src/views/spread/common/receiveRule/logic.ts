// 佣金领取弹窗逻辑
import { modalController } from '@ionic/vue';

export default function useLogic() {
  const agentStore = useAgentStore();// 代理store

  const config = computed(() => agentStore.config);// 代理配置信息

  const closeModal = () => {
    modalController.dismiss({
      dismissed: true,
    });
  };

  return {
    closeModal,
    config,
  }
}
