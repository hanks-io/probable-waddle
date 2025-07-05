import { delay } from '@/utils/delay';
import { useElementStore } from '@/store/element';


export default () => {
  const elementStore = useElementStore();

  const {
    size,
    total,
    headRef,
    pageList,
    swiperIndex,
    showAllChange,
  } = inject('wrapperShowAllData') as any;

  const showAll = ref(false);

  const showAllGame = computed(() => total > size);

  const sizeChange = async () => {
    showAll.value = !showAll.value;
    showAllChange(showAll.value);
    if (!showAll.value && headRef.value) {
      const { offsetTop } = headRef.value.$el;
      const top = offsetTop - elementStore.tabBarHeight;
      // ion-content滚动到指定位置
      await delay(200);
      const mainContent = document.querySelector('.main-content') as any;
      mainContent.scrollEl.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
  }

  return {
    total,
    showAll,
    pageList,
    swiperIndex,
    sizeChange,
    showAllGame,
  }
}