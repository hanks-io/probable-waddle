<template>
  <div class="aspect-ratio-box" :class="showFrame ? showFrame === 'red' ? 'frame-red' : 'frame-green' : ''">
    <div class="card">
      <slot>
        <div class="relative flex flex-col items-center h-full" :style="cardBgStyle">
          <div class="flex justify-end w-full p-1">
            <ion-img
              :class="['w-6', isFavorite ? 'animate-star' : '']"
              :src="`/icons/favorite_${isFavorite ? 'on' : 'off'}.png`"
              @click.stop="favoriteHandle"
            />
          </div>
          <ion-icon class="logo text-[1.375rem] absolute top-0" :src="platformLogo" v-if="isShowPlatformLogo" />
          <ion-img
            v-if="status === 'MAINTAIN'"
            class="absolute inset-0 z-10"
            src="/icons/maintain.png"
            @click.stop="showToast('toast.gameMaintain', 'warning')"
          />
          <slot class="game-name" name="gameName" />
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonImg, IonIcon } from "@ionic/vue";
import { showToast } from '@/utils'
import { computed } from "vue";
import { isGray, isProd } from "@/utils/app";

const props = withDefaults(
  defineProps<{
    isFavorite?: boolean;
    status?: string;
    platformLogo?: string;
    isShowPlatformLogo?: boolean;
    cardBgStyle?: string;
    isOwnGame?: boolean;
    test?: boolean;
  }>(),
  {
    isFavorite: false,
    isShowPlatformLogo: true,
    isOwnGame: false,
    test: false,
  },
);
const emit = defineEmits(["favoriteHandle", "popularHandle"]);
console.warn('gameCard');
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
</script>

<style scoped lang="less">
.aspect-ratio-box {
  position: relative;
  width: 100%;
  padding-top: 130%;
}

.card {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: var(--rounded-card-game);
  overflow: hidden;
  background:
    url("/icons/heart.png") no-repeat center center,
    var(--color-bg-200);
  background-size: 45% auto;
}

ion-icon.logo {
  color: var(--color-icon-platform-card);
}

.frame-red {
  border: 1px solid red;
}
.frame-green {
  border: 2px solid green;
}

.game-name {
  .flex-center();
  text-align: center;
  font-size: 0.75rem;
  color: var(--color-text-100);
}
</style>
