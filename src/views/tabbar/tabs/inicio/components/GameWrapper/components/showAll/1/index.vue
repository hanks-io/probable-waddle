<template>
  <div v-if="showAllGame" :class="['more', layoutType]">
    <ion-label class="label">{{$t('main.Displaying', { total, quantity: pageList[swiperIndex] ? pageList[swiperIndex].length : 0 })}}</ion-label>
    <div class="btn" @click="sizeChange">
      <ion-label class="btn-label">{{showAll ? $t('main.Collapse') : $t('main.DisplayAll')}}</ion-label>
      <ion-icon slot="end" icon="/svg/circular-arrow.svg" :class="[showAll ? 'active' : '', 'btn-icon']"/>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { IonLabel, IonIcon } from '@ionic/vue';
  import useLogic from '@/views/tabbar/tabs/inicio/components/GameWrapper/components/showAll/logic';

  const props = defineProps({
    layoutType: { type: String, default: 'layout1' },
  })

  const {
    total,
    showAll,
    pageList,
    swiperIndex,
    sizeChange,
    showAllGame,
  } = useLogic();
</script>

<style scoped lang="less">
@import './index.less';
</style>