import { jumpActivityId } from '@/utils/url'
import { delay } from '@/utils/delay';
import { redirectUrl } from '@/utils/app';
import { Autoplay, Pagination } from 'swiper/modules';
import { CarouselConfigModel } from '@/api/normal/model';
import { useVipStore } from '@/store/vip';
import { useOpenSwiperLink } from "@/hooks/useLinkHandle";


export default function useSwiperViewLogic(emit: any) {
  const tenantStore = useTenantStore();// 租户store

  const showIonImg = ref(false);       // 解决ion-img刷新出现白色边框
  const carouselList = computed(() => tenantStore.carouselList);        // 轮播图数据
  const isLoopEnabled = computed(() => carouselList.value.length > 2);  // 是否开启循环(开启循环最少3条元素)

  const router = useRouter();               // 路由对象
  const activityStore = useActivityStore(); // 活动store

  const swiperRef = ref();                      // 轮播图DOM
  const modules = ref([Autoplay, Pagination]);  // 轮播图模块

  /**
   * @description 轮播图点击事件
   * @param item 轮播图数据
   */
  function swiperHandle(item: CarouselConfigModel[0]) {
    useOpenSwiperLink(item.linkType, item.linkValue)
  }

  const startTimer = ref<NodeJS.Timeout | null>(null);
  const toggleAutoplay = (lock: boolean) => {
    if (startTimer.value) {
      clearTimeout(startTimer.value);
    }
    if (!swiperRef.value) return;
    if (lock) {
      if (swiperRef.value.autoplay.running) {
        swiperRef.value.autoplay.stop();
      }
      startTimer.value = setTimeout(() => {
        swiperRef.value.loopDestroy();
        swiperRef.value.loopCreate();
        swiperRef.value.update();
        swiperRef.value.autoplay.start();
      }, 1000);
    } else {
      swiperRef.value.autoplay.stop();
    }
  }

  const watchRoute = inject('watchRoute') as any;

  watchRoute.use((path: string, oldPath: string, next: (path: string, oldPath: string) => {}) => {
    next(path, oldPath);
    if (path === '/main/inicio') {
      toggleAutoplay(true);
    } else {
      toggleAutoplay(false);
    }
  });

   // 生命周期: 组件挂载前
   onBeforeMount(async () => {
    await tenantStore.loadCarouselList(); // 获取轮播图数据
    showIonImg.value = true
  })

  // 生命周期: 组件挂载完成
  onMounted(async () => {
    await nextTick();
    emit('loaded')                              // 触发父组件加载完成事件
  })

  /**
   * @description swiper初始化完成
   * @param swiper
   */
  async function onSwiper(swiper: any) {
    swiperRef.value = swiper;
    await delay(3000);
    swiper.slideTo(1); // 滑动到第一个slide
  };

  return {
    carouselList,
    isLoopEnabled,
    modules,
    showIonImg,
    swiperHandle,
    onSwiper
  }
}
