import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';


export default () => {
  const router = useRouter();
  const userStore = useUserStore();     // 用户状态管理

  const messageQuantity = computed(() => {
    const { unreadMailCount = 0, getUnreadAnnouncementCount = 0 } = userStore;
    const count = unreadMailCount + getUnreadAnnouncementCount;
    return count > 99 ? 99 : count;
  }); // 未读消息数量

  const navigateToMessage = () => {
    router.push({ path: '/notification' })
  }

  return {
    messageQuantity,
    navigateToMessage,
  }
}