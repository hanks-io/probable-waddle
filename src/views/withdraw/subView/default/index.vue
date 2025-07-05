<script setup lang="ts">
import { WithdrawPageType } from "@/hooks/useWithdraw";
import { IonPage, IonHeader, IonToolbar, IonLabel, IonSegment, IonSegmentButton } from "@ionic/vue";
import BackButton from "@/components/BackButton.vue";
import Record from "./components/Record.vue";
import Audit from "./components/Audit.vue";
import useLogic from "../hooks/useLogic";
import NavigationBar from '@/components/NavigationBar/index.vue'
const { tabValue, tabList, isHideAuditRecords } = useLogic();
</script>

<template>
  <ion-page>
    <NavigationBar v-if="isHideAuditRecords" :title="$t('viewsAssets.withdrawalRecord')" />
    <ion-header v-else >
      <ion-toolbar mode="ios" class="top">
        <BackButton />
        <ion-segment mode="md" v-model="tabValue">
          <template v-for="it in tabList">
            <ion-segment-button class="btn-center" :value="it.value">
              <ion-label :class="tabValue == it.value ? 'selected' : 'unselected'">{{ it.text }}</ion-label>
            </ion-segment-button>
          </template>
        </ion-segment>
      </ion-toolbar>
    </ion-header>
    <div class="bottom">
      <component :is="tabValue == WithdrawPageType.WITHDRAW_AUDIT ? Audit : Record"></component>
    </div>
  </ion-page>
</template>

<style scoped lang="less">
@import "@/views/withdraw/subView/default/styles/index-base.less";
@import "@/views/withdraw/subView/default/styles/theme-style.less";
#withdraw-subView-default-index.style();

.blue-default {
  #withdraw-subView-default-index.style();
}

.green-default {
  #withdraw-subView-default-index.style(--color-text-gray-100,
    --color-text-gray-200,
    --theme-color-gradient-100);
}

.amber-purple {
  #withdraw-subView-default-index.style(--color-text-gray-100,
    --color-text-gray-200,
    --theme-color-gradient-100);
}

.auroral-yellow {
  #withdraw-subView-default-index.style(@subView03: --theme-color-800,
  );
}
</style>
