import { useRouter } from 'vue-router';
import { menuController } from "@ionic/vue";
import { useUserStore } from '@/store/user';
import useNavigator from '@/views/tabbar/components/tabBar/useNavigator';

export default () => {
  const router = useRouter();
  const userStore = useUserStore();
  const { navigator } = useNavigator();

  const unReadCount = computed(() =>  {
    const { unreadMailCount = 0, getUnreadAnnouncementCount = 0 } = userStore;
    const count = unreadMailCount + getUnreadAnnouncementCount;
    return count > 0 ? count : 0;
  })

   // 跳转到客服
   function goToCustomer() {
    menuController.close('main-menu')
    navigator('/notification')
  }

  return {
    unReadCount,
    goToCustomer
  }
}