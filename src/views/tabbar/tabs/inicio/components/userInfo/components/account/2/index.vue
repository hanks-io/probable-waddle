<template>
  <div v-if="user?.userId" :class="['log-in-box', layoutType]">
    <ProgressiveImages
      class="account-icon"
      :src="userPhoto"
    />
    <div class="account-info">
      <ion-label class="label">
        {{ user.phoneNumber }}
      </ion-label>
      <ion-label class="sub-label">
        ID:{{ user.userId }}
      </ion-label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonLabel } from '@ionic/vue';
import ProgressiveImages from '@/components/GameCard/progressiveImages.vue';
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
  userPhoto,
} = useAccountLogic();
</script>

<style scoped lang="less">
@import './index.less';
</style>