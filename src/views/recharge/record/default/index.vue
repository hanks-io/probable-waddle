<!-- 充值记录 -->
<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonLabel,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from "@ionic/vue";

import useLogic from "../hooks/useLogic";
import QRCode from '@/views/recharge/QRCode/index.vue'
import AssetsOrderModal from '@/components/AssetsOrderModal/index.vue'
import TopArea from '../comp/TopArea.vue'
import RecordList from '../comp/RecordList.vue'
import useHeaderBgColor from '@/views/withdraw/hooks/useHeaderBgColor'
import NavigationBar from '@/components/NavigationBar/index.vue'
import OrderModal from '@/views/recharge/main/comp/orderModal.vue'
const {
  thirdUrl,
  totalAmount,
  loading,
  recordList,
  loadMore,
  iframeLoaded,
  infiniteRef,
  isVirtualCurrency,
  changeTime,
  isOpenOrderModal,
  isQRCode,
  merchantCy,
  QRCodeInfo,
  timeChange,

  handleRefresh,
  detailHandle,
  ionInfinite,
  iframeLoadHandle,
  getPayRecordList,
  t,

} = useLogic()


</script>

<template>
  <ion-page>
    <NavigationBar :title="$t('label.rechargeRecord')" :bgColor="useHeaderBgColor()"/>
    <ion-content class="ion-padding" v-if="!thirdUrl && !isQRCode">
      <ion-refresher slot="fixed" :pull-factor="0.5" :pull-min="100" :pull-max="200"
        @ionRefresh="handleRefresh($event)">
        <ion-refresher-content />
      </ion-refresher>

      <!-- 头部选项和信息  $t("label.accumulatedRecharge") -->
      <TopArea :totalAmount="totalAmount" v-model:changeTime="changeTime" @timeChange="timeChange" :totalText="`${t('label.accumulatedRecharge')}`"/>

      <!-- 暂无数据 -->
      <div class="flex flex-col items-center justify-center" v-if="!loading && !recordList.length">
        <div class="w-[7.5rem] h-[7.5rem] mt-36 empty-bg-img"></div>
        <ion-label color="medium">{{ $t("label.noRecord") }}</ion-label>
      </div>

      <!-- 充值记录列表 -->
      <RecordList :recordList="recordList" @detailHandle="detailHandle" />

      <ion-infinite-scroll ref="infiniteRef" threshold="5px" @ionInfinite="ionInfinite">
        <ion-infinite-scroll-content :loading-text="loadMore == 'noMore' ? '' : ''"
          :loading-spinner="loadMore == 'more' ? 'bubbles' : null" />
      </ion-infinite-scroll>
    </ion-content>


    <ion-content  v-if="isQRCode">
      <QRCode  v-bind="{...QRCodeInfo, merchantCy: merchantCy || ''}" />
    </ion-content>
    <ion-content id="iframe" :class="thirdUrl && !isQRCode ? '' : 'hidden'">
      <iframe class="w-full h-full" v-if="thirdUrl" v-show="iframeLoaded" :src="thirdUrl" @load="iframeLoadHandle"
        frameborder="0" />
      <div class="flex h-full items-center justify-center" v-if="!iframeLoaded">
        <ion-spinner class="w-20 h-20" name="dots" color="light" />
      </div>
    </ion-content>
    <!-- 充值详情弹出框 -->


    <OrderModal :isOpen="isOpenOrderModal" :merchantCy="merchantCy" :isVirtualCurrency="isVirtualCurrency"
      v-if="isOpenOrderModal" @paySuccessCb="getPayRecordList" />

  </ion-page>
</template>

<style scoped lang="less">
ion-infinite-scroll-content {
  min-height: 10px;
  /* 修改最小高度 */
}

ion-content#iframe {
  --background: #fff;
}

</style>
