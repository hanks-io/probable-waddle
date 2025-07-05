<template>
  <swiper
    ref="swiperRef"
    :slides-per-view="slidesPerView"
    :space-between="spaceBetween"
    :slides-offset-before="slidesOffsetBefore"
    :slides-offset-after="slidesOffsetAfter"
    @swiper="onSwiper"
    @slideChange="onSlideChange"
  >
    <swiper-slide v-for="item in tabsList" :key="item.code" class="nav-item" @click="tabClick(item)">
      <component v-for="cItem in componentList" :key="cItem.key" :is="cItem.component" v-bind="cItem.options" :tab="item"/>
    </swiper-slide>
  </swiper>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import useSegmentLogic from '@/views/tabbar/tabs/inicio/components/Segment/components/segmentLayout/category/rowLayout/logic'

const emits = defineEmits(['tabChange']);

const props = defineProps({
  spaceBetween: {
    type: Number,
    default: 0,
  },
  slidesPerView: {
    type: Number,
    default: 3,
  },
  slidesOffsetBefore: {
    type: Number,
    default: 0,
  },
  slidesOffsetAfter: {
    type: Number,
    default: 0,
  },
  componentList: {
    type: Array,
    default: () => [],
  },
  labelKey: {
    type: String,
    default: 'name'
  },
  eventKey: {
    type: String,
    default: '',
  },
  noHot: {
    type: Boolean,
    default: false,
  }
});

  const {
    tabs,
    tabClick,
  } = useSegmentLogic(props, emits)

  const swiperRef = ref();

  const { swiperChange, totalChange, previewSizeChange } = inject('swiperNavInject') as any;

  const tabsList = computed(() => {
    if (props.noHot) {
      const list = tabs.value.slice(1);
      totalChange(list.length);
      return list;
    }
    totalChange(tabs.value.length);
    return tabs.value;
  })

  previewSizeChange(props.slidesPerView);

  const onSwiper = (swiper: any) => {
    swiperRef.value = swiper;
    swiperChange(swiper);
  };

  const onSlideChange = (swiper: any) => {
    const { activeIndex, slides } = swiper;
    const lastIndex = slides.length - 1;
    const swiperLastIndex = slides.length - props.slidesPerView;
    slides.forEach((slide: any, index: number) => {
      slide.style.marginLeft = 0;
    });

    if (activeIndex === 0) {
      slides[0].style.marginLeft = '0.75rem';
    }

    if (activeIndex === swiperLastIndex) {
      slides[lastIndex].style.marginRight = '0.75rem';
    }
  };

</script>

<style scoped lang="less">
@import './index.less';
</style>