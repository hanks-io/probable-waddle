import { useAppStore } from '@/store/app'
import { modalController } from '@ionic/vue'
import { getTheme } from '@/theme/hooks'
import { checkIsSwModal,emitter } from '@/utils'
import router from '@/router'

/**
 * @description 显示强制安装弹窗  @/views/tabbar/components/Announcement/index.vue
 */
export default async () => {
  const existmap = [ // 强制安装弹窗存在条件
    checkIsSwModal(),
  ];
  if (existmap.every(Boolean)) return;
  const appStore = useAppStore();
  const channelStore = useChannelStore(); // 渠道信息 
  if (appStore.modalVisible) return
  appStore.modalVisible = true;

  const { skin } = getTheme();
  const modalComponentsMap = {
    'default': defineAsyncComponent(() => import('@/pwa/compulsoryModal/default.vue')),
    'second': defineAsyncComponent(() => import('@/pwa/compulsoryModal/second.vue')),
    'announcement': defineAsyncComponent(() => import('@/views/tabbar/components/Announcement/index.vue'))
  };
  const getComponent = () => {
    if (channelStore.forceModalKey === 'announcement') {
      return   modalComponentsMap['announcement']
    }
   
    return skin === 'second' ? modalComponentsMap['second'] : modalComponentsMap['default']
  }
  const component =  getComponent();
  const modal = await modalController.create({
    component,
    id: 'pwa-compulsory-modal',
  });
  modal.onDidDismiss().then(() => {
    const { forceModalCloseType,forceModalKey } = channelStore;
    console.warn('modal.onDidDismiss', forceModalCloseType)
    const modalType = forceModalCloseType === 1 ? 'othersTypes' : forceModalKey;
    emitter.emit('forcedModal/dismiss', { type: modalType });
    useAppStore().modalVisible = false; // 关闭弹窗后，将弹窗状态设置为false
    channelStore.isShowForceModal = false
    channelStore.forceModalKey = null
  });
   modal.present();
}
