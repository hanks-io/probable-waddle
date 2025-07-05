<template>
  <div class="headerBgImage pt-1 flex items-center pr-[1rem] h-12 pl-[.5625rem]">
    <div class="flex items-center">
      <div class="sort logo-container">
        <ion-icon src="/first/svg/sort/blue_light.svg" class="icon-light text-[1.375rem]" />
        <GradientSVG :src="sortLogoSrc" class="logo" />
      </div>
      <ion-label v-if="titleType === '1'" class="font-black">{{ $t(`sort.${props.type}`) }}</ion-label>
      <ion-label v-if="titleType === '2'" class="font-black">{{ props.platformInfo.name.toUpperCase() + " " +
        $t(`sort.${type}`) }}</ion-label>
      <div class="blueLine bg-[#1680DC] w-[0.0625rem] h-[1.75rem] ml-[0.625rem] mr-[0.5rem]"></div>
      <ion-label class="tab leading-3 px-[0.1875rem] py-[.1875rem] rounded-[.1875rem] text-right text-[0.75rem]">
        <span class="font-black">{{ props.total }}</span><br>
        <span class="opacity-40">{{ $t('sort.ALL') }}</span>
      </ion-label>
    </div>
    <div class="arrow-container" v-if="showNextBtn">
      <ion-icon class="tab bg-[#354165] text-[#1680DC] text-sm px-1.5 py-1.5 rounded-full mx-[.3125rem]"
        :class="props.swiperIndex == 0 ? 'none' : ''" :icon="arrowBack" @click="emits('swiperToSlide', 'prev')" />
      <ion-icon class="tab bg-[#354165] text-[#1680DC] text-sm px-1.5 py-1.5 rounded-full" :icon="arrowForward"
        :class="isNext" @click="emits('swiperToSlide')" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { arrowBack, arrowForward } from "ionicons/icons";
import { IonLabel, IonIcon, IonImg } from '@ionic/vue';
import GradientSVG from '@/components/GradientSVG/index.vue';
import useLogic from '@/views/tabbar/tabs/inicio/components/GameWrapper/components/wrapperHead/logic';


const props = defineProps({
  logo: { type: String, default: '' },             // logo
  titleType: { type: String, default: '1' },           // 标题
  type: { type: String, required: true },             // 游戏类型
  size: { type: Number, required: true },             // swiper每页展示数量
  total: { type: Number, required: true },   // 游戏列表长度
  swiperIndex: { type: Number, required: true },      // swiper当前索引
  platformInfo: { type: Object, required: true },     // 平台信息
  showNextBtn: { type: Boolean, default: true },      // 是否展示下一页按钮
});

const emits = defineEmits(['swiperToSlide', 'categoryHandle']);

const {
  isNext,
  sortLogoSrc,
} = useLogic(props);
</script>

<style lang="less" scoped>
.headerBgImage {
  width: calc(100% + 1.125rem);
  margin-left: -0.5625rem;
  background: url('/images/headerTextBg.png') no-repeat left top /70% 100%;
  margin-block-end: .875rem;
}

.blueLine {
  transform: rotate(30deg);
  transform-origin: 50% 50%;
  /* 以中心为原点 */
}

.sort {
  color: var(--color-icon-platform-sort);
}

.arrow-container {
  margin-inline-start: auto;
}

.tab.none {
  pointer-events: none;
  color: #5A6892;
}

.logo-container {
  position: relative;
  width: 1.875rem;
  height: 1.875rem;
  margin-inline-end: 0.4375rem;

  .icon-light {
    position: absolute;
    top: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
  }

  .logo {
    font-size: 1.875rem;
  }
}
</style>
