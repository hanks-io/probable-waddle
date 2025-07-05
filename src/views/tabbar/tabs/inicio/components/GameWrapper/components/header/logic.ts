
export default (props: any) => {

  const { logo, title, total, size, previewSize, swiperIndex, swiperToSlide } = inject(props.provideName) as any;

  const isInvalid = (btnPosition: 'left' | 'right') => {
    if (btnPosition === 'left' && swiperIndex.value === 0) {
      return 'invalid'
    }

    if (btnPosition === 'right' && (total.value === 0 || swiperIndex.value === Math.floor(total.value / size.value))) {
      return 'invalid'
    }
  }

  const segmentIsInvalid = (btnPosition: 'left' | 'right') => {
    if (btnPosition === 'left' && swiperIndex.value === 0) {
      return 'invalid'
    }

    if (btnPosition === 'right' && (total.value === 0 || swiperIndex.value === total.value - previewSize.value)) {
      return 'invalid'
    }
  }

  const buttonIsInvalid = computed(() => {
    return previewSize?.value ? segmentIsInvalid : isInvalid;
  });


  provide('headerInject', {
    total,
    title,
    swiperToSlide,
    iconPath: logo,
    pageJumps: props.pageJumps,
    iconType: props.gameTypeOrPlatform,
    isInvalid: buttonIsInvalid,
  });

}