<!-- 游戏入口 -->
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
          <ion-icon class="logo absolute top-0 text-[1.375rem]" :src="platformLogo" v-if="isShowPlatformLogo" />
          <div class="absolute bottom-0 w-full rectangle h-11">
            <div class="absolute inset-0 overflow-hidden" :style="`background: url(${img})`">
              <p
                class="absolute inset-0 z-10 flex flex-col items-center justify-center text-center"
                :style="`background:linear-gradient(180deg, rgba(99, 99, 99, 0) -3.14%, rgba(18, 124, 251, 0.43) 117.65%)`"
              >
                <span ref="gameNameRef" class="game-name">{{ gameName }}</span>
              </p>
            </div>
          </div>
          <ion-img
            class="absolute inset-0 z-10"
            src="/icons/maintain.png"
            v-if="status === 'MAINTAIN'"
            @click.stop="showToast('toast.gameMaintain', 'warning')"
          />
        </div>
      </slot>
      <slot name="gameName"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { IonImg } from "@ionic/vue";
import { showToast } from '@/utils'
import { computed } from "vue";
import { isGray, isProd } from "@/utils/app";

const props = withDefaults(
  defineProps<{
    isFavorite?: boolean;
    status?: string;
    platformLogo?: string;
    cardBgStyle?: string;
    gameName?: string;
    img?: string;
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

const isShowPlatformLogo = ref(true);
const gameNameRef = ref<HTMLElement | null>(null);
  const showFrame = computed(() => {
  if((isGray() || !isProd()) && props.isOwnGame){
    return props.test ? 'red' : 'green';
  }
  return false;
});

/**
 * @description: 收藏按钮点击事件
 */
const favoriteHandle = () => {
  emit("favoriteHandle");
};
</script>

<style scoped>
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
  border-radius: 0.375rem;
  overflow: hidden;
  background:
    url("/icons/heart.png") no-repeat center center,
    #182434;
  background-size: 45% auto;
}

div.rectangle div::after {
  content: "";
  position: absolute;
  inset: -0.5rem;
  background: inherit;
  background-size: 100% auto !important;
  background-position: center bottom !important;
  filter: blur(6px);
}

span.game-name {
  font-family: "Sansita One";
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1rem;
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
</style>
