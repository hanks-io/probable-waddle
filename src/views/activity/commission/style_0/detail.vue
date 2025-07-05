<script setup lang="ts">
import DetailsComp from '@/views/activity/commission/comp/DetailsComp.vue';
import {
  IonPage,
} from '@ionic/vue'


</script>
<template>
  <ion-page>
    <DetailsComp />
  </ion-page>
</template>


<style scoped lang="less">
:deep(.purple-light.style_0) {
  .text {
    color: #FF8C00;
  }

  .table-header {
    background: #E0D0FF;
    color: #403D4F80;

  }
  .table-item {
    .left-item {
      color: #403D4F;
    }

    .right-item {
      color: #DF8644;
    }

    &:nth-child(even) {
      background: #E0D0FF;
    }
  }

}
</style>
