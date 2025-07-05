<template>
  <div class="badge-box">
    <div class="badge-item">
      <ion-label class="label">
        {{ $t('subtitle.000001') }}
      </ion-label>
      <socialMedia />
    </div>
    <div class="badge-item">
      <ion-label class="label">
        {{ $t('subtitle.000002') }}
      </ion-label>
      <div class="icon-box">
        <age18 :src="loadImage.icon1"/>
        <progressiveImages class="icon-img" :src="loadImage.icon2"/>
        <progressiveImages class="icon-img" :src="loadImage.icon3"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonLabel } from '@ionic/vue';
import socialMedia from '@/views/tabbar/tabs/inicio/components/PartView/components/socialMedia/1/index.vue'
import age18 from '@/views/tabbar/tabs/inicio/components/FooterContent/components/age18/index.vue'
import progressiveImages from '@/components/GameCard/progressiveImages.vue'

const props = defineProps({
  loadImage: {
    type: Object,
    default: () => ({}),
  },
});

</script>

<style scoped lang="less">
@import './index.less';
</style>