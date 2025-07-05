<script setup lang="ts">
import { IonIcon, IonImg } from '@ionic/vue';
withDefaults(defineProps<{
  visible?: boolean
}
>(), {
  visible: true
})

const emit = defineEmits<{
  (e: 'closeModal'): void;
}>()
const closeModal = () => {
  emit('closeModal')
}
</script>
<template>
  <div class="guide-pwa-wrap">
    <ion-icon class="close" src="/svg/close_button.svg" @click="closeModal"  v-if="visible"/>
    <ion-img class="mouse1" src="/images/guide-mouse1.png" />
    <ion-img class="mouse2" src="/images/guide-mouse2.png" />
    <div class="line"></div>
    <div class="rectangle">{{
      $t('label.launchApp') }}</div>
  </div>
</template>

<style scoped lang="less">
.guide-pwa-wrap {

  position: absolute;
  top: 10px;
  z-index: 9999999 !important;
  left: 50%;
  transform: translateX(-50%);

  .close {
    position: absolute;
    right: -1.5rem;
    top: 5rem;
    font-size: 1.125rem;
  }

  .mouse2 {
    width: 6.0625rem;
    height: 5.375rem;
    position: absolute;
    left: -2.5rem;
    top: 1.5rem;
    z-index: -1;
  }

  .mouse1 {
    width: 5rem;
    height: 5.0625rem;
    position: absolute;
    right: -30px;
    bottom: -2.875rem;
  }

  .line {
    width: 10.75rem;
    height: 6.25rem;
    background: url('/svg/guide-line.svg') no-repeat no-repeat center center;
    background-size: cover;
    margin-left: 80px;
  }

  .rectangle {
    width: 16.25rem;
    height: 4.375rem;
    line-height: 4.375rem;
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    color: #fff;
    background: url('/svg/guide-rectangle.svg') no-repeat center center;
    background-size: cover;
  }
}
</style>


