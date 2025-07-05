import { useElementStore } from '@/store/element';


const componentHeight = ref(0);

export default () => {
  const elementStore = useElementStore();

  const mainEl = ref<HTMLElement | null>(document.querySelector('.main-content'));
  

  const initHeight = () => {
    useResizeObserver(mainEl, (entries) => {
      const entry = entries[0];
      const { height } = entry.contentRect;
      if (height) {
        componentHeight.value = height - elementStore.tabBarHeight;
      }
    })
  }

  return {
    initHeight,
    componentHeight,
  }
}