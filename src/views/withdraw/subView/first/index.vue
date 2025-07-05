<script setup lang="ts">
import BackButton from '@/components/BackButton.vue'
import {

  IonPage,
  IonTitle,
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
import Record from './components/Record.vue'
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
        <ion-title>{{$t('viewsAssets.withdrawalRecord')}}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-segment mode="md" v-model="tabValue">
      <template v-for="it in tabList">
        <ion-segment-button class="btn-center" :value="it.value">
          <ion-label :class="tabValue == it.value ? 'active' : 'inactive'">{{
            it.text }}</ion-label>
        </ion-segment-button>
      </template>
    </ion-segment>
    <ion-content class="first-content">

      <component :is="tabValue == WithdrawPageType.WITHDRAW_AUDIT ? Audit : Record"></component>
    </ion-content>

  </ion-page>
</template>

<style scoped lang="less">
*{
  font-family: "Saira";
}

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

ion-segment {
    --background: var(--color-bg-300);
    padding-left: 0.625rem;
    padding-right: 0.625rem;
    ion-label {
      font-size: 0.875rem;
      font-weight: 700;
      text-transform: none;
    }
    ion-label.inactive {
      font-weight: 400;
    }
 }


.new-skin-symbol {
  ion-content {
    --background: var(--ep-color-background-fill-body-default);
  }
  ion-toolbar {
    --background: var(--ep-color-background-fill-top-nav-secondary);
    color: var(--ep-color-text-default);
  }

  ion-segment {
    --background: var(--ep-color-background-fill-surface-lowered);
    border-bottom: 0.0625rem solid var(--ep-color-border-default);
    .segment-button-checked.md::part(indicator-background) {
      background: var(--ep-color-text-selected);
    }
    ion-label {
      font-size: var(--ep-font-size-m);
    }
    ion-label.active {
      color: var(--ep-color-text-selected);
      font-weight: var(--ep-font-weight-bold);
    }
    ion-label.inactive {
      color: var(--ep-color-text-weaker);
      font-weight: var(--ep-font-weight-regular);
    }
  }
  ion-title {
    color: var(--ep-color-text-default);
    font-size: var(--ep-font-size-xl);
    font-weight: var(--ep-font-weight-medium);
  }
}
</style>
