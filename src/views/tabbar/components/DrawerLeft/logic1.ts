import { defineAsyncComponent, type ComponentPublicInstance, markRaw, computed, toRef, ref, onMounted } from 'vue'
import { useStatusStore } from '@/store/status'


export default () => {
  const statusStore = useStatusStore();

  const hidePwaBar = ref(true);
  const btnDisabled = ref(false)

  /**
  * @description 菜单关闭事件
  */
  const menuIonDidClose = () => {
    hidePwaBar.value = true;
    btnDisabled.value = true
    statusStore.setDrawerLeftIsOpen(false)
  }

  const menuIonClose = () => {
    btnDisabled.value = false
  }

  const menuIonOpen = () => {
    hidePwaBar.value = false;
    btnDisabled.value = false
  }

  /**
  * @description 菜单开启事件
  */
  const menuIonDidOpen = () => {
    statusStore.setDrawerLeftIsOpen(true)
  }

  const contentBottom = ref('');
  const footerRef = ref<HTMLElement | null>(null);

  onMounted(() => {
    if (footerRef.value) {
      useResizeObserver(footerRef, (entries) => {
        const entry = entries[0];
        const { height } = entry.contentRect;
        if (height) {
          contentBottom.value = `calc(${height}px + 2rem)`;
        }
      })
    }
  })

  return {
    footerRef,
    hidePwaBar,
    btnDisabled,
    contentBottom,
    menuIonOpen,
    menuIonClose,
    menuIonDidOpen,
    menuIonDidClose,
  }
}


