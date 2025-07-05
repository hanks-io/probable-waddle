import { BROWSER } from '@/enums/device'
import { PopupType } from '@/components/Popup/data'
import { copyTextToClipboard } from '@/hooks/useCopyAccountInfo'
import { showToast } from '@/utils'
import SafariGuideModal from '@/pwa/comp/SafariGuideModal.vue'
import { showIosPwaGuideModal } from '@/utils/pwa/showIosGuide'
import { addUrlParam } from '@/utils'
import FacebookTip from '@/download/comp/FacebookTip.vue';
import { modalController } from '@ionic/vue'
import { closeForceModal } from '@/utils/pwa/forcedModal/useClose'
import {  getJumpUrl, openIosUrl } from '@/utils'
export let facebookTipModal: HTMLIonModalElement | null = null;
const showFacebookTipModal = async () => {
  const appStore = useAppStore();
  const channelStore = useChannelStore();
    if(channelStore.isShowForceModal){
      await closeForceModal(false)
    }
    facebookTipModal = await modalController.create({
    component: FacebookTip,
    id: 'facebook-tip',
  });
  facebookTipModal.onDidDismiss().then(() => {
    appStore.modalVisible = false;
    
    
  });
  facebookTipModal.present();
}


const copyUrl = (url: string) => {
  copyTextAppendEL.value = 'public-popup-wrap'
  try {
    copyTextToClipboard(url)
    showToast('toast.copySuccess')
  } catch (error) {
    console.log(error)
    showToast('toast.copyFail')
  }
}
export default async () => {
  const systemStore = useSystemStore() // 系统store
  const { browser } = toRefs(systemStore)
  const { t } = useI18n()
  const browserActionMap = new Map([
    [BROWSER.MOBILE_SAFARI, async () => {
      if(await openIosUrl()) return
      showIosPwaGuideModal()
    }],
    ['Facebook', showFacebookTipModal],
    ['default', async () => {
      const url = await addUrlParam((await getJumpUrl('ios'))|| location.origin)
      showPopup({
        type: PopupType.TIPS,
        msg: '',
        showRightBtn: true,
        leftBtnCallback: () => copyUrl(url),
        reverseBtn: true,
        leftBtnText: t('ForceBindings.000009'),
        contentComp: defineComponent({
          components: { SafariGuideModal },
          render() {
            return h(SafariGuideModal, { url: this.url })
          },
          props: {
            url: {
              default: url
            }
          }
        }),
      })
    }]
  ])

  // Execute browser specific action
  const key = browserActionMap.has(browser.value) ? browser.value : 'default'
  browserActionMap.get(key)?.()
}
