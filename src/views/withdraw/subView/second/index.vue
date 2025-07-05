<script setup lang="ts">
import BackButton from '@/components/BackButton.vue'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonLabel,
  IonSegment,
  IonContent,
  IonSegmentButton,
} from '@ionic/vue'
import useLogic from '../hooks/useLogic'
import { WithdrawPageType } from '@/hooks/useWithdraw'
import useAddThemeClassName from '@/hooks/useAddThemeClassName'
import Record from '../first/components/Record.vue'
import Audit from './components/Audit.vue'
import NavigationBar from '@/components/NavigationBar/index.vue'
const { tabValue, tabList, isHideAuditRecords } = useLogic()

</script>
<template>
  <ion-page>
    <NavigationBar v-if="isHideAuditRecords" :title="$t('viewsAssets.withdrawalRecord')" />
    <ion-header v-else :class="['ion-no-border', useAddThemeClassName()]">
      <ion-toolbar mode="ios">
        <BackButton />
        <ion-segment mode="md" v-model="tabValue">
          <template v-for="it in tabList">
            <ion-segment-button class="btn-center" :value="it.value">
              <ion-label :class="tabValue == it.value ? 'active' : 'inactive'">{{
                it.text }}</ion-label>
            </ion-segment-button>
          </template>
        </ion-segment>
      </ion-toolbar>
    </ion-header>
    <ion-content class="first-content">

      <component :is="tabValue == WithdrawPageType.WITHDRAW_AUDIT ? Audit : Record"></component>
    </ion-content>

  </ion-page>
</template>

<style scoped lang="less">
ion-content.first-content {
  width: 24.375rem;
  box-sizing: border-box;
  --padding-top: 12px;
  --padding-start: 12px;
  --padding-end: 12px;
  --background: var(--color-bg-300);
}

ion-header ion-toolbar.ios {
  --padding-top: 0;
  --padding-bottom: 0;
  background: var(--color-bg-second);
}

ion-toolbar ion-segment.md {
  /* 设置导航标签布局方式 */
  display: flex;
  justify-content: left;
}

ion-toolbar ion-segment-button.md::part(native) {
  /* 设置导航标签的宽度 */
  padding: 0;
}

ion-toolbar ion-segment-button.md::part(indicator) {
  /* 设置指示器宽度 */
  margin-left: auto;
  margin-right: auto;
}



.segment-button-checked.md::part(native) {
  color: var(--color-text-50);

}

ion-label.active {
  color: var(--color-primary-800);
  font-weight: var(--font-weight-bold);
}

ion-label.inactive {
  color: var(--color-text-40)
}

ion-toolbar ion-segment-button.md::part(indicator-background) {
  /* 设置导航标签指示器的宽度 */
  background: var(--color-primary-800);
  height: 2px;
}



ion-toolbar ion-segment-button.md ion-label {
  /* 取消导航标签的标签与指示器之间的边距 */
  font-size: 0.78rem;
  margin-top: 0;
  margin-bottom: 0;
  text-transform: none;
}

ion-toolbar ion-segment-button.btn-center {
  padding: 0 0.5rem;
}

.scheme-light {
  ion-header ion-toolbar.ios {
    --background: var(--color-bg-400)
  }

  ion-label.inactive {
    color: var(--color-text-secondary-2)
  }

  .segment-button-checked.md::part(native) {
    color: var(--color-text-secondary-1);

  }

 

  ion-label.active {
    color: var(--color-text-secondary-1)
  }

}
</style>
