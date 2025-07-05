<!-- 用户报表 -->
<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar mode="ios">
        <BackButton/>
        <ion-title>{{ $t('label.report') }}</ion-title>
      </ion-toolbar>
      <div class="px-[0.625rem] pt-[0.625rem] tab-box">
        <ion-segment ref="segment" mode="md" :value="segmentValue" @ionChange="segmentChange">
          <ion-segment-button class="min-h-0" :value="item" v-for="item of segmentList" :key="item">
            <ion-button fill="clear" class="base-style" :class="{ 'select-style': segmentValue == item }">{{$t(`tags.${item}`)}}</ion-button>
          </ion-segment-button>
        </ion-segment>
      </div>
    </ion-header>
    <ion-content :scroll-y="false">
      <Statement v-if="segmentValue == 'statement'" />
      <Betting v-else-if="segmentValue == 'betting'" />
      <Personal v-else-if="segmentValue == 'personal'"/>
      <Other v-else-if="segmentValue == 'other'"/>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useReportLogic } from '@/views/user/report/hooks/reportLogic'
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonSegment, IonSegmentButton, IonButton } from '@ionic/vue';
import BackButton from '@/components/BackButton.vue';
import Statement from './components/Statement.vue';
import Personal from './components/Personal.vue';
import Betting from './components/Betting.vue';
import Other from './components/Other.vue';
const {
  segmentList,
  segmentValue,
  isToken,
  segmentChange,
  updateSementVal
} = useReportLogic();

</script>

<style scoped>
ion-toolbar {
  --background: var(--mlm-toolbar-bg-color);
}

.tab-box {
  background-color: var(--color-bg-300);
  border-bottom: 1px solid var(--line-color);
}

/* 设置导航标签布局方式 */
ion-segment.md { 
  display: flex;
  justify-content: left;
}

ion-segment-button.md::part(indicator) {  /* 设置指示器宽度 */
  margin-left: auto;
  margin-right: auto;
}

ion-segment-button.md::part(indicator-background) { /* 设置导航标签指示器的宽度 */
  background: linear-gradient(90deg, #EABD5B 2.63%, #7546EE 100%);
  height: .125rem;
}

ion-segment-button.md ion-button {  /* 取消导航标签的标签与指示器之间的边距 */
  text-transform: none;             /* 取消自动字母大写 */
  height: 2.625rem;
  margin: 0;
  --padding-top: 0px;
  --padding-bottom: 5px;
  --padding-start: 0;
  --padding-end: 0;
  min-width: 0;
}

ion-button.base-style {
  --color: #686299;
  font-size: var(--font-1size-14);
}

ion-button.select-style {
  font-weight: bold;
  --color: #BDB8E1;
}

ion-content {
  --background: var(--color-bg-300);
}

.amber-purple body div#app ion-router-outlet > div.ion-page::after,
.amber-purple body div#app ion-router-outlet > div.ion-page::before {
  width: 0;
  height: 0;
}
</style>
