<template>
  <div class="swiper-wrap">
    <component v-for="item in filterComponentList" :key="item.key" :is="item.component" v-bind="item.options" :provideName="PROVIDE_NAME1" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getImageUrl } from '@/utils/url'
import useCategoryOrPlatform from '@/views/tabbar/tabs/inicio/components/Segment/useCategoryOrPlatform'

const props = defineProps({
  componentList: {
    type: Array,
    default: () => [],
  },
  negateCategoryType: {
    type: Boolean,
    default: false
  }
});
// 大写字母
const PROVIDE_NAME1 = 'swiperNavigationInject';

const { t } = useI18n();

const total = ref(0);
const previewSize = ref(0);
const swiperRef = ref();
const swiperIndex = computed(() => swiperRef.value?.activeIndex ?? 0);
const title = computed(() => t('sort.000001'));

const swiperToSlide = (direction: 'prev' | 'next' = 'next') => {
  if (direction === 'prev')
    swiperRef.value.slidePrev();
  else
    swiperRef.value.slideNext();
}

const previewSizeChange = (length: number) => {
  previewSize.value = length;
}

const totalChange = (length: number) => {
  total.value = length;
}

const swiperChange = (swiper: any) => {
  swiperRef.value = swiper;
};

provide('swiperNavInject', {
  totalChange,
  swiperChange,
  swiperToSlide,
  previewSizeChange,
});

provide(PROVIDE_NAME1, {
  logo: getImageUrl('svg/platform.svg'),
  size: 1,
  total,
  title,
  previewSize,
  swiperIndex,
  swiperToSlide,
})

const { filterComponentList } = useCategoryOrPlatform(props)
</script>

<style scoped lang="less">
.swiper-wrap {
  background: var(--ep-color-background-fill-surface-raised-L1, #18254E);
}
</style>