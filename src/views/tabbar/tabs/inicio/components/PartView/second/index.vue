<!-- 三方合作栏 -->
<template>
  <div class="flex flex-col items-center">
    <!-- 社交媒体 -->
    <div v-if="mediaList.length && socialMedia" class="w-full mb-8">
      <p class="title font-bold">{{ $t('title.socialNetworks') }}</p>
      <p class="sub mb-5">{{ $t('subtitle.contactUs') }}</p>
      <ion-row class="w-full gap-5">
        <img class="w-10 image-style" :src="item.icon" v-for="item of mediaList" :key="item.id"
          @click="linkHandle(item.link, item.type)" />
      </ion-row>
    </div>
    <div v-if="paymentPlatform" class="w-full mb-8">
      <p class="title font-bold">{{ $t('title.gamePlatform') }}</p>
      <p class="sub">{{ $t('subtitle.collaborate') }}</p>
      <ion-img class="w-full" :src="gamePartnerPic" />
    </div>
    <div v-if="paymentPartnerPic" class="w-full mb-8">
      <p class="title font-bold">{{ $t('title.supported') }}</p>
      <p class="sub mb-5">{{ $t('subtitle.channels') }}</p>
      <ion-img class="w-full" :src="paymentPartnerPic" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonRow, IonImg } from '@ionic/vue'
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


const { 
  mediaList,
  linkHandle,
  gamePartnerPic,
  paymentPartnerPic,
} = usePartViewLogic()

</script>

<style scoped>
.box {
  width: 4rem;
}

.image-style {
  object-fit: contain;
}

p.title {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.5;
  color: var(--color-base);
}

p.sub {
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.5;
  color: var(--color-secondary);
}

div.line {
  background: var(--line-color);
}
</style>
