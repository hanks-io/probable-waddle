import { emitter } from '../event';
import { showToast } from ".";
import { useUserStore } from '@/store/user'

export function registerToastEvents() {
  emitter.on('user/withdraw-success', () => {
    showToast('status.success');
  });

  emitter.on('user/pay-success', () => {
    if (useUserStore().isRechargeing) return;
    showToast('status.SUCCESS');
  })
}
