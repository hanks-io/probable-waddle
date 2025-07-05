<template>
  <div :class="['account', layoutType]">
    <div v-if="!user?.userId" class="log-out-box">
      <ProgressiveImages
        class="account-icon"
        :src="loadImage.icon1"
      />
      <ion-label class="label">
        {{ website }}
      </ion-label>
    </div>
    <Account2 />
  </div>
</template>

<script setup lang="ts">
import { IonLabel } from '@ionic/vue';
import ProgressiveImages from '@/components/GameCard/progressiveImages.vue';
import Account2 from '@/views/tabbar/tabs/inicio/components/userInfo/components/account/2/index.vue'
import useAccountLogic from './logic';


const props = defineProps({
  loadImage: {
    type: Object,
    default: () => ({})
  },
  layoutType: {
    type: String,
    default: 'layout1'
  }
})

const {
  user,
  website,
} = useAccountLogic();
</script>

<style scoped lang="less">
@import './index.less';
</style>