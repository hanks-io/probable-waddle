<script setup lang="ts">
import {IonRefresher, IonRefresherContent} from '@ionic/vue';
import useLogic from '../../hooks/useRecord'
import AssetsOrderModal from '@/components/AssetsOrderModal/index.vue'
import Empty from '@/components/Empty/index.vue'
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
} = useLogic()

</script>
<template>
  <!-- 头部选项和信息 -->
  <TopArea :totalAmount="sumValues" v-model:changeTime="changeTime" @timeChange="timeChange" size="4"
    iconPath="/first/svg/select-icon.svg" :totalText="`${t('label.accumulatedWithdraw')}`" />
  <ion-refresher slot="fixed" :pull-factor="0.5" :pull-min="100" :pull-max="200" @ionRefresh="handleRefresh($event)">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>
  <!-- 暂无数据 -->
  <div class="flex flex-col items-center justify-center" v-if="!loading && !recordList.length">
    <div class="w-[7.5rem] h-[7.5rem] mt-36 ">

      <Empty />
    </div>

  </div>
  <!-- 提现记录列表 -->
  <RecordList :recordList="recordList" @detailHandle="detailHandle" copyIconPath="/first/svg/assets/copy.svg" />
  <!-- 提现详情弹出框 -->
  <AssetsOrderModal v-model="modalVisible" :amount="withdrawDetail.amount" :status="withdrawDetail.status"
    :data="orderList" />

</template>

<style scoped lang="less">

</style>
