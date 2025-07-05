<!-- 用户报表 -->
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar mode="ios">
        <BackButton/>
        <ion-title>{{ $t('label.report') }}</ion-title>
      </ion-toolbar>
      <div class="tab-box">
        <ion-segment ref="segment" mode="md" :value="segmentValue" @ionChange="segmentChange">
          <ion-segment-button  :value="item" v-for="item of segmentList" :key="item">
            <ion-button fill="clear" :class="segmentValue == item ? 'selected-tab' : 'base-tab'">
              {{$t(`tags.${item}`)}}
            </ion-button>
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

<style scoped lang="less">
@import '@/views/user/report/default/styles/base-index.less' ;
@import '@/views/user/report/default/styles/theme-style.less' ;
#tabbar-user-report-default-index.style();
.blue-default {
  #tabbar-user-report-default-index.style();
}
.green-default {
  #tabbar-user-report-default-index.style(
    --color-bg-300,
    --color-text-gray-200,
    --color-text-gray-100,
    --color-line,
    --theme-color-600
  );
}
.amber-purple {
  #tabbar-user-report-default-index.style(
    --color-bg-300,
    --color-text-gray-200,
    --color-text-gray-100,
    --color-line,
    --theme-color-gradient-100
  );
}

.forest-green {
  #tabbar-user-report-default-index.style(
    --color-bg-300,
    --color-text-gray-200,
    --color-text-gray-100,
    --color-bg-200,
    --color-line
  )
}
.auroral-yellow{
  #tabbar-user-report-default-index.style(
    @Report05: --theme-color-800,
  );
}
</style>
