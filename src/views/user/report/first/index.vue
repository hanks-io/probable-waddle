<!-- 用户报表 -->
<template>
  <ion-page>
    <NavigationBar :title="$t('label.report')" />
    <div class="px-[0.625rem] report-tab">
      <ion-segment ref="segment" mode="md" :value="segmentValue" @ionChange="segmentChange">
        <ion-segment-button class="min-h-0" :value="item" v-for="item of segmentList" :key="item">
          <ion-button fill="clear" class="base-style" :class="{ 'select-style': segmentValue == item }">{{$t(`tags.${item}`)}}</ion-button>
        </ion-segment-button>
      </ion-segment>
    </div>
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
import { IonPage, IonContent, IonSegment, IonSegmentButton, IonButton } from '@ionic/vue';
import NavigationBar from '@/components/NavigationBar/index.vue'
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

<style scoped lang="less">
/* 设置导航标签布局方式 */
ion-segment.md { 
  display: flex;
  justify-content: space-between;
}

ion-segment-button.md::part(indicator) {  /* 设置指示器宽度 */
  margin-left: auto;
  margin-right: auto;
}

ion-segment-button.md::part(indicator-background) { /* 设置导航标签指示器的宽度 */
  background: var(--color-primary-800);
  height: 1px;
}

ion-segment-button.md {
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 2px;
  --padding-bottom: 2px;
  text-transform: capitalize;
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
  --color: var(--my-card-detail-color);
  font-size: 0.875rem;
}

ion-button.select-style {
  font-weight: bold;
  --color: var(--color-primary-800);
}

ion-content {
  --background: var(--color-bg-300);
}

.report-tab {
  background-color: var(--color-bg-400)
}

.new-skin-symbol {
  @import '@/views/user/report/first/styles/theme-style.less';
}
</style>
