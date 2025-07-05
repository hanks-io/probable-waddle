import { menuController } from "@ionic/vue";
import { showLogin } from "@/hooks/ShowLogin";
import useNavigator from '@/views/tabbar/components/tabBar/useNavigator';

export default () => {
  const userStore = useUserStore();
  const userId = computed(() => userStore.user?.userId);

  const { navigator } = useNavigator();

  const menuChange = async () => {
    const isOpen = await menuController.isOpen();
    if (isOpen) {
      menuController.close('main-menu');
    }
  }

  const btnClick = (eventKey: string) => {
    menuChange();
    if (eventKey === 'login') {
      showLogin();
      return;
    }
    if (eventKey === 'entrar') {
      navigator('/main/entrar');
      return;
    }
  }

  return {
    userId,
    btnClick,
  }
}