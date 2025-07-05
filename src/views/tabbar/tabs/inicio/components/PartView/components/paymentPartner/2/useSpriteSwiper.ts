



export default (props: { url: string }) => {
  const imageWidthRatio = 260;
  const isInitCompleted = ref(false);
  const swiperRef = ref<any>(null);
  const imageLength = ref(0);

  const getImageStyle = (index: number) => {
    const positionX = (index - 1) * 100;
    return {
      backgroundSize: `${imageLength.value * 100}% 100%`,
      backgroundImage: `url(${props.url})`,
      backgroundPosition: `-${positionX}% 0`
    }
  }

  const onSwiper = (swiper: any) => {
    swiperRef.value = swiper;
  };

  const onSlideChange = (swiper: any) => {

  };

  const setSpriteDiagram = (imgEl: HTMLElement) => {
    const { naturalWidth, naturalHeight } = imgEl;
    imageLength.value = Math.ceil(naturalWidth / imageWidthRatio);
  }


  const getSpriteImage = () => {
    const img = new Image();
    img.src = props.url;
    img.onload = () => {
      setSpriteDiagram(img);
      isInitCompleted.value = true;
    }
  }

  const startTimer = ref<NodeJS.Timeout | null>(null);
  const toggleAutoplay = (lock: boolean) => {
    if (startTimer.value) {
      clearTimeout(startTimer.value);
    }
    if (!swiperRef.value || swiperRef.value.destroyed) return;
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

  onMounted(() => {
    getSpriteImage();
  })

  return {
    onSwiper,
    imageLength,
    getImageStyle,
    onSlideChange,
    isInitCompleted,
  }
}