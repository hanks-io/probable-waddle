import { useAppStore } from '@/store/app';
import { useStatusStore } from '@/store/status';
import { menuController } from '@ionic/vue';



export default () => {
  const appStore = useAppStore();
  const statusStore = useStatusStore();

  const {
    drawerLoad,
  } = toRefs(appStore);

  const {
    drawerLeftIsOpen,
  } = toRefs(statusStore);

  const menuHandle = () => {
    if (!drawerLoad.value) return
    statusStore.setDrawerLeftIsOpen(true)
    menuController.open('main-menu')
  }

  return {
    menuHandle,
    drawerLeftIsOpen
  }
}