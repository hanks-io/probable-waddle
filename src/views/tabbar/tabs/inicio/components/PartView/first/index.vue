<!-- 三方合作栏 -->
<template>
  <div class="flex flex-col items-center social-media-container">
    <!-- 社交媒体 -->
    <div v-if="mediaList.length && socialMedia" class="text-center w-full px-[.46875rem]">
      <p class="title text-xl font-bold mb-2.5">{{ $t('title.socialNetworks') }}</p>
      <p class="sub text-xs mb-6">{{ $t('subtitle.contactUs') }}</p>
      <ion-row class="justify-evenly w-full">
        <img class="contain w-10 mb-4" :src="item.icon" v-for="item of mediaList" :key="item.id"
          @click="linkHandle(item.link, item.type)" />
      </ion-row>
    </div>
    <div v-if="paymentPlatform" class="w-full px-[.9375rem] overflow-hidden">
      <div class="line h-[0.0625rem]" />
      <img class="w-full object-contain" :class="mediaList.length ? '' : '-mt-0.5'" :src="gamePartnerPic" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonRow } from '@ionic/vue'
import usePartViewLogic from '../logic';

withDefaults(defineProps<{
  gamePlatform?: boolean,
  socialMedia?: boolean,
  paymentPlatform?: boolean
}>(), {
  gamePlatform: true,
  socialMedia: true,
  paymentPlatform: true
})

const { mediaList, gamePartnerPic, linkHandle } = usePartViewLogic()
</script>

<style scoped lang="less">
.box {
  width: 4rem;
}

p.title {
  color: var(--trilateral-cooperation-color);
}

p.sub {
  color: var(--color-text-40);
}

div.line {
  background: var(--line-color);
}

.purple-light p.sub {
  color: var(--text-color-black-80);
}


#social-media-container-comp-index {
  .style() {
    .social-media-container {
      p.title {
        color: var(--ep-color-text-warning);
        font-size: var(--ep-font-size-l, 1rem);
        font-weight: var(--ep-font-weight-medium, 600);
        line-height: 1.5rem
      }

      .sub {
        color: var(--ep-color-text-weaker);
        font-size: var(--ep-font-size-xs, .625rem);
        line-height: 1rem;
      }

     
    }


  }

}

.new-skin-symbol {
  #social-media-container-comp-index.style()
}
</style>
