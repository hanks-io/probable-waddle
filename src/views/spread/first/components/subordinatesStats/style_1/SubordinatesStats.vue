<!-- 直属数据 -->
<template>
  <div class="h-full flex flex-col rounded-[.625rem] text-xs bg-[#101629]">
    <div class="flex px-[7px] pt-[7px] justify-between text-[#566488]" id="popover-trigger" size="small" fill="clear">
      <div class="flex items-center bg-black px-1 py-0.5 rounded-[.375rem]">
        <ion-icon class="text-base my-0.5 ml-1" src="/svg/date.svg"/>
      </div>
      <ion-searchbar id="search-agency" type="number" v-model="searchValue" show-clear-button="never" placeholder="ID" @click.stop="">
        <ion-spinner class="z-10 absolute right-1 w-5 h-5" name="bubbles" color="warning" v-if="loading"/>
      </ion-searchbar>
    </div>
    <ion-item class="text-[.625rem]">
      <ion-grid>
        <ion-row>
          <ion-col size="2">ID</ion-col>
          <ion-col size="3">{{ $t('viewsSpread.subordinateMembers') }}</ion-col>
          <ion-col size="2">{{ $t('activity.agent34') }}</ion-col>
          <ion-col size="3">{{ $t('toggle.performance') }}</ion-col>
          <ion-col size="2" style="justify-content:left">{{ $t('viewsSpread.contributionCommission') }}</ion-col>
        </ion-row>
      </ion-grid>
    </ion-item>
    <div class="flex-1">
      <ion-content>
        
      </ion-content>
    </div>
    <!-- 时间选择器 -->
    <ion-popover mode="md" trigger="popover-trigger" size="cover" trigger-action="click"
      :isOpen="showPopover" :showBackdrop="false"
      @didDismiss="popoverDismiss"
    >
      <ion-datetime presentation="date" mode="ios"
        :min="minDate" :max="maxDate" :show-default-buttons="true" :locale="locale"
      />
    </ion-popover>
    <!-- 详情弹窗 -->
    <ion-modal ref="modal" :is-open="detailModalState" :backdrop-dismiss="false">
      <ion-toolbar mode="ios">
        <ion-title>{{ $t('viewsSpread.directDetails') }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="detailModalDismiss"><ion-icon class="text-xl" :icon="close"/></ion-button>
          </ion-buttons>
        </ion-toolbar>
    </ion-modal>
  </div>
</template>

<script setup lang="ts">
import { close } from 'ionicons/icons';
import { useSubordinatesStatsLogic } from '@/views/spread/hooks/subordinatesStatsLogic'
import { IonPopover, IonIcon, IonDatetime, IonItem, IonRow, IonCol, IonGrid, IonContent, IonSearchbar, IonSpinner, IonModal, IonButton, IonToolbar, IonLabel, IonTitle, IonButtons, IonList, IonImg } from '@ionic/vue';

const {
  minDate,
  maxDate,
  showPopover,
  loading,
  searchValue,
  detailModalState,
  userId,
  locale,
  popoverDismiss,
  detailHandle,
  detailModalDismiss
} = useSubordinatesStatsLogic();

</script>

<style scoped lang="less">
ion-select::part(icon) {
  color: transparent;
}

ion-button#popover-trigger {
  --padding-start: 0;
  --padding-end: 0;
}

#popover-trigger p.on {
  border-bottom: 1px solid #38A8FA;
}

ion-content { /* 滚动内容 */
  --background: transperent;
}

ion-item {
  --background: transparent;
  --padding-start: 0;
  --padding-end: 0;
  --inner-padding-end: 0;
  --border-color: #2A324E;
}

ion-item.odd {
  --background: #151C2F;
}

ion-grid {
  --ion-grid-padding: 0;
}

ion-col {
  --ion-grid-column-padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

ion-modal {
  --height: auto;
  --border-radius: 16px;
  --background: #090F1F;
  background: var(--color-bg-mask-black);
  padding: 0 1.5625rem;
  height: auto;
}

ion-modal ion-toolbar {
  --background: transparent;
  border-bottom: 1px solid #2A324E;
}
</style>
