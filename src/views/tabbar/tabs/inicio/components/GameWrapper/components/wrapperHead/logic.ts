import { computed } from 'vue';

export default (props: any) => {
  // 下一页是否显示
  const isNext = computed(() => {
    if (props.size === 0) {
      return 'none'
    }
    if (props.swiperIndex == Math.floor(props.total / props.size)) {
      return 'none'
    }
  });

  const isInvalid = (btnPosition: 'left' | 'right') => {
    if (btnPosition === 'left' && props.swiperIndex === 0) {
      return 'invalid'
    }

    if (btnPosition === 'right' && (props.size === 0 || props.swiperIndex === Math.floor(props.total / props.size))) {
      return 'invalid'
    }
  }

  const sortLogoSrc = computed(() => {
    const { logo, type } = props;
    const initLogo = `/first/svg/sort/${type}.svg`;
    return logo || initLogo;
  });

  const platformLogoSrc = computed(() => {
    return props.logo || props.platformInfo.logo;
  });

  return {
    isNext,
    isInvalid,
    sortLogoSrc,
    platformLogoSrc,
  }
}