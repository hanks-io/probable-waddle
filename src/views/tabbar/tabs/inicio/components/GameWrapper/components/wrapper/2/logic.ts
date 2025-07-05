import { useRouter } from 'vue-router';


export default (props) => {
  const router = useRouter();

  const swiperHandler = ref();
  const headRef = ref(null);
  const showAll = ref(false);
  const swiperIndex = ref(0);
  const platformId = computed(() => Number(props.platformId));
  // 获取分页后的游戏列表
  const pageList = computed(() => {
    let list = [];
    if (showAll.value) {
      list.push(props.gameList);
    } else {
      for (let i = 0; i < props.gameList.length; i += props.size) {
        list.push(props.gameList.slice(i, i + props.size));
      }
    }
    return list;
  });

  const showAllChange = (value: boolean) => {
    showAll.value = value;
  }

  function categoryHandle() {
    const { gameType, target, id } = props.platform;
    if (gameType === 'SPORTS') {
      router.push('/game/category/sport')
      return;
    }
    if (gameType === 'POPULAR') {
      router.push({ path: '/game/search/POPULAR' })
      return;
    }
    if (target === 'hall') {
      router.push({ path: `/game/category/${gameType}/${id}`, })
      return;
    }
    router.push({ path: `/game/category/${gameType}/${platformId.value}`, })
  };

  /**
   * @description swiper初始化完成
   * @param swiper
   */
  function onSwiper(swiper: any) {
    swiperHandler.value = swiper;
  };

  /**
   * @description swiper滑动到指定的slide
   * @param 方向
   */
  function swiperToSlide(direction: 'prev' | 'next' = 'next') {
    if (direction === 'prev')
      swiperHandler.value.slidePrev();
    else
      swiperHandler.value.slideNext();
  }

  provide('headerProps', { categoryHandle });
  provide('wrapperShowAllData', {
    headRef,
    pageList,
    swiperIndex,
    showAllChange,
    size: props.size,
    total: props.platform.total,
  });

  return {
    
  }
}