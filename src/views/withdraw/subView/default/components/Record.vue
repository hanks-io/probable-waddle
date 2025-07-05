<script setup lang="ts">
import { IonContent, IonRefresher, IonRefresherContent, IonLabel} from "@ionic/vue";
import useLogic from "../../hooks/useRecord";
import AssetsOrderModal from '@/components/AssetsOrderModal/index.vue'
import TopArea from '@/views/recharge/record/comp/TopArea.vue'
import RecordList from '@/views/recharge/record/comp/RecordList.vue'
const {
  sumValues,
  loading,
  recordList,
  modalVisible,
  withdrawDetail,
  changeTime,
  orderList,
  handleRefresh,
  detailHandle,
  timeChange,
  t
} = useLogic();
</script>
<template>
  <ion-content class="ion-padding">
    <!-- 头部选项和信息 -->

    <!-- 头部选项和信息  $t("label.accumulatedRecharge") -->
    <TopArea :totalAmount="sumValues" v-model:changeTime="changeTime" @timeChange="timeChange"
      :totalText="`${t('label.accumulatedWithdraw')}`" />
    <ion-refresher slot="fixed" :pull-factor="0.5" :pull-min="100" :pull-max="200" @ionRefresh="handleRefresh($event)">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>
    <!-- 暂无数据 -->
    <div class="empty" v-if="!loading && !recordList.length">
      <div class="empty-bg-img"></div>
      <ion-label color="medium">{{ $t("label.noRecord") }}</ion-label>
    </div>
    <!-- 提现记录列表 -->
    <!-- 提现记录列表 -->
    <RecordList :recordList="recordList" @detailHandle="detailHandle" />
    <!-- 提现详情弹出框 -->
    <AssetsOrderModal v-model="modalVisible" :amount="withdrawDetail.amount" :status="withdrawDetail.status"
      :data="orderList" />

  </ion-content>
</template>

<style scoped lang="less">
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .empty-bg-img {
    width: 7.5rem;
    height: 7.5rem;
    margin-top: 9rem;
  }
}


</style>
