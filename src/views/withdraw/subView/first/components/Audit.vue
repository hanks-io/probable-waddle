<!-- 稽核记录 -->
<script setup lang="ts">
import { formatMoneyToShow } from '@/utils/custom'
import { IonRefresher, IonRefresherContent } from '@ionic/vue';
import useAudit from '../../hooks/useAudit'
import SelectList from '@/components/first/selectlist/index.vue'
import { getAuditTypeName, getAuditStatusName, getAuditStatusColorFirst } from '@/hooks/useAuditStatusName'
import Empty from '@/components/Empty/index.vue'
const {
  flowTypeIndex,
  sumValues,
  loading,
  recordList,
  selectList,
  detailHandle,
  handleRefresh,
  handleChange
} = useAudit()



</script>
<template>
  <!-- 头部选项和信息 -->
  <div class="audit-header">
    <SelectList :selectList="selectList" v-model="flowTypeIndex" @handleChange="handleChange" />
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
      <span :style="{ color: `var(${getAuditStatusColorFirst(item.status)})` }" :class="item.status">{{
        getAuditStatusName(item.status)
        }}</span>
    </div>
  </div>

</template>



<style scoped lang="less">
.audit-header {
  margin: 0 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
   

  .text {
    .dynamic-font(@fontSize: --font-size-14);
    text-align: right;
    width:11.875rem;
    line-height: .875rem;
    span {
      .dynamic-font(@fontSize: --font-size-16, @fontWeight: --font-weight-bold, @color: --color-currency);
    }
  }
}

.new-skin-symbol {


  .record-wrap {
    padding: 0.5625rem 0.6406rem 0.5938rem 0.625rem;
    background: var(--ep-color-background-fill-surface-raised-L1);
    border-radius: var(--ep-border-radius-m);

    .top {
      color: var(--ep-color-text-default);
      margin-bottom: 0.7813rem;
      font-size: var(--ep-font-size-m);
      font-weight: var(--ep-font-weight-medium);
    }

    .bottom {
      font-size: var(--ep-font-size-s);
      font-weight: var(--ep-font-weight-regular);

      p {
        color: var(--ep-color-text-weaker);
      }

      span.ongoing {
        color: var(--ep-color-text-warning) !important;
      }

      span.completed {
        color: var(--ep-color-text-success) !important;
      }

      span.notStarted {
        color: var(--ep-color-text-danger) !important;
      }
    }
  }

  .audit-header {
    margin-top: 1.4375rem;
  }
  .audit-header .text {
    font-size: var(--ep-font-size-s);
    font-weight: var(--ep-font-weight-regular);
    color: var(--ep-color-text-default);
  }

  .audit-header .text span {
    font-size: var(--ep-font-size-s);
    font-weight: var(--ep-font-weight-bold);
    color: var(--ep-color-text-warning);
  }
}
</style>
