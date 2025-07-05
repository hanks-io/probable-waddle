<!-- 稽核记录 -->
<script setup lang="ts">
import { formatMoneyToShow } from '@/utils/custom'
import {  IonRefresher, IonRefresherContent } from '@ionic/vue';
import useAudit from '../../hooks/useAudit'
import SelectList from '@/components/first/selectlist/index.vue'
import { getAuditTypeName, getAuditStatusName, getAuditStatusColorFirst } from '@/hooks/useAuditStatusName'
import Empty from '@/components/Empty/index.vue'
const {
  flowTypeIndex,
  sumValues,
  loading,
  recordList,
  detailHandle,
  handleRefresh,
} = useAudit()
const { t } = useI18n() // 国际化
const selectList = [`${t('main.all')}`, `${t('option.recharge')}`, `${t('option.activity')}`, `${t('viewsAssets.systemAudit')}`].map((name, id) => {
  return { id, name }

})

</script>
<template>
  <!-- 头部选项和信息 -->
  <div class="flex-between audit-header">
    <div class=" border-[0.0625rem] border-[--report-select-item-border-color] rounded-[0.375rem] overflow-hidden flex items-center h-[2rem]">
      <SelectList :selectList="selectList" v-model="flowTypeIndex" />
    </div>
    <p class="text">{{ $t('viewsAssets.pendingAuditAmount') }}: <span>{{ `${formatMoneyToShow(sumValues)}` }}</span></p>
  </div>


  <ion-refresher slot="fixed" :pull-factor="0.5" :pull-min="100" :pull-max="200" @ionRefresh="handleRefresh($event)">
    <ion-refresher-content></ion-refresher-content>
  </ion-refresher>



  <!-- 暂无数据 -->
  <div class="flex flex-col items-center justify-center" v-if="!loading && !recordList.length">
    <div class="w-[7.5rem] h-[7.5rem] mt-[8.5rem]">

      <Empty />

    </div>

  </div>



  <!-- 稽核记录列表 -->
  <div class="record-wrap" @click="detailHandle(item)" v-for="item in recordList" :key="item.orderNo">
    <div class="flex-between top">
      <p>{{ getAuditTypeName(item.flowType) }}</p><span>{{ formatMoneyToShow(item.unfinished) }}</span>
    </div>

    <div class="flex-between bottom">
      <p class="flex-1">{{ item.createTime }} </p>
      <span :style="{ color: `var(${getAuditStatusColorFirst(item.status)})` }">{{ getAuditStatusName(item.status)
        }}</span>
    </div>
  </div>

</template>



<style scoped lang="less">
.audit-header {
  margin: 0 0 1rem;

  .text {
    .dynamic-font(@fontSize: --font-size-14);
    text-align: right;

    span {
      .dynamic-font(@fontSize: --font-size-16, @fontWeight: --font-weight-bold, @color: --color-currency);
    }
  }
}
</style>
