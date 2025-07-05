<script setup lang="ts">
import DetailsComp from '@/views/activity/commission/comp/DetailsComp.vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/vue'
import BackButton from '@/components/BackButton.vue'

</script>
<template>
  <ion-page>
    <DetailsComp>
      <template #header>
        <ion-header class="ion-no-border">
          <ion-toolbar mode="ios">
            <BackButton />
            <ion-title class="commission-title">{{ $t("viewsAssets.RechargeDetails") }}</ion-title>
          </ion-toolbar>
        </ion-header>

      </template>
      <template #contentTitle>

        <div class="text font-weight-bold flex items-center"><ion-icon class="mr-[0.25rem]" :src="`/images/activity/commission/textFixLeft.svg`"></ion-icon>{{ $t("viewsAssets.RechargeDetails") }}<ion-icon class="ml-[0.25rem]" :src="`/images/activity/commission/textFixRight.svg`"></ion-icon></div>

      </template>
    </DetailsComp>
  </ion-page>
</template>






<style scoped lang="less">
@import url('@/views/activity/commission/style_1/commom.less');


:deep(.style_1) {
  ion-content::part(background) {
    background: #013622;
  }

  .table-item {


    .right-item {
      color: #DF8644;
      
    }

    
  }
}
</style>
