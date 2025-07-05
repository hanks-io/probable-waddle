import { LocationQueryRaw } from 'vue-router';
import { useAgentStore } from '@/store/agent';
import { useStatusStore } from '@/store/status';
import router from './index';

export const switchTab = (path: string = '/main/inicio', query?: LocationQueryRaw) => {
  const statusStore = useStatusStore();

  router.replace({ path, query }).then(() => {
    statusStore.setViewReload(false);
  });
}

export const getSpreadComponent = (skin: string) => {
  const agentStore = useAgentStore();
  const isOldPage = agentStore.agentConfig?.agencyMode == 'unlimitedLevel';
  switch (skin) {
    case 'default':
      return isOldPage ? () => import('@/views/spread/default/index.vue') : () => import('@/views/mlmAgent/index.vue');
    case 'first':
      return isOldPage ? () => import('@/views/spread/first/index.vue') : () => import('@/views/mlmAgent/index.vue');
    case 'second':
      return isOldPage ? () => import('@/views/spread/second/index.vue') : () => import('@/views/mlmAgent/index.vue');
    default:
      return isOldPage ? () => import('@/views/spread/default/index.vue') : () => import('@/views/mlmAgent/index.vue');
  }
}
