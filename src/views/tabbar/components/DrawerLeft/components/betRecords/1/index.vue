<template>
  <ion-menu-toggle class="records" @click="jumpBet">
    <div class="img-wall">
      <ion-img :src="`/images/betCoin.png`" />
    </div>
    <div>
      <ion-label class="label">{{ $t('label.bettingRecords') }}</ion-label> <br>
      <ion-label class="label-sub">{{merchantCy}}&nbsp;{{ formatMoneyToShow(personTodayBet) }}</ion-label>
    </div>
  </ion-menu-toggle>
</template>

<script setup lang="ts">
import { IonMenuToggle, IonImg, IonLabel } from '@ionic/vue';
import { formatMoneyToShow } from "@/utils/custom";
import useBetRecordsLogic from '@/views/tabbar/components/DrawerLeft/components/betRecords/logic';

const {
  jumpBet,
  merchantCy,
  personTodayBet,
} = useBetRecordsLogic();

</script>

<style lang="less" scoped>
@import './index.less';
</style>