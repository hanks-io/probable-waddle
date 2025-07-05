<template>
  <div  :class="[showFrame ? showFrame === 'red' ? 'frame-red' : 'frame-green' : '', cardStyle, 'game-card']">
    <ion-icon class="platform-icon" :src="logo" v-if="isLogo"/>
    <ion-icon :class="[isFavorite ? 'animate-star active' : '', 'favorite']" :src="favoriteIcon" @click.stop="favoriteHandle"/>
    <progressiveImages 
      class="game-img" 
      errorImage="/icons/heart.png"
      lowResolutionImage="/icons/heart.png"
      :src="newImageSrc"
    />
    <progressiveImages 
      v-if="status === 'MAINTAIN'"
      class="game-status"
      src="/icons/maintain.png"
      @click.stop="showToast('toast.gameMaintain', 'warning')"
    />
    <div class="game-name">
      <slot name="gameName" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from "@ionic/vue";
import { computed } from 'vue';
import { showToast } from '@/utils'
import progressiveImages from '@/components/GameCard/progressiveImages.vue';
import { isGray, isProd } from "@/utils/app";
import useCardStyle from './useCardStyle';
import favoriteIcon from '@/assets/svg/favorite.svg'

const props = withDefaults(
  defineProps<{
    logo?: string;
    status: string;
    isLogo: boolean;
    gameInfo: {
      logoFlag: string;
    };
    isFavorite: boolean;
    isOwnGame?: boolean;
    test?: boolean;
  }>(),
  {
    logo: '',
    isLogo: false,
    isFavorite: false,
    isOwnGame: false,
    test: false,
  },
);

const emit = defineEmits(["favoriteHandle"]);

const showFrame = computed(() => {
  if((isGray() || !isProd()) && props.isOwnGame){
    return props.test ? 'red' : 'green';
  }
  return false;
});
// 收藏事件的回调用
const favoriteHandle = () => {
  emit("favoriteHandle");
};

const {
  cardStyle,
  newImageSrc,
} = useCardStyle(props)

</script>

<style scoped lang="less">
@import './index.less';
</style>
